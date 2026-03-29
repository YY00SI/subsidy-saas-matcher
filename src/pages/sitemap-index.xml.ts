import fs from 'fs';
import path from 'path';

export async function GET() {
  const dataPath = path.join(process.cwd(), 'data', 'processed', 'subsidies.json');
  const toolsPath = path.join(process.cwd(), 'data', 'tools.json');
  let subsidies = [];
  let tools = [];

  try {
    subsidies = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));
  } catch (e) {
    console.warn("Sitemap generation error", e);
  }

  const baseUrl = 'https://YY00SI.github.io/subsidy-saas-matcher';
  
  const pages = [
    '',
    '/subsidies',
    '/needs/accounting',
    '/needs/invoice',
  ];

  const urls = [
    ...pages.map(p => `  <url><loc>${baseUrl}${p}</loc><changefreq>daily</changefreq></url>`),
    ...subsidies.map((s: any) => `  <url><loc>${baseUrl}/subsidies/${s.id}</loc><changefreq>weekly</changefreq></url>`),
    ...tools.map((t: any) => `  <url><loc>${baseUrl}/tools/${t.slug}</loc><changefreq>monthly</changefreq></url>`)
  ].join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
}
