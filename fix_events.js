const fs = require('fs');
const path = require('path');

const dir = 'src/components/';
const files = fs.readdirSync(dir);

for (const file of files) {
    if (file.endsWith('.tsx')) {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        let original = content;
        content = content.replace(/onsubmit="[^"]*"/gi, 'onSubmit={(e)=>{e.preventDefault()}}');
        content = content.replace(/onclick="[^"]*"/gi, 'onClick={()=>{}}');
        content = content.replace(/oninput="[^"]*"/gi, 'onInput={()=>{}}');
        content = content.replace(/onchange="[^"]*"/gi, 'onChange={()=>{}}');
        
        if (content !== original) {
            fs.writeFileSync(filePath, content);
            console.log('Fixed event handlers in', file);
        }
    }
}
