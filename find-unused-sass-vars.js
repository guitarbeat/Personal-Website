#!/usr/bin/env node

/**
 * Simple script to find potentially unused SASS variables
 * This is a basic implementation and may have false positives
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const sassDir = './src/sass';  // Use relative paths to avoid issues with spaces
const codeDir = './src';

// Get all SASS files
console.log('Finding SASS files...');
const sassFiles = findFiles(sassDir, '.scss');
console.log(`Found ${sassFiles.length} SASS files.`);

// Extract variables from SASS files
console.log('\nExtracting SASS variables...');
const variables = extractVariables(sassFiles);
console.log(`Found ${variables.size} variables in total.`);

// Check usage of each variable
console.log('\nChecking for unused variables...');
let unusedCount = 0;
const unusedVars = new Map();

variables.forEach((locations, varName) => {
    // Search for variable usage outside its definition files
    const usageFound = checkUsage(varName, codeDir, locations.definitions);

    if (!usageFound) {
        unusedVars.set(varName, {
            definitions: locations.definitions
        });
        unusedCount++;
    }
});

// Output results
console.log(`\n== Found ${unusedCount} potentially unused variables ==\n`);

if (unusedCount > 0) {
    console.log('Variable | Defined in');
    console.log('--------- | ----------');

    const sortedUnused = [...unusedVars.entries()].sort((a, b) => a[0].localeCompare(b[0]));

    sortedUnused.forEach(([varName, info]) => {
        const definedIn = info.definitions.map(f => path.relative(process.cwd(), f)).join(', ');
        console.log(`${varName} | ${definedIn}`);
    });
}

// Helper functions
function findFiles(dir, extension) {
    try {
        // Use find with correct escaping for macOS
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

            lines.forEach(line => {
                // Skip comment lines
                if (line.trim().startsWith('//')) return;

                // Match variable declarations (excluding interpolations)
                const match = line.match(/^\s*(\$[a-zA-Z0-9_-]+)\s*:/);
                if (match) {
                    const varName = match[1];
                    if (!variables.has(varName)) {
                        variables.set(varName, { definitions: [file] });
                    } else {
                        variables.get(varName).definitions.push(file);
                    }
                }
            });
        } catch (error) {
            console.error(`Error processing ${file}:`, error);
        }
    });

    return variables;
}

function checkUsage(varName, searchDir, definitionFiles) {
    try {
        // Simple grep command for macOS
        const command = `cd "${process.cwd()}" && grep -r "${varName}" "${searchDir}" | grep -v "/node_modules/" | wc -l`;
        const result = execSync(command, { encoding: 'utf-8' });
        const count = parseInt(result.trim(), 10);

        // Only count references outside definition files (minus 1 for each definition file)
        const externalReferences = count - definitionFiles.length;

        return externalReferences > 0;
    } catch (error) {
        // grep returns non-zero exit code when no matches
        return false;
    }
} 