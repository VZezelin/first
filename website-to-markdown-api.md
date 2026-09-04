# Website to Markdown API for RAG and LLM pipelines

Use the public Signal Lab **Website to Markdown Crawler** on Apify when you need clean page content for RAG ingestion, LLM analysis, semantic search, documentation indexing, or content audits.

**Actor:** https://apify.com/signal_lab/website-to-markdown-crawler

> Pricing can change. Use the Actor's live **Pricing** tab in Apify as the source of truth.

## Quick API example

```bash
curl -X POST \
  "https://api.apify.com/v2/acts/signal_lab~website-to-markdown-crawler/runs" \
  -H "Authorization: Bearer $APIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "startUrls": [{"url": "https://example.com"}],
    "maxPages": 1,
    "maxDepth": 0,
    "sameDomainOnly": true,
    "useSitemaps": false,
    "respectRobotsTxt": true
  }'
```

Start with one page, inspect the dataset, then increase `maxPages` and `maxDepth` for a bounded crawl.

## Output useful for RAG

Successful page results include clean Markdown plus URL/final URL, HTTP status, title and description, canonical URL, language, headings, links, JSON-LD, crawl depth, text length, and scrape timestamp.

That makes the Actor useful as the extraction step before chunking, embeddings, vector indexing, or downstream LLM processing.

## Control what enters the corpus

Use:

- `sameDomainOnly` to avoid following unrelated domains;
- `maxPages` as a hard successful-page cap;
- `maxDepth` to bound link traversal;
- `includePatterns` / `excludePatterns` to target relevant URL paths;
- `removeSelectors` to remove additional page noise;
- `respectRobotsTxt` for robots-aware crawling;
- `useSitemaps` when sitemap discovery is useful.

## MCP / AI-agent use

The Actor can be exposed through Apify's hosted MCP server:

```json
{
  "mcpServers": {
    "signal-lab-markdown": {
      "url": "https://mcp.apify.com?tools=signal_lab/website-to-markdown-crawler"
    }
  }
}
```

An authenticated MCP client can then request a bounded workflow such as: “Convert this documentation site to clean Markdown, stay on the same domain, and stop after 20 pages.”

## Limitations

This is an HTTP crawler. It does not execute client-side JavaScript or bypass logins, paywalls, CAPTCHAs, robots rules, or anti-bot controls. Dynamic single-page applications may return incomplete content.

Use public data responsibly and follow the target site's terms, privacy rules, copyright requirements, and applicable law.
