export function normalizeText(text: string | null | undefined): string {
  if (!text) return '';
  return text.trim().normalize('NFKC');
}

export function normalizeDate(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return d.toISOString();
  } catch {
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeSubsidy(raw: any) {
  // 配列で渡された場合は最初の要素を取り出す
  if (Array.isArray(raw) && raw.length > 0) {
    raw = raw[0];
  }
  
  return {
    id: raw.id || raw.subsidy_id || '',
    title: normalizeText(raw.subsidy_name || raw.title),
    use_purpose: normalizeText(raw.use_purpose),
    content: normalizeText(raw.content || raw.detail),
    target_area: Array.isArray(raw.target_area_search_names) ? raw.target_area_search_names : 
                 (raw.target_area_search ? [raw.target_area_search] : []),
    target_person: normalizeText(raw.target_person || raw.target_number_of_employees),
    max_limit: normalizeText(raw.max_limit || raw.subsidy_max_limit?.toString()),
    rate: normalizeText(raw.subsidy_rate),
    start_date: normalizeDate(raw.acceptance_start_datetime || raw.accepted_start_date),
    end_date: normalizeDate(raw.acceptance_end_datetime || raw.accepted_end_date),
    office: normalizeText(raw.office),
    url: normalizeText(raw.official_url),
    contact: normalizeText(raw.contact),
    status: normalizeText(raw.status || '受付中'),
  };
}
