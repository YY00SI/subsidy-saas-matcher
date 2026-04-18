import fs from 'fs';
import path from 'path';
import { normalizeSubsidy } from '../src/lib/normalize.js';
import { classifySubsidy, loadTaxonomy } from '../src/lib/classify.js';
import { loadTools, matchToolsToSubsidy } from '../src/lib/match.js';
import type { MatchResult } from '../src/lib/types.js';

const RAW_DETAILS_DIR = path.join(process.cwd(), 'data', 'raw', 'subsidy-details');
const PROCESSED_DIR = path.join(process.cwd(), 'data', 'processed');

import { matchWithLLM } from '../src/lib/llmMatch.js';

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  if (!fs.existsSync(PROCESSED_DIR)) {
    fs.mkdirSync(PROCESSED_DIR, { recursive: true });
  }

  const taxonomy = loadTaxonomy();
  const tools = loadTools();

  let subsidies = [];
  let allMatches: MatchResult[] = [];

  if (!fs.existsSync(RAW_DETAILS_DIR)) {
    console.warn("No raw data found.");
    return;
  }

  const files = fs.readdirSync(RAW_DETAILS_DIR);
  
  console.log(`Checking ${files.length} raw files...`);

  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    
    let raw: any;
    try {
      raw = JSON.parse(fs.readFileSync(path.join(RAW_DETAILS_DIR, file), 'utf8'));
    } catch {
      continue;
    }

    const normalized = normalizeSubsidy(raw);
    const title = normalized.title || "";
    const content = normalized.content || "";

    // 【1】 巨大補助金の排除 (2億円以上)
    let maxLimit = 0;
    const limitStr = normalized.max_limit || "0";
    if (limitStr.includes('億円')) {
      maxLimit = parseFloat(limitStr.replace(/[^0-9.]/g, '')) * 100000000;
    } else if (limitStr.includes('万円')) {
      maxLimit = parseFloat(limitStr.replace(/[^0-9.]/g, '')) * 10000;
    } else {
      maxLimit = parseInt(limitStr.replace(/[^0-9]/g, "")) || 0;
    }

    if (maxLimit > 200000000) {
      console.log(`[FILTER] Massive limit skipped: ${title} (${limitStr})`);
      continue;
    }

    // 【2】 無関係なジャンルの排除
    const excludeKeywords = ["農業", "原子力", "林業", "木育", "漁業", "畜産", "臨床", "医療機器", "電気自動車", "商用車", "電気バス", "車両交通"];
    if (excludeKeywords.some(kw => title.includes(kw))) {
      console.log(`[FILTER] Irrelevant keyword skipped: ${title}`);
      continue;
    }

    // 【3】 上限0円の排除
    if (maxLimit === 0 && !limitStr.includes("万円") && !limitStr.includes("円")) {
      console.log(`[FILTER] Zero limit skipped: ${title}`);
      continue;
    }

    const tags = classifySubsidy(normalized, taxonomy);
    const enrichedSubsidy = { ...normalized, tags, seoArticle: "" };

    // LLMマッチング＆SEO記事自動生成
    let matchResults: MatchResult[] = [];
    let llmResponse = null;
    
    try {
      llmResponse = await matchWithLLM(enrichedSubsidy, tools);
    } catch (llmError) {
      console.error(`LLM Matching failed for ${enrichedSubsidy.id}:`, llmError);
    }
    
    if (llmResponse && llmResponse.matches && llmResponse.matches.length > 0) {
      matchResults = llmResponse.matches;
      enrichedSubsidy.seoArticle = llmResponse.seoArticle;
    } else {
      matchResults = matchToolsToSubsidy(tags, tools, normalized.id);
      enrichedSubsidy.seoArticle = `<h3>${enrichedSubsidy.title}の特徴</h3><p>${enrichedSubsidy.use_purpose}</p> <p>この機会にバックオフィス業務の見直しを行い、経営改善を目指しましょう。</p>`;
    }
    
    subsidies.push(enrichedSubsidy);
    allMatches = allMatches.concat(matchResults);
    
    await delay(2000); // 無料枠への配慮
  }

  // IT導入・DX系が必ず上位に来るようにソート (IT導入補助金という名前が入っていれば最優先)
  subsidies.sort((a, b) => {
    const aIsIT = a.title.includes("IT導入") || a.title.includes("DX") ? 1 : 0;
    const bIsIT = b.title.includes("IT導入") || b.title.includes("DX") ? 1 : 0;
    return bIsIT - aIsIT;
  });

  // 最終的な書き出し (processed/subsidies.json)
  fs.writeFileSync(path.join(PROCESSED_DIR, 'subsidies.json'), JSON.stringify(subsidies, null, 2));
  fs.writeFileSync(path.join(PROCESSED_DIR, 'matches.json'), JSON.stringify(allMatches, null, 2));

  console.log(`Success: Processed ${subsidies.length} subsidies.`);
}

main();
