#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class CopyPasteDetector {
    constructor(options = {}) {
        this.options = {
            minLines: options.minLines || 3,
            minTokens: options.minTokens || 10,
            similarityThreshold: options.similarityThreshold || 0.8,
            ignoreComments: options.ignoreComments !== false,
            ignoreWhitespace: options.ignoreWhitespace !== false,
            ignoreCase: options.ignoreCase !== false,
            extensions: options.extensions || ['.js', '.jsx', '.ts', '.tsx'],
            excludeDirs: options.excludeDirs || ['node_modules', '.git', 'dist', 'build'],
            ...options
        };
        
        this.duplicates = [];
        this.fileContents = new Map();
        this.codeBlocks = new Map();
    }

    // Normalize code by removing comments, whitespace, etc.
    normalizeCode(code) {
        let normalized = code;
        
        if (this.options.ignoreComments) {
            // Remove single-line comments
            normalized = normalized.replace(/\/\/.*$/gm, '');
            // Remove multi-line comments
            normalized = normalized.replace(/\/\*[\s\S]*?\*\//g, '');
        }
        
        if (this.options.ignoreWhitespace) {
            // Remove extra whitespace and normalize
            normalized = normalized.replace(/\s+/g, ' ').trim();
        }
        
        if (this.options.ignoreCase) {
            normalized = normalized.toLowerCase();
        }
        
        return normalized;
    }

    // Generate hash for code block
    generateHash(code) {
        return crypto.createHash('md5').update(code).digest('hex');
    }

    // Extract code blocks from a file
    extractCodeBlocks(filePath, content) {
        const blocks = [];
        const lines = content.split('\n');
        
        // Extract function blocks
        const functionRegex = /^(?:export\s+)?(?:async\s+)?(?:function\s+)?(\w+)\s*\([^)]*\)\s*\{/gm;
        let match;
        
        while ((match = functionRegex.exec(content)) !== null) {
            const startLine = content.substring(0, match.index).split('\n').length;
            const functionName = match[1];
            const functionStart = match.index;
            
            // Find the end of the function
            let braceCount = 0;
            let functionEnd = functionStart;
            let inString = false;
            let stringChar = '';
            
            for (let i = functionStart; i < content.length; i++) {
                const char = content[i];
                
                if (!inString && (char === '"' || char === "'" || char === '`')) {
                    inString = true;
                    stringChar = char;
                } else if (inString && char === stringChar && content[i-1] !== '\\') {
                    inString = false;
                } else if (!inString) {
                    if (char === '{') braceCount++;
                    else if (char === '}') {
                        braceCount--;
                        if (braceCount === 0) {
                            functionEnd = i + 1;
                            break;
                        }
                    }
                }
            }
            
            const functionCode = content.substring(functionStart, functionEnd);
            const normalizedCode = this.normalizeCode(functionCode);
            
            if (normalizedCode.split('\n').length >= this.options.minLines) {
                blocks.push({
                    type: 'function',
                    name: functionName,
                    startLine,
                    endLine: startLine + functionCode.split('\n').length - 1,
                    code: functionCode,
                    normalizedCode,
                    hash: this.generateHash(normalizedCode)
                });
            }
        }
        
        // Extract class blocks
        const classRegex = /^class\s+(\w+)/gm;
        while ((match = classRegex.exec(content)) !== null) {
            const startLine = content.substring(0, match.index).split('\n').length;
            const className = match[1];
            const classStart = match.index;
            
            // Find the end of the class
            let braceCount = 0;
            let classEnd = classStart;
            let inString = false;
            let stringChar = '';
            
            for (let i = classStart; i < content.length; i++) {
                const char = content[i];
                
                if (!inString && (char === '"' || char === "'" || char === '`')) {
                    inString = true;
                    stringChar = char;
                } else if (inString && char === stringChar && content[i-1] !== '\\') {
                    inString = false;
                } else if (!inString) {
                    if (char === '{') braceCount++;
                    else if (char === '}') {
                        braceCount--;
                        if (braceCount === 0) {
                            classEnd = i + 1;
                            break;
                        }
                    }
                }
            }
            
            const classCode = content.substring(classStart, classEnd);
            const normalizedCode = this.normalizeCode(classCode);
            
            if (normalizedCode.split('\n').length >= this.options.minLines) {
                blocks.push({
                    type: 'class',
                    name: className,
                    startLine,
                    endLine: startLine + classCode.split('\n').length - 1,
                    code: classCode,
                    normalizedCode,
                    hash: this.generateHash(normalizedCode)
                });
            }
        }
        
        // Extract arbitrary code blocks (sliding window approach)
        const windowSize = Math.max(this.options.minLines, 5);
        for (let i = 0; i <= lines.length - windowSize; i++) {
            const blockLines = lines.slice(i, i + windowSize);
            const blockCode = blockLines.join('\n');
            const normalizedCode = this.normalizeCode(blockCode);
            
            if (normalizedCode.length > 0 && normalizedCode.split(' ').length >= this.options.minTokens) {
                blocks.push({
                    type: 'block',
                    name: `block_${i}`,
                    startLine: i + 1,
                    endLine: i + windowSize,
                    code: blockCode,
                    normalizedCode,
                    hash: this.generateHash(normalizedCode)
                });
            }
        }
        
        return blocks;
    }

    // Calculate similarity between two code blocks
    calculateSimilarity(code1, code2) {
        const tokens1 = code1.split(/\s+/);
        const tokens2 = code2.split(/\s+/);
        
        const set1 = new Set(tokens1);
        const set2 = new Set(tokens2);
        
        const intersection = new Set([...set1].filter(x => set2.has(x)));
        const union = new Set([...set1, ...set2]);
        
        return intersection.size / union.size;
    }

    // Scan a directory recursively
    scanDirectory(dirPath) {
        const files = [];
        
        const scan = (currentPath) => {
            const items = fs.readdirSync(currentPath);
            
            for (const item of items) {
                const fullPath = path.join(currentPath, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    if (!this.options.excludeDirs.includes(item)) {
                        scan(fullPath);
                    }
                } else if (stat.isFile()) {
                    const ext = path.extname(item);
                    if (this.options.extensions.includes(ext)) {
                        files.push(fullPath);
                    }
                }
            }
        };
        
        scan(dirPath);
        return files;
    }

    // Analyze files for duplicates
    analyzeFiles(files) {
        console.log(`Analyzing ${files.length} files...`);
        
        for (const filePath of files) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                this.fileContents.set(filePath, content);
                
                const blocks = this.extractCodeBlocks(filePath, content);
                this.codeBlocks.set(filePath, blocks);
                
                console.log(`  Processed: ${path.relative(process.cwd(), filePath)} (${blocks.length} blocks)`);
            } catch (error) {
                console.error(`Error reading file ${filePath}:`, error.message);
            }
        }
    }

    // Find exact duplicates
    findExactDuplicates() {
        const hashMap = new Map();
        
        for (const [filePath, blocks] of this.codeBlocks) {
            for (const block of blocks) {
                if (!hashMap.has(block.hash)) {
                    hashMap.set(block.hash, []);
                }
                hashMap.get(block.hash).push({ filePath, block });
            }
        }
        
        for (const [hash, instances] of hashMap) {
            if (instances.length > 1) {
                this.duplicates.push({
                    type: 'exact',
                    hash,
                    instances,
                    similarity: 1.0
                });
            }
        }
    }

    // Find similar code blocks
    findSimilarBlocks() {
        const allBlocks = [];
        
        for (const [filePath, blocks] of this.codeBlocks) {
            for (const block of blocks) {
                allBlocks.push({ filePath, block });
            }
        }
        
        for (let i = 0; i < allBlocks.length; i++) {
            for (let j = i + 1; j < allBlocks.length; j++) {
                const block1 = allBlocks[i];
                const block2 = allBlocks[j];
                
                // Skip if same file and overlapping lines
                if (block1.filePath === block2.filePath) {
                    const overlap = Math.min(block1.block.endLine, block2.block.endLine) - 
                                  Math.max(block1.block.startLine, block2.block.startLine);
                    if (overlap > 0) continue;
                }
                
                const similarity = this.calculateSimilarity(
                    block1.block.normalizedCode,
                    block2.block.normalizedCode
                );
                
                if (similarity >= this.options.similarityThreshold) {
                    this.duplicates.push({
                        type: 'similar',
                        instances: [block1, block2],
                        similarity
                    });
                }
            }
        }
    }

    // Generate report
    generateReport() {
        const report = {
            summary: {
                totalFiles: this.fileContents.size,
                totalBlocks: Array.from(this.codeBlocks.values()).reduce((sum, blocks) => sum + blocks.length, 0),
                exactDuplicates: this.duplicates.filter(d => d.type === 'exact').length,
                similarBlocks: this.duplicates.filter(d => d.type === 'similar').length,
                totalDuplicates: this.duplicates.length
            },
            exactDuplicates: this.duplicates.filter(d => d.type === 'exact'),
            similarBlocks: this.duplicates.filter(d => d.type === 'similar')
        };
        
        return report;
    }

    // Print report to console
    printReport(report) {
        console.log('\n' + '='.repeat(80));
        console.log('COPY-PASTE DETECTION REPORT');
        console.log('='.repeat(80));
        
        console.log('\nSUMMARY:');
        console.log(`  Total files analyzed: ${report.summary.totalFiles}`);
        console.log(`  Total code blocks: ${report.summary.totalBlocks}`);
        console.log(`  Exact duplicates found: ${report.summary.exactDuplicates}`);
        console.log(`  Similar blocks found: ${report.summary.similarBlocks}`);
        console.log(`  Total duplicate instances: ${report.summary.totalDuplicates}`);
        
        if (report.exactDuplicates.length > 0) {
            console.log('\nEXACT DUPLICATES:');
            console.log('-'.repeat(40));
            
            for (const duplicate of report.exactDuplicates) {
                console.log(`\nHash: ${duplicate.hash.substring(0, 8)}...`);
                console.log(`Type: ${duplicate.instances[0].block.type}`);
                console.log(`Name: ${duplicate.instances[0].block.name}`);
                console.log(`Lines: ${duplicate.instances[0].block.startLine}-${duplicate.instances[0].block.endLine}`);
                console.log(`Instances:`);
                
                for (const instance of duplicate.instances) {
                    console.log(`  - ${path.relative(process.cwd(), instance.filePath)}:${instance.block.startLine}-${instance.block.endLine}`);
                }
                
                console.log('\nCode:');
                console.log(duplicate.instances[0].block.code.substring(0, 200) + '...');
            }
        }
        
        if (report.similarBlocks.length > 0) {
            console.log('\nSIMILAR BLOCKS:');
            console.log('-'.repeat(40));
            
            for (const duplicate of report.similarBlocks.slice(0, 10)) { // Limit to first 10
                console.log(`\nSimilarity: ${(duplicate.similarity * 100).toFixed(1)}%`);
                console.log(`Type: ${duplicate.instances[0].block.type}`);
                console.log(`Instances:`);
                
                for (const instance of duplicate.instances) {
                    console.log(`  - ${path.relative(process.cwd(), instance.filePath)}:${instance.block.startLine}-${instance.block.endLine}`);
                }
            }
            
            if (report.similarBlocks.length > 10) {
                console.log(`\n... and ${report.similarBlocks.length - 10} more similar blocks`);
            }
        }
        
        if (report.summary.totalDuplicates === 0) {
            console.log('\n✅ No significant code duplication found!');
        } else {
            console.log('\n⚠️  Code duplication detected. Consider refactoring to improve maintainability.');
        }
    }

    // Main analysis method
    analyze(directory = './src') {
        console.log('🔍 Starting copy-paste detection...');
        console.log(`📁 Scanning directory: ${directory}`);
        console.log(`⚙️  Options:`, this.options);
        
        const files = this.scanDirectory(directory);
        this.analyzeFiles(files);
        
        console.log('\n🔍 Finding exact duplicates...');
        this.findExactDuplicates();
        
        console.log('🔍 Finding similar blocks...');
        this.findSimilarBlocks();
        
        const report = this.generateReport();
        this.printReport(report);
        
        return report;
    }
}

// CLI interface
if (require.main === module) {
    const args = process.argv.slice(2);
    const directory = args[0] || './src';
    
    const detector = new CopyPasteDetector({
        minLines: 3,
        minTokens: 10,
        similarityThreshold: 0.8,
        ignoreComments: true,
        ignoreWhitespace: true,
        ignoreCase: false,
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        excludeDirs: ['node_modules', '.git', 'dist', 'build', 'coverage']
    });
    
    try {
        detector.analyze(directory);
    } catch (error) {
        console.error('Error during analysis:', error.message);
        process.exit(1);
    }
}

module.exports = CopyPasteDetector;