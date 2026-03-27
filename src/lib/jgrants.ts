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
    console.warn("JGrants API fetch failed, using fallback mock data.");
    return {
      subsidies: [
        {
          id: "mock-1",
          subsidy_name: "IT導入補助金（〇〇枠）",
          target_area_search: "全国",
          acceptance_start_datetime: "2024-04-01T00:00:00.000Z",
          acceptance_end_datetime: "2025-03-31T23:59:59.000Z",
          subsidy_max_limit: "3500000",
          subsidy_rate: "1/2",
          target_number_of_employees: "50名以下",
          detail: "クラウド会計ソフトやインボイス対応ツールの導入費用の一部を補助します。"
        },
        {
          id: "mock-2",
          subsidy_name: "小規模事業者持続化補助金",
          target_area_search: "全国",
          acceptance_start_datetime: "2024-05-01T00:00:00.000Z",
          acceptance_end_datetime: "2025-05-31T23:59:59.000Z",
          subsidy_max_limit: "500000",
          subsidy_rate: "2/3",
          target_number_of_employees: "5名以下",
          detail: "小規模事業者が行う販路開拓や業務効率化（経理・請求書ツールの導入等）の取り組みを支援します。"
        }
      ]
    };
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
      throw new Error(`Failed to fetch subsidy detail for ${id}: ${response.status} ${response.statusText}`);
    }
    return await response.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch(e) {
    console.warn(`JGrants API fetch failed for detail ${id}, using fallback mock data.`);
    if (id === "mock-1") {
      return {
        id: "mock-1",
        subsidy_name: "IT導入補助金（〇〇枠）",
        use_purpose: "業務効率化、インボイス対応",
        target_area_search: "全国",
        content: "中小企業・小規模事業者等が自社の課題やニーズに合ったITツール（会計や請求書等）を導入する経費の一部を補助します。",
        target_person: "中小企業、個人事業主",
        max_limit: "350万円",
        subsidy_rate: "1/2",
        acceptance_start_datetime: "2024-04-01T00:00:00.000Z",
        acceptance_end_datetime: "2025-03-31T23:59:59.000Z",
        office: "IT導入支援事業者",
        official_url: "https://it-shien.smrj.go.jp/",
        contact: "サポートポータル"
      };
    }
    return {
      id: "mock-2",
      subsidy_name: "小規模事業者持続化補助金",
      use_purpose: "販路開拓、業務効率化",
      target_area_search: "全国",
      content: "小規模事業者が経営計画を作成し、インボイス制度対応なども含めた経理事務などの生産性向上に取り組む経費の一部を補助します。",
      target_person: "小規模事業者（従業員5名以下等）",
      max_limit: "50万円",
      subsidy_rate: "2/3",
      acceptance_start_datetime: "2024-05-01T00:00:00.000Z",
      acceptance_end_datetime: "2025-05-31T23:59:59.000Z",
      office: "商工会議所・商工会",
      official_url: "https://smaj.go.jp/",
      contact: "地方事務局"
    };
  }
}
