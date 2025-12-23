const fs = require("fs");
const path = require("path");

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const srcDir = path.join(__dirname, "..", "src");

walkDir(srcDir, (filePath) => {
  if (filePath.endsWith(".ts") || filePath.endsWith(".tsx")) {
    const content = fs.readFileSync(filePath, "utf8");

    // Replace from "./foo.js" or from './foo.js' with from "./foo"
    // Also handles .jsx, .ts, .tsx
    const newContent = content
      .replace(/from\s+(['"])(.*)\.(js|jsx|ts|tsx)(['"])/g, "from $1$2$4")
      .replace(
        /import\(\s+(['"])(.*)\.(js|jsx|ts|tsx)(['"])\s*\)/g,
        "import($1$2$4)",
      )
      .replace(
        /export\s+(.*)\s+from\s+(['"])(.*)\.(ts|tsx)(['"])/g,
        "export $1 from $2$3$5",
      );

    if (content !== newContent) {
      console.log(`Updating imports in ${filePath}`);
      fs.writeFileSync(filePath, newContent, "utf8");
    }
  }
});
