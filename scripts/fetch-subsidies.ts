import fs from 'fs';
import path from 'path';
import { fetchSubsidyList, fetchSubsidyDetail } from '../src/lib/jgrants.js';

const RAW_DIR = path.join(process.cwd(), 'data', 'raw');
const DETAILS_DIR = path.join(RAW_DIR, 'subsidy-details');

async function main() {
  try {
    if (fs.existsSync(DETAILS_DIR)) {
      fs.rmSync(DETAILS_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(DETAILS_DIR, { recursive: true });

    console.log('Fetching subsidy list...');
    const keywords = ["IT導入補助金", "DX", "デジタル化", "SaaS"];
    let allSubsidies = [];
    const seenIds = new Set();

    for (const kw of keywords) {
      console.log(`Searching for keyword: ${kw}`);
      const result = await fetchSubsidyList(kw);
      const items = result.result || result.subsidies || result.items || [];
      
      let count = 0;
      for (const item of items) {
        if (count >= 10) break; // キーワードあたり最大10件
        const id = item.subsidy_id || item.id;
        const maxLimit = item.subsidy_max_limit || item.max_limit || 0;
        const name = item.subsidy_name || item.title || "";
        
        // フィルタリング: 上限額0円は除外、50億円以上は除外
        if (maxLimit === 0 || maxLimit > 5000000000) continue;
        
        // フィルタリング: 無関係な補助金を弾く
        if (name.includes("ウクライナ") || name.includes("木育") || name.includes("次世代革新炉") || name.includes("子育て") || name.includes("グリーン") || name.includes("トラック")) continue;

        if (id && !seenIds.has(id)) {
          seenIds.add(id);
          allSubsidies.push(item);
          count++;
        }
      }
      await new Promise(r => setTimeout(r, 1000)); // API負荷軽減
    }
    
    // 合計の中から、最終的に処理する30件を抽出
    const limitedSubsidies = allSubsidies.slice(0, 30);

    fs.writeFileSync(
      path.join(RAW_DIR, 'subsidies-list.json'),
      JSON.stringify(limitedSubsidies, null, 2)
    );

    console.log(`Saved ${limitedSubsidies.length} subsidies to list.`);
    
    for (const subsidy of limitedSubsidies) {
      const id = subsidy.subsidy_id || subsidy.id;
      if (!id) continue;
      console.log(`Fetching detail for: ${id}`);
      try {
        const detail = await fetchSubsidyDetail(id);
        const detailData = detail.result || detail;
        fs.writeFileSync(
          path.join(DETAILS_DIR, `${id}.json`),
          JSON.stringify(detailData, null, 2)
        );
      } catch (err) {
        console.error(`Failed to fetch detail for ${id}:`, err);
      }
      // API負荷軽減のため少し待機
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log('Finished fetching subsidies.');
  } catch (error) {
    console.error('Error fetching subsidies:', error);
    process.exit(1);
  }
}

main();
