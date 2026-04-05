const BASE_URL = 'https://api.jgrants-portal.go.jp/exp/v1/public';

/**
 * 補助金一覧を取得する
 * @param page 
 * @param limit 
 * @returns 
 */
export async function fetchSubsidyList(page: number = 1, limit: number = 100) {
  const url = `${BASE_URL}/subsidies?page=${page}&limit=${limit}&sort=updated_at&order=desc`;
  console.log(`Fetching subsidy list: ${url}`);
  try {
    const response = await fetch(url);
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
    const response = await fetch(url);
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
