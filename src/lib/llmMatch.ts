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
以下の「補助金情報」に対して、リストアップされた「SaaSツール」の中から相性の良いものをスコアリング（0〜100点）し、その理由をJSONフォーマットのみで出力してください。
スコアが60点以上のものだけを抽出してください。必ずJSON配列としてパース可能な形式で回答し、前後の説明は省いてください。

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
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
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
