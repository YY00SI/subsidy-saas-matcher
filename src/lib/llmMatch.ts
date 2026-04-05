import type { Tool, MatchResult } from './types.js';

/**
 * Gemini APIを用いた高度なマッチングロジック
 */
export async function matchWithLLM(subsidy: any, tools: Tool[]): Promise<MatchResult[]> {
  const apiKeys = [process.env.GEMINI_API_KEY_1, process.env.GEMINI_API_KEY_2].filter(Boolean);
  
  if (apiKeys.length === 0) {
    console.warn("Gemini API Keys are not set. Falling back to basic matching.");
    return [];
  }

  const toolDescriptions = tools.map(t => `- ${t.name}(${t.category}): ${t.strengths}`).join('\n');
  const prompt = `あなたはプロのIT導入コンサルタントです。
以下の「補助金情報」に対して、リストアップされた「SaaSツール」の相性をスコアリング（0〜100点）し、その理由を出力してください。
【重要】事業再構築や設備投資がメインの補助金であっても、「新規事業の基盤となる経理・バックオフィスのDX対応」は不可欠です。一見無関係に見えても、補助金事業を支える汎用ツールとしての価値を読み取り、必ず50点以上のスコアをつけて上位ツールを推薦してください。結果は空の配列ではなく、必ず関連性が一番高いツールを最低1〜2つは含めてください。必ずJSON配列としてパース可能な形式で回答し、前後の説明は省いてください。

【補助金情報】
名称: ${subsidy.subsidy_name || subsidy.title}
目的: ${subsidy.use_purpose}
詳細: ${subsidy.detail || subsidy.content}

【SaaSツール候補】
${toolDescriptions}

【出力JSONフォーマット】
[
  {
    "toolSlug": "ツールのslug",
    "score": 85,
    "reasons": ["理由1", "理由2"]
  }
]
`;

  let resultText = null;

  for (const apiKey of apiKeys) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${apiKey}`;
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { response_mime_type: "application/json" }
        })
      });

      if (response.status === 429) {
        console.warn(`API Rate Limit exceeded for one key, attempting next key...`);
        continue; // 次のキーへフォールバック
      }

      if (!response.ok) {
        console.error(`Gemini API Error: ${response.statusText}`);
        continue;
      }

      const data = await response.json();
      resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (resultText) break; // 成功したらループを抜ける

    } catch (e) {
      console.warn("LLM Request error, trying next key", e);
    }
  }

  if (!resultText) return [];

  try {
    const jsonStr = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
    const llmMatches = JSON.parse(jsonStr);
    
    return llmMatches.map((m: any) => ({
      subsidyId: subsidy.id,
      toolSlug: m.toolSlug,
      score: m.score,
      reasons: m.reasons
    }));
  } catch (e) {
    console.error("Failed to parse LLM response JSON", e);
    return [];
  }
}
