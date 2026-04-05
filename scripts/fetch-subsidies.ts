import fs from 'fs';
import path from 'path';
import { fetchSubsidyList, fetchSubsidyDetail } from '../src/lib/jgrants.js';

const RAW_DIR = path.join(process.cwd(), 'data', 'raw');
const DETAILS_DIR = path.join(RAW_DIR, 'subsidy-details');

async function main() {
  try {
    if (!fs.existsSync(DETAILS_DIR)) {
      fs.mkdirSync(DETAILS_DIR, { recursive: true });
    }

    console.log('Fetching subsidy list...');
    // 仕様書の制限に基づくため、キーワード「IT」で検索
    const result = await fetchSubsidyList("補助金"); 
    
    // API仕様変更やモックデータ対応
    const subsidies = result.result || result.subsidies || result.items || [];
    
    // 先頭の30件に絞り込む（APIが無制限に返してきた場合への安全対策）
    const limitedSubsidies = subsidies.slice(0, 30);

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
