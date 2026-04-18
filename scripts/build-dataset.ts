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

  const subsidies = [];
  let allMatches: MatchResult[] = [];

  if (!fs.existsSync(RAW_DETAILS_DIR)) {
    console.warn("No raw data found.");
    return;
  }

  const files = fs.readdirSync(RAW_DETAILS_DIR);
  
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let raw: any;
    try {
      raw = JSON.parse(fs.readFileSync(path.join(RAW_DETAILS_DIR, file), 'utf8'));
    } catch {
      continue;
    }

    const normalized = normalizeSubsidy(raw);
    
    // 【データ品質向上】マッチャーのコンセプトに合わない補助金を徹底排除
    const title = normalized.title || "";
    const content = normalized.content || "";
    const excludeKeywords = ["農業", "原子力", "林業", "木育", "漁業", "畜産", "臨床", "医療機器", "電気自動車", "商用車", "電気バス", "車両交通"];
    const isIrrelevant = excludeKeywords.some(kw => title.includes(kw) || content.includes(kw));
    
    if (isIrrelevant) {
      console.log(`Skipping irrelevant subsidy: ${title}`);
      continue;
    }

    // 上限額によるフィルタリング（0円や巨大すぎるものを排除）
    const maxLimitStr = normalized.max_limit || "0";
    // カンマや円、万円を考慮して数値化
    let parsedMax = 0;
    if (maxLimitStr.includes('億円')) {
      parsedMax = parseFloat(maxLimitStr.replace(/[^0-9.]/g, '')) * 100000000;
    } else if (maxLimitStr.includes('万円')) {
      parsedMax = parseFloat(maxLimitStr.replace(/[^0-9.]/g, '')) * 10000;
    } else {
      parsedMax = parseInt(maxLimitStr.replace(/[^0-9]/g, "")) || 0;
    }
    
    if (parsedMax === 0 && !maxLimitStr.includes("万円") && !maxLimitStr.includes("円")) {
       console.log(`Skipping zero-limit subsidy: ${title}`);
       continue;
    }
    
    if (parsedMax > 200000000) { // 2億円以上は除外（商用車電動化295億円対策）
      console.log(`Skipping massive-limit subsidy: ${title} (${maxLimitStr})`);
      continue;
    }

    const tags = classifySubsidy(normalized, taxonomy);
    
    // add tags to metadata
    const enrichedSubsidy = { ...normalized, tags, seoArticle: "" };

    // LLMマッチング＆SEO記事自動生成の実行
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
      console.log(`Using fallback matching for ${enrichedSubsidy.id}`);
      matchResults = matchToolsToSubsidy(tags, tools, normalized.id);
      enrichedSubsidy.seoArticle = `<h3>${enrichedSubsidy.title}の特徴</h3><p>${enrichedSubsidy.use_purpose}</p> <p>この機会にバックオフィス業務の見直しを行い、スムーズな申請と経営改善を目指しましょう。</p>`;
    }
    
    subsidies.push(enrichedSubsidy);
    allMatches = allMatches.concat(matchResults);
    
    // 【最重要】Gemini無料枠を絶対に超えないよう、1回につき5秒待機する
    await delay(5000); 
  }

  // processed書き出し
  fs.writeFileSync(
    path.join(PROCESSED_DIR, 'subsidies.json'),
    JSON.stringify(subsidies, null, 2)
  );

  fs.writeFileSync(
    path.join(PROCESSED_DIR, 'matches.json'),
    JSON.stringify(allMatches, null, 2)
  );

  console.log(`Processed ${subsidies.length} subsidies.`);
  console.log(`Generated ${allMatches.length} matching pairs.`);
}

main();
