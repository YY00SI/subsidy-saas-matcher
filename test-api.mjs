const params = new URLSearchParams({
  keyword: "補助金",
  sort: "created_date",
  order: "DESC",
  acceptance: "1"
});
const url = "https://api.jgrants-portal.go.jp/exp/v1/public/subsidies?" + params.toString();
console.log("Fetching: " + url);
try {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/123.0.0.0",
      "Accept": "application/json"
    }
  });
  console.log("HTTP Status:", response.status);
  const text = await response.text();
  console.log("Response Preview:", text.substring(0, 300));
} catch (err) {
  console.error("Fetch Error:", err);
}
