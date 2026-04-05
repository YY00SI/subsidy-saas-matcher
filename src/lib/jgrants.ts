const BASE_URL = 'https://api.jgrants-portal.go.jp/exp/v1/public';

/**
 * 補助金一覧を取得する
 * @param keyword 検索キーワード（最低2文字必須）
 * @returns 
 */
export async function fetchSubsidyList(keyword: string = "IT") {
  // yaml仕様書で定義されている必須パラメーター4つを正確に付与
  const params = new URLSearchParams({
    keyword: keyword,
    sort: "created_date",
    order: "DESC",
    acceptance: "1" // 1: 募集期間内のものだけ
  });
  
  const url = `${BASE_URL}/subsidies?${params.toString()}`;
  console.log(`Fetching subsidy list: ${url}`);
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/123.0.0.0",
        "Accept": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch subsidy list: ${response.status} ${response.statusText}`);
    }
    return await response.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch(e) {
    console.warn("JGrants API fetch failed, using massive local JSON data.");
    try {
      const fs = await import('fs');
      const path = await import('path');
      const dataPath = path.join(process.cwd(), 'data', 'raw', 'fallback-subsidies.json');
      const items = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      
      // 一覧用データを生成
      const listItems = items.map((i: any) => ({
        id: i.id,
        subsidy_name: i.subsidy_name,
        target_area_search: i.target_area_search,
        acceptance_start_datetime: i.acceptance_start_datetime,
        acceptance_end_datetime: i.acceptance_end_datetime,
        subsidy_max_limit: i.max_limit,
        subsidy_rate: i.subsidy_rate,
        target_number_of_employees: i.target_number_of_employees,
        detail: i.content
      }));
      return { subsidies: listItems };
    } catch(err) {
      console.error("Local JSON read failed", err);
      return { subsidies: [] };
    }
  }
}

/**
 * 補助金詳細を取得する
 * @param id 
 * @returns 
 */
export async function fetchSubsidyDetail(id: string) {
  const url = `${BASE_URL}/subsidies/${id}`;
  console.log(`Fetching subsidy detail: ${url}`);
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/123.0.0.0",
        "Accept": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch subsidy detail for ${id}: ${response.status}`);
    }
    return await response.json();
  } catch(e) {
    console.warn(`JGrants API fetch failed for detail ${id}, using local massive JSON.`);
    try {
      const fs = await import('fs');
      const path = await import('path');
      const dataPath = path.join(process.cwd(), 'data', 'raw', 'fallback-subsidies.json');
      const items = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      const found = items.find((i: any) => i.id === id);
      return found || null;
    } catch(err) {
      return null;
    }
  }
}
