import type { Tool, MatchResult } from './types.js';

interface LLMResponse {
  matches: MatchResult[];
  seoArticle: string;
}

/**
 * Gemini APIを用いた高度なマッチングロジック＆SEO記事自動執筆
 */
export async function matchWithLLM(subsidy: any, tools: Tool[]): Promise<LLMResponse | null> {
  // @ts-ignore
  const apiKeys = [process.env.GEMINI_API_KEY_1, process.env.GEMINI_API_KEY_2].filter(Boolean);

  if (apiKeys.length === 0) {
    console.warn("Gemini API Keys are not set. Falling back to basic matching.");
    return null;
  }

  const toolDescriptions = tools.map(t => `- ${t.name}(${t.category}): ${t.strengths}`).join('\n');
  const prompt = `あなたはトップクラスの経営スペシャリスト兼、最高峰のSEOライターです。
以下の「補助金情報」に対して、２つのタスクを完璧に実行してください。

【タスク1：収益化（アフィリエイト）ツール群との最適マッチング】
リストアップされた「SaaSツール・サービス」との相性をスコアリング（0〜100点）し理由を出力してください。
・補助金の「目的（use_purpose）」や「対象（target_person）」と、ツールの「強み（strengths）」や「カテゴリー（category）」が合致する場合に高得点を付与してください。
・IT導入補助金などのDX推進を目的とした補助金であれば、会計ソフトや人事労務ソフトを優先的に推薦してください。
・資金調達（ファクタリング等）や決済（法人カード等）は、事業のキャッシュフロー改善という観点から、必要性が認められる場合のみ適切なスコアを付与してください。

【タスク2：強烈なコンバージョンを生むSEOブログ記事の自動執筆】
この補助金を検討している経営者の心を動かし、具体的なアクション（ツールの導入検討や専門家への相談）へと繋げるような1000文字程度の解説記事（HTML形式）を執筆してください（seoArticleフィールド）。
・構成案（以下の見出しに沿って熱量高く書いてください）：
  <h3>この補助金の目的と最大限の活用メリット</h3><p>...</p>
  <h3>採択率を上げ、確実に成果を出すためのツールの選び方</h3><p>...</p>
  <h3>DXツール導入で経営をスマートにアップデートする</h3><p>...</p>
・必ず <h3> や <p>、 <strong> タグなどのHTMLタグのみを用いて装飾してください。

【厳重注意：JSON構文エラー回避のため】
seoArticleの値（HTML文字列）の中には**絶対に改行を含めない**でください。すべて1行のつながった文字列として出力してください。（改行コードが含まれるとJSON.parseがクラッシュします）。
また、HTMLタグの属性（class等）にはダブルクォート（"）ではなくシングルクォート（'）を使ってください。

【必須出力JSONフォーマット（Markdownの\`\`\`json等の装飾は一切入れず、純粋なJSONテキストのみを出力してください）】
{
  "matches": [
    {
      "toolSlug": "ツールのslug（完全一致）",
      "score": 85,
      "reasons": ["理由1", "理由2"]
    }
  ],
  "seoArticle": "<h3>この補助金の特徴と...</h3><p>...</p>"
}

【補助金情報】
名称: ${subsidy.subsidy_name || subsidy.title}
目的: ${subsidy.use_purpose}
詳細: ${subsidy.detail || subsidy.content}

【SaaSツール候補】
${toolDescriptions}
`;

  let resultText: string | null = null;

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
        continue;
      }

      if (!response.ok) {
        console.error(`Gemini API Error: ${response.statusText}`);
        continue;
      }

      const data = await response.json();
      resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (resultText) break;

    } catch (e) {
      console.warn("LLM Request error, trying next key", e);
    }
  }

  if (!resultText) return null;

  try {
    // 確実なJSON抽出: 最初の { から最後の } までを取り出す（LLMの前後の無駄話を除外）
    const match = resultText.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("JSON object not found in the response.");

    let jsonStr = match[0];
    
    // 【重要】パースエラーの最大の原因となる、JSON内の「AIが勝手に入れた改行（\n）」や「タブ文字」を完全に消し去る
    jsonStr = jsonStr.replace(/[\r\n\t]+/g, "");
    
    // 万が一残っているMarkdownのバッククォートを除去
    jsonStr = jsonStr.replace(/```json/g, "").replace(/```/g, "");

    const parsed = JSON.parse(jsonStr);

    const matches = parsed.matches.map((m: any) => ({
      subsidyId: subsidy.id,
      toolSlug: m.toolSlug,
      score: m.score,
      reasons: m.reasons
    })).filter((m: any) => m.score >= 50);

    return {
      matches,
      seoArticle: parsed.seoArticle || ""
    };
  } catch (e: any) {
    console.error("Failed to parse LLM response JSON. Raw text was:", resultText?.substring(0, 500) + '...');
    console.error("Error details:", e.message);
    return null;
  }
}
