async function testFetch() {
  const url = 'https://api.jgrants-portal.go.jp/exp/v1/public/subsidies';
  
  const combos = [
    '',
    '?keyword=a',
    '?sort=created_at&order=DESC',
    '?sort=created_at&order=desc',
    '?page=1&limit=10',
    '?q=a',
    '?status=acceptance',
    '?keyword=',
    '?limit=10'
  ];

  for (const q of combos) {
    try {
      const res = await fetch(url + q, {
        method: 'GET',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
      });
      console.log(`[${res.status}] ${q || '(empty)'}`);
      if (res.ok) {
        console.log('SUCCESS with query:', q);
        break;
      }
    } catch (e) {
      console.error(e);
    }
  }
}

testFetch();
