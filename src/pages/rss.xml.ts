import fs from 'fs';
import path from 'path';

export async function GET() {
  const dataPath = path.join(process.cwd(), 'data', 'processed', 'subsidies.json');
  let subsidies = [];
  try {
    subsidies = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (e) {
    console.error("Failed to load subsidies for RSS", e);
  }

  const items = subsidies.map((s: any) => `
    <item>
      <title>${s.title}</title>
      <link>https://YOUR_USER_NAME.github.io/subsidy-saas-matcher/subsidies/${s.id}</link>
      <description>${s.use_purpose || s.content}</description>
      <pubDate>${new Date(s.start_date || new Date()).toUTCString()}</pubDate>
    </item>
  `).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>補助金SaaSマッチャー | 最新補助金情報</title>
    <link>https://YOUR_USER_NAME.github.io/subsidy-saas-matcher/</link>
    <description>IT導入・インボイス対応に使える最新の補助金情報をお届けします。</description>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
}
