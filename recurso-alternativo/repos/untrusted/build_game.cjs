const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const levelsDir = path.join(baseDir, 'levels');
const scriptsDir = path.join(baseDir, 'scripts');
const buildDir = path.join(scriptsDir, 'build');

if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
}

// 1. Compile levels.js
const levelFiles = fs.readdirSync(levelsDir).filter(f => f.endsWith('.jsx')).sort();
let levelsContent = 'Game.prototype._levels = {\n';

levelFiles.forEach(file => {
    const filePath = path.join(levelsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const escaped = JSON.stringify(content);
    levelsContent += `    'levels/${file}': ${escaped},\n`;
});

levelsContent += '};\n';
fs.writeFileSync(path.join(levelsDir, 'levels.js'), levelsContent, 'utf8');
console.log('Compiled levels.js successfully with', levelFiles.length, 'levels.');

// 2. Concatenate modules into scripts/build/untrusted.js
const modules = [
    path.join(scriptsDir, 'util.js'),
    path.join(levelsDir, 'intro.js'),
    path.join(scriptsDir, '_head.js'),
    path.join(scriptsDir, 'game.js'),
    path.join(scriptsDir, 'codeEditor.js'),
    path.join(scriptsDir, 'display.js'),
    path.join(scriptsDir, 'dynamicObject.js'),
    path.join(scriptsDir, 'inventory.js'),
    path.join(scriptsDir, 'map.js'),
    path.join(scriptsDir, 'objects.js'),
    path.join(scriptsDir, 'player.js'),
    path.join(scriptsDir, 'reference.js'),
    path.join(scriptsDir, 'sound.js'),
    path.join(scriptsDir, 'validate.js'),
    path.join(scriptsDir, 'ui.js'),
    path.join(levelsDir, 'levels.js'),
    path.join(scriptsDir, '_launcher_release.js'),
    path.join(scriptsDir, '_tail.js')
];

let bundle = '';
modules.forEach(m => {
    if (fs.existsSync(m)) {
        bundle += fs.readFileSync(m, 'utf8') + '\n\n';
    } else {
        console.warn('Module missing:', m);
    }
});

fs.writeFileSync(path.join(buildDir, 'untrusted.js'), bundle, 'utf8');
console.log('Built scripts/build/untrusted.js successfully.');
