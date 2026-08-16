const fs = require('fs');

const urls = [
  'https://pienparfume.com.tr/on-bilgilendirme-formu/',
  'https://pienparfume.com.tr/gizlilik-ve-guvenlik/',
  'https://pienparfume.com.tr/iptal-ve-iade-kosullari/',
  'https://pienparfume.com.tr/mesafeli-satis-sozlesmesi/',
  'https://pienparfume.com.tr/site-kullanim-sartlari/'
];

async function run() {
  const targetDir = 'public/yasal';
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  for (const url of urls) {
    try {
      const res = await fetch(url);
      const html = await res.text();
      
      // Try to find WordPress entry-content or similar main body
      let content = html;
      const mainMatch = html.match(/<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div><!-- .entry-content -->/);
      if (mainMatch) {
        content = mainMatch[1];
      } else {
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
        if (bodyMatch) content = bodyMatch[1];
      }

      // Strip all HTML tags
      let text = content
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<[^>]+>/g, '\n')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\n\s*\n/g, '\n\n')
        .trim();

      const name = url.split('/').filter(Boolean).pop();
      fs.writeFileSync(`${targetDir}/${name}.txt`, text);
      console.log(`Saved ${name}.txt`);
    } catch (err) {
      console.error(`Error on ${url}:`, err);
    }
  }
}

run();
