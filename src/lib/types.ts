export interface Tool {
  slug: string;
  name: string;
  category: string;
  target_business: string;
  use_cases: string[];
  invoice_support: boolean;
  accounting_support: boolean;
  payroll_support: boolean;
  affiliate_url: string;
  official_url: string;
  strengths: string;
  caution: string;
  priority_score: number;
}

export interface TaxonomyEntry {
  label: string;
  keywords: string[];
  description: string;
}

export type Taxonomy = Record<string, TaxonomyEntry>;

export interface JGrantsSubsidySummary {
  id: string;
  title: string;
  target_area_search_names: string[];
  content: string;
  status: string;
  accepted_start_date: string;
  accepted_end_date: string;
  subsidy_max_limit: number;
  subsidy_rate: string;
}

export interface JGrantsSubsidyDetail {
  id: string;
  title: string;
  use_purpose: string;
  target_area_search_names: string[];
  content: string;
  target_person: string;
  max_limit: string;
  subsidy_rate: string;
  accepted_start_date: string;
  accepted_end_date: string;
  status: string;
  office: string;
  official_url: string;
  contact: string;
}

export interface MatchResult {
  subsidyId: string;
  toolSlug: string;
  score: number;
  reasons: string[];
}
