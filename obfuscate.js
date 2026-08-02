const fs = require('fs');
const path = require('path');

console.log("🔒 Starting JavaScript Obfuscation & Security Protection...");

const appJsPath = path.join(__dirname, 'app.js');
let code = fs.readFileSync(appJsPath, 'utf8');

// Fix uncomputed key syntax if present
code = code.replace(/_0xdecode\((\d+)\)\s*:/g, '[_0xdecode($1)]:');

fs.writeFileSync(appJsPath, code, 'utf8');
console.log("✅ Fixed computed property syntax in app.js!");
