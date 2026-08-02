const fs = require('fs');
const path = require('path');

const dir = 'src/components/';
const files = fs.readdirSync(dir);

for (const file of files) {
    if (file.endsWith('.tsx')) {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        if (content.match(/on[A-Z][a-zA-Z]+=/)) {
            if (!content.startsWith('"use client";')) {
                content = '"use client";\n\n' + content;
                fs.writeFileSync(filePath, content);
                console.log('Added "use client" to', file);
            }
        }
    }
}
