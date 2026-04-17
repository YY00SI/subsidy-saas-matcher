import fs from 'fs';
import path from 'path';
import type { Tool, MatchResult } from './types.js';

export function loadTools(): Tool[] {
  const p = path.join(process.cwd(), 'data', 'tools.json');
  return JSON.parse(fs.readFileSync(p, 'utf8')) as Tool[];
}

export function matchToolsToSubsidy(subsidyTags: string[], tools: Tool[], subsidyId: string): MatchResult[] {
  const results: MatchResult[] = [];

  for (const tool of tools) {
    let score = 0;
    const reasons: string[] = [];

    // ツールのカテゴリが補助金のタグに含まれるかチェック
    if (subsidyTags.includes(tool.category)) {
      score += 50;
      reasons.push(`${tool.category}カテゴリ一致`);
    }

    // ツールのuse_casesが補助金タグと被るか（より詳細なマッチング）
    for (const uc of tool.use_cases) {
      // 簡易的にキーワードが含まれているかで加点
      if (subsidyTags.some(tag => tag.includes(uc) || uc.includes(tag))) {
        score += 10;
        reasons.push(`ユースケース[${uc}]関連`);
      }
    }

    // priority_scoreの加算（最大10点程度にスケールダウン）
    if (tool.priority_score) {
      score += tool.priority_score * 0.1;
    }

    // 最終判定: 30点未満は「マッチしていない」とみなして除外
    if (score >= 30) {
      results.push({
        subsidyId,
        toolSlug: tool.slug,
        score: Math.min(score, 100), // 100点満点にキャップ
        reasons
      });
    }
  }

  // スコア順にソート
  return results.sort((a, b) => b.score - a.score);
}
