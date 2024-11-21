import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function updateSassImports(directory) {
    // Patterns to match and their replacements
    const patterns = [
        {
            find: /const\s+sass\s*=\s*require\(['"]sass['"]\)/g,
            replace: "import * as sass from 'sass'"
        },
        {
            find: /import\s+sass\s+from\s+['"]sass['"]/g,
            replace: "import * as sass from 'sass'"
        }
    ];

    // File extensions to process
    const extensions = ['.js', '.ts', '.mjs'];

    async function processFile(filePath) {
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            let updatedContent = content;
            let wasUpdated = false;

            for (const pattern of patterns) {
                if (pattern.find.test(content)) {
                    updatedContent = updatedContent.replace(pattern.find, pattern.replace);
                    wasUpdated = true;
                }
            }

            if (wasUpdated) {
                await fs.writeFile(filePath, updatedContent);
                console.log(`✅ Updated: ${filePath}`);
            }
        } catch (error) {
            console.error(`❌ Error processing ${filePath}:`, error);
        }
    }

    async function walkDirectory(dir) {
        const entries = await fs.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory() && !entry.name.includes('node_modules')) {
                await walkDirectory(fullPath);
            } else if (entry.isFile() && extensions.includes(path.extname(entry.name))) {
                await processFile(fullPath);
            }
        }
    }

    await walkDirectory(directory);
}

// Get directory from command line argument or use current directory
const targetDirectory = process.argv[2] || process.cwd();
console.log(`🔍 Scanning directory: ${targetDirectory}`);

updateSassImports(targetDirectory)
    .then(() => console.log('✨ Migration complete!'))
    .catch(error => console.error('Migration failed:', error)); 