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
    const usageCount = checkUsage(varName, codeDir, locations.definitions);

    if (usageCount === 0) {
        unusedVars.set(varName, {
            definitions: locations.definitions,
            usageCount
        });
        unusedCount++;
    }
});

// Output results
console.log(`\n== Found ${unusedCount} potentially unused variables ==\n`);

if (unusedCount > 0) {
    console.log('Variable | Defined in | Usage Count');
    console.log('--------- | ---------- | -----------');

    const sortedUnused = [...unusedVars.entries()].sort((a, b) => a[0].localeCompare(b[0]));

    sortedUnused.forEach(([varName, info]) => {
        const definedIn = info.definitions.map(f => path.relative(process.cwd(), f)).join(', ');
        console.log(`${varName} | ${definedIn} | ${info.usageCount}`);
    });
}

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
        // Use simpler grep command that works on macOS
        const command = `cd "${process.cwd()}" && find "${searchDir}" -type f -name "*.scss" -o -name "*.css" | xargs grep -l "${varName}" | wc -l`;
        const result = execSync(command, { encoding: 'utf-8' });
        return parseInt(result.trim(), 10);
    } catch (error) {
        // grep returns non-zero exit code when no matches
        return 0;
    }
} 