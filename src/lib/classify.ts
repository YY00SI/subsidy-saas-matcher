import fs from 'fs';
import path from 'path';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function classifySubsidy(normalizedSubsidy: any, taxonomy: Record<string, any>): string[] {
  const tags: string[] = [];
  
  // 判定用のテキスト結合
  const fullText = `
    ${normalizedSubsidy.title} 
    ${normalizedSubsidy.use_purpose} 
    ${normalizedSubsidy.content} 
    ${normalizedSubsidy.target_person}
  `.toLowerCase();
  
  for (const [key, category] of Object.entries(taxonomy)) {
    const matched = category.keywords.some((keyword: string) => fullText.includes(keyword.toLowerCase()));
    if (matched) {
      tags.push(key);
    }
  }
  
  // 最低でも general-dx などの汎用タグをつけることも可能だが、
  // MVPとしてはキーワードマッチしたものだけタグ付けする。
  return tags;
}

export function loadTaxonomy() {
    const p = path.join(process.cwd(), 'data', 'taxonomy.json');
    return JSON.parse(fs.readFileSync(p, 'utf8'));
}
