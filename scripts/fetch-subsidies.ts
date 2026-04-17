import fs from 'fs';
import path from 'path';
import { fetchSubsidyList, fetchSubsidyDetail } from '../src/lib/jgrants.js';

const RAW_DIR = path.join(process.cwd(), 'data', 'raw');
const DETAILS_DIR = path.join(RAW_DIR, 'subsidy-details');

async function main() {
  try {
    // 過去のJSON（モックデータなど）が残っているとビルドに混ざるため、一度ディレクトリをリセットする
    if (fs.existsSync(DETAILS_DIR)) {
      fs.rmSync(DETAILS_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(DETAILS_DIR, { recursive: true });

    console.log('Fetching subsidy list...');
    // 複数のキーワードで検索して網羅性を高める
    const keywords = ["IT導入補助金", "DX", "デジタル化", "SaaS"];
    let allSubsidies = [];
    const seenIds = new Set();

    for (const kw of keywords) {
      console.log(`Searching for keyword: ${kw}`);
      const result = await fetchSubsidyList(kw);
      const items = result.result || result.subsidies || result.items || [];
      
      // 各キーワードごとに最大10件ずつ取得し、重複を排除して追加
      let count = 0;
      for (const item of items) {
        if (count >= 10) break; // キーワードあたり最大10件
        const id = item.subsidy_id || item.id;
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
