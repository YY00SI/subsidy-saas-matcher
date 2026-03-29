export async function GET() {
  const robots = `User-agent: *
Allow: /
Sitemap: https://YY00SI.github.io/subsidy-saas-matcher/sitemap-index.xml
`;

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain'
    }
  });
}
