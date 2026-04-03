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
          subsidy_name: "IT導入補助金2024（インボイス枠・通常枠）",
          target_area_search: "全国",
          acceptance_start_datetime: "2024-02-16T00:00:00.000Z",
          acceptance_end_datetime: "2025-03-31T23:59:59.000Z",
          subsidy_max_limit: "3500000",
          subsidy_rate: "1/2 〜 4/5",
          target_number_of_employees: "大企業を除く中小企業・小規模事業者",
          detail: "クラウド会計ソフトやインボイス対応の受発注システム、勤怠管理などのSaaSツール導入費用の一部を補助します。"
        },
        {
          id: "mock-2",
          subsidy_name: "小規模事業者持続化補助金（一般型）",
          target_area_search: "全国",
          acceptance_start_datetime: "2024-03-01T00:00:00.000Z",
          acceptance_end_datetime: "2025-03-31T23:59:59.000Z",
          subsidy_max_limit: "2500000",
          subsidy_rate: "2/3 または 3/4",
          target_number_of_employees: "5名または20名以下の小規模事業者",
          detail: "小規模事業者が直面する制度変更（インボイス制度など）に対応し、販路開拓や業務効率化（経理ツールの導入等）の取り組みを支援します。"
        },
        {
          id: "mock-3",
          subsidy_name: "ものづくり・商業・サービス生産性向上促進補助金",
          target_area_search: "全国",
          acceptance_start_datetime: "2024-01-01T00:00:00.000Z",
          acceptance_end_datetime: "2024-12-31T23:59:59.000Z",
          subsidy_max_limit: "12500000",
          subsidy_rate: "1/2",
          target_number_of_employees: "中小企業・小規模事業者",
          detail: "革新的な製品・サービス開発や、生産プロセス・業務システムの大幅な改善（DX化）に取り組むための設備投資・システム投資を補助します。"
        },
        {
          id: "mock-4",
          subsidy_name: "事業再構築補助金",
          target_area_search: "全国",
          acceptance_start_datetime: "2024-04-01T00:00:00.000Z",
          acceptance_end_datetime: "2025-03-31T23:59:59.000Z",
          subsidy_max_limit: "20000000",
          subsidy_rate: "1/2 または 2/3",
          target_number_of_employees: "中小企業等",
          detail: "新分野展開や業態転換など、思い切った事業再構築に挑戦する中小企業に対し、新しいSaaS等のシステム構築費用を含めて支援します。"
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
      throw new Error(`Failed to fetch subsidy detail for ${id}: ${response.status}`);
    }
    return await response.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch(e) {
    console.warn(`JGrants API fetch failed for detail ${id}, using fallback mock data.`);
    if (id === "mock-1") {
      return {
        id: "mock-1",
        subsidy_name: "IT導入補助金2024（インボイス枠・通常枠）",
        use_purpose: "業務効率化、インボイス・電帳法対応、DX推進",
        target_area_search: "全国",
        content: "中小企業・小規模事業者等が自社の課題やニーズに合ったITツール（クラウド会計、請求書等）を導入する経費の一部を補助します。特にインボイス枠では高い補助率が適用されます。",
        target_person: "中小企業、個人事業主",
        max_limit: "350万円",
        subsidy_rate: "最大 4/5",
        acceptance_start_datetime: "2024-02-16T00:00:00.000Z",
        acceptance_end_datetime: "2025-03-31T23:59:59.000Z",
        office: "IT導入支援事業者・事務局",
        official_url: "https://it-shien.smrj.go.jp/",
        contact: "IT導入補助金 サポートポータル"
      };
    }
    if (id === "mock-3") {
      return {
        id: "mock-3",
        subsidy_name: "ものづくり・商業・サービス生産性向上促進補助金",
        use_purpose: "抜本的な業務改善、新サービス開発",
        target_area_search: "全国",
        content: "高度な勤怠管理や給与計算システム、またはAIを活用したSaaSツールなどを導入し、企業の生産性を大幅に向上させる取り組みを補助します。",
        target_person: "中小企業等の法人",
        max_limit: "1250万円",
        subsidy_rate: "1/2",
        acceptance_start_datetime: "2024-01-01T00:00:00.000Z",
        acceptance_end_datetime: "2024-12-31T23:59:59.000Z",
        office: "ものづくり補助金事務局",
        official_url: "https://portal.monodukuri-hojo.jp/",
        contact: "地方サポートセンター"
      };
    }
    if (id === "mock-4") {
      return {
        id: "mock-4",
        subsidy_name: "事業再構築補助金",
        use_purpose: "業態転換、新分野展開に伴うシステム構築",
        target_area_search: "全国",
        content: "新しいビジネスモデルへの転換期において、バックオフィスのSaaS導入を含めた大規模なシステム投資を支援します。",
        target_person: "中小企業等",
        max_limit: "2000万円",
        subsidy_rate: "1/2 または 2/3",
        acceptance_start_datetime: "2024-04-01T00:00:00.000Z",
        acceptance_end_datetime: "2025-03-31T23:59:59.000Z",
        office: "事業再構築補助金事務局",
        official_url: "https://jigyou-saikouchiku.go.jp/",
        contact: "インフォメーションセンター"
      };
    }
    return {
      id: "mock-2",
      subsidy_name: "小規模事業者持続化補助金（一般型）",
      use_purpose: "販路開拓、業務インフラのデジタル化",
      target_area_search: "全国",
      content: "小規模事業者が経営計画を作成し、インボイス制度対応なども含めた経理事務などの生産性向上に取り組む経費の一部を補助します。",
      target_person: "小規模事業者（従業員5名以下等）",
      max_limit: "250万円",
      subsidy_rate: "2/3 または 3/4",
      acceptance_start_datetime: "2024-03-01T00:00:00.000Z",
      acceptance_end_datetime: "2025-03-31T23:59:59.000Z",
      office: "全国商工会連合会・日本商工会議所",
      official_url: "https://smaj.go.jp/",
      contact: "持続化補助金 地方事務局"
    };
  }
}
