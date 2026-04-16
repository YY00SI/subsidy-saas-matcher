import puppeteer from 'puppeteer';

async function investigate() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const results = {};

  try {
    // 1. Top Page
    await page.goto('https://yy00si.github.io/subsidy-saas-matcher/', { waitUntil: 'networkidle2' });
    results.top = {
      title: await page.title(),
      h1: await page.$eval('h1', el => el.innerText),
      stats: await page.$$eval('.stat-value', els => els.map(el => el.innerText)),
      subsidies: await page.$$eval('.subsidy-card .s-card-title', els => els.map(el => el.innerText))
    };

    // 2. Subsidy Detail Page (Pick the first one)
    const firstSubsidyLink = await page.$eval('.subsidy-card .s-card-title a', el => el.href);
    await page.goto(firstSubsidyLink, { waitUntil: 'networkidle2' });
    results.subsidyDetail = {
      url: firstSubsidyLink,
      title: await page.$eval('.page-title', el => el.innerText),
      seoArticleExists: await page.$('.seo-article-card') !== null,
      matchedTools: await page.$$eval('.matched-tool-card .tool-name', els => els.map(el => el.innerText)),
      ctaLinks: await page.$$eval('.cta-pulse-button', els => els.map(el => el.href))
    };

    // 3. Check Tools list if possible
    await page.goto('https://yy00si.github.io/subsidy-saas-matcher/subsidies/', { waitUntil: 'networkidle2' });
    results.listPage = {
      count: await page.$$eval('.subsidy-card', els => els.length)
    };

    console.log(JSON.stringify(results, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
}

investigate();
