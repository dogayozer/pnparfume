const fs = require('fs');
const path = require('path');

const dir = 'src/components/';
const files = fs.readdirSync(dir);

for (const file of files) {
    if (file.endsWith('.tsx')) {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        let original = content;
        content = content.replace(/rows="(\d+)"/g, 'rows={$1}');
        
        if (content !== original) {
            fs.writeFileSync(filePath, content);
            console.log('Fixed rows in', file);
        }
    }
}
