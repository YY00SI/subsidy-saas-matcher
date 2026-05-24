import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const projectRoot = process.cwd();
const distDir = path.join(projectRoot, 'dist');
const publicBase = 'https://YY00SI.github.io/subsidy-saas-matcher';
const issues = [];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

function routeFor(filePath) {
  const relative = path.relative(distDir, filePath).replaceAll(path.sep, '/');
  if (relative === 'index.html') return '/';
  return `/${relative.replace(/index\.html$/, '')}`;
}

function report(file, message) {
  issues.push(`${path.relative(projectRoot, file).replaceAll(path.sep, '/')}: ${message}`);
}

try {
  await stat(distDir);
} catch {
  throw new Error('dist directory is missing. Run npm run build before npm run audit.');
}

const htmlFiles = (await walk(distDir)).filter((file) => file.endsWith('.html'));
const sitemapFiles = (await walk(distDir)).filter((file) => /sitemap.*\.xml$/.test(path.basename(file)));
const sitemapText = (await Promise.all(sitemapFiles.map((file) => readFile(file, 'utf8')))).join('\n');

if (htmlFiles.length < 35) {
  issues.push(`dist contains only ${htmlFiles.length} HTML pages; expected at least 35.`);
}

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const route = routeFor(file);
  const expectedUrl = `${publicBase}${route}`;

  const lowerHtml = html.toLowerCase();
  const lowerExpectedUrl = expectedUrl.toLowerCase();

  if (!/<html lang="ja"/.test(html)) report(file, 'missing lang="ja"');
  if (!/<title>[^<]{8,}<\/title>/.test(html)) report(file, 'missing useful title');
  if (!/<meta name="description" content="[^"]{40,}"/.test(html)) report(file, 'missing useful meta description');
  if (!lowerHtml.includes(`<link rel="canonical" href="${lowerExpectedUrl}">`)) report(file, `canonical does not match ${expectedUrl}`);
  if (!lowerHtml.includes(`<meta property="og:url" content="${lowerExpectedUrl}">`)) report(file, `og:url does not match ${expectedUrl}`);
  if (!sitemapText.toLowerCase().includes(`<loc>${lowerExpectedUrl}</loc>`)) report(file, `not listed in sitemap as ${expectedUrl}`);

  const targetBlankLinks = [...html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)].map((match) => match[0]);
  for (const anchor of targetBlankLinks) {
    if (!/rel="[^"]*noopener[^"]*noreferrer[^"]*"/.test(anchor)) {
      report(file, `target="_blank" link lacks noopener noreferrer: ${anchor.slice(0, 160)}`);
    }
  }

  const affiliateLinks = [...html.matchAll(/<a\b[^>]*href="https:\/\/(?:px|www\d*)\.a8\.net[^"]*"[^>]*>/g)].map((match) => match[0]);
  for (const anchor of affiliateLinks) {
    if (!/rel="[^"]*sponsored[^"]*noopener[^"]*noreferrer[^"]*"/.test(anchor)) {
      report(file, `A8 link lacks sponsored noopener noreferrer: ${anchor.slice(0, 160)}`);
    }
  }
}

if (issues.length > 0) {
  console.error('Site audit failed:');
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log(`Site audit passed: ${htmlFiles.length} HTML pages checked.`);
