#!/usr/bin/env node

/**
 * Simple script to list all SASS variables in the project
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const sassDir = './src/sass';

// Get all SASS files
console.log('Finding SASS files...');
const sassFiles = findFiles(sassDir, '.scss');
console.log(`Found ${sassFiles.length} SASS files.`);

// Extract variables from SASS files
console.log('\nExtracting SASS variables...');
const variables = extractVariables(sassFiles);
console.log(`Found ${variables.size} variables in total.\n`);

// Print all variables in alphabetical order
console.log('Variables list:');
console.log('---------------');
console.log('Variable | Defined in | Line');
console.log('-------- | ---------- | ----');

const sortedVars = [...variables.entries()].sort((a, b) => a[0].localeCompare(b[0]));
sortedVars.forEach(([name, info]) => {
    const locations = info.locations.map(loc =>
        `${path.relative(process.cwd(), loc.file)}:${loc.line}`
    ).join(', ');
    console.log(`${name} | ${info.files.join(', ')} | ${locations}`);
});

// Helper functions
function findFiles(dir, extension) {
    try {
        const cmd = `find "${dir}" -type f -name "*${extension}"`;
        const result = execSync(cmd, { encoding: 'utf-8' });
        return result.trim().split('\n').filter(f => f);
    } catch (error) {
        console.error('Error finding files:', error);
        return [];
    }
}

function extractVariables(files) {
    const variables = new Map();

    files.forEach(file => {
        try {
            const content = fs.readFileSync(file, 'utf-8');
            const lines = content.split('\n');

            lines.forEach((line, lineIndex) => {
                // Skip comment lines
                if (line.trim().startsWith('//')) return;

                // Match variable declarations (excluding interpolations)
                const match = line.match(/^\s*(\$[a-zA-Z0-9_-]+)\s*:/);
                if (match) {
                    const varName = match[1];
                    const lineNumber = lineIndex + 1;
                    if (!variables.has(varName)) {
                        variables.set(varName, {
                            files: [path.relative(process.cwd(), file)],
                            locations: [{ file, line: lineNumber }]
                        });
                    } else {
                        const info = variables.get(varName);
                        if (!info.files.includes(path.relative(process.cwd(), file))) {
                            info.files.push(path.relative(process.cwd(), file));
                        }
                        info.locations.push({ file, line: lineNumber });
                    }
                }
            });
        } catch (error) {
            console.error(`Error processing ${file}:`, error);
        }
    });

    return variables;
} 