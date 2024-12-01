#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const madge = require('madge');
const chalk = require('chalk');

program
  .name('deadfile')
  .description('CLI tool to find dead code and unused files in JavaScript projects')
  .version('1.0.0')
  .argument('<entry...>', 'Entry file(s) to analyze')
  .option('-d, --dir <directory>', 'Custom directory to analyze', process.cwd())
  .option('-e, --exclude [patterns...]', 'Patterns to exclude from analysis')
  .option('--ci', 'Run in CI mode (no report server)', false)
  .parse(process.argv);

const options = program.opts();
const entryFiles = program.args;

async function analyzeDeadCode() {
  try {
    const madgeConfig = {
      baseDir: options.dir,
      excludeRegExp: options.exclude ? options.exclude.map(pattern => new RegExp(pattern)) : [],
      extensions: ['js', 'jsx', 'ts', 'tsx'],
      detectiveOptions: {
        es6: {
          mixedImports: true,
          jsx: true,
        },
        typescript: {
          mixedImports: true,
          jsx: true,
        },
      },
      fileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    };

    console.log(chalk.blue('Analyzing dependencies...'));
    
    for (const entryFile of entryFiles) {
      const absolutePath = path.resolve(options.dir, entryFile);
      if (!fs.existsSync(absolutePath)) {
        throw new Error(`Entry file not found: ${entryFile}`);
      }
      
      const dependencyTree = await madge(absolutePath, madgeConfig);
      const circular = dependencyTree.circular();
      
      // Get all files in the src directory
      const srcPath = path.join(options.dir, 'src');
      const allFiles = getAllFiles(srcPath, ['.js', '.jsx', '.ts', '.tsx'])
        .map(file => path.relative(options.dir, file));
      
      // Get files that are part of the dependency tree
      const dependencies = dependencyTree.obj();
      const usedFiles = new Set();
      
      // Add both the file and its dependencies to the used files set
      Object.entries(dependencies).forEach(([file, deps]) => {
        usedFiles.add(file);
        deps.forEach(dep => usedFiles.add(dep));
      });
      
      // Find unused files
      const orphans = allFiles.filter(file => !usedFiles.has(file));
      
      // Print results
      console.log(chalk.green(`\nResults for ${entryFile}:`));
      
      if (circular.length > 0) {
        console.log(chalk.yellow('\nCircular Dependencies:'));
        circular.forEach(cycle => {
          console.log(`  ${cycle.join(' -> ')}`);
        });
      }

      if (orphans.length > 0) {
        console.log(chalk.yellow('\nPotentially Unused Files:'));
        orphans
          .filter(file => !file.includes('test') && !file.includes('spec'))
          .forEach(file => {
            console.log(`  ${file}`);
          });
      }

      if (circular.length === 0 && orphans.length === 0) {
        console.log(chalk.green('No issues found!'));
      }
    }

    if (!options.ci) {
      console.log(chalk.blue('\nDetailed report available at: http://localhost:3000'));
      // TODO: Implement report server
    }

  } catch (error) {
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

function getAllFiles(dir, extensions) {
  let files = [];
  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!item.startsWith('.') && item !== 'node_modules' && item !== 'build') {
          files = files.concat(getAllFiles(fullPath, extensions));
        }
      } else if (extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(chalk.yellow(`Warning: Could not read directory ${dir}`));
  }
  return files;
}

analyzeDeadCode();
