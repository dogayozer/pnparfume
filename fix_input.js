const fs = require('fs');
let c = fs.readFileSync('src/components/CreateScent.tsx', 'utf8');
c = c.replace(/oninput="[^"]*"/gi, 'onInput={() => {}}');
fs.writeFileSync('src/components/CreateScent.tsx', c);
