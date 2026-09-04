# Signal Lab — Apify API examples for price tracking, keyword research, RAG, and transcripts

Small copy-paste examples for public **Signal Lab** Actors on the Apify Store. The goal is to make common automation jobs easy to test from the Store, Apify API, schedules, webhooks, Make, n8n, or MCP.

> Pricing can change. Use each Actor's live **Pricing** tab in Apify as the source of truth.

## 1. Amazon Price Tracker API — track an ASIN and build price-drop alerts

**Actor:** https://apify.com/signal_lab/amazon-price-tracker

Useful for:
- Amazon price tracking by ASIN/product URL
- price history pipelines
- price-change and price-drop alerts
- scheduled competitor monitoring

Run through the Apify API:

```bash
curl -X POST \
  "https://api.apify.com/v2/acts/signal_lab~amazon-price-tracker/runs" \
  -H "Authorization: Bearer $APIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productUrls": ["https://www.amazon.com/dp/0132350882"],
    "emitOnlyChanges": false,
    "proxyConfiguration": {"useApifyProxy": false},
    "maxItems": 10
  }'
```

For alerts, run it on an Apify schedule and connect a webhook/Make/n8n flow to the resulting dataset.

## 2. Google Autocomplete API — buyer-intent keyword suggestions

**Actor:** https://apify.com/signal_lab/google-autocomplete-keywords

Useful for:
- Google Autocomplete keyword research
- commercial modifiers such as `cost`, `pricing`, `free`, `alternative`, and `API`
- country/language-specific long-tail research
- programmatic SEO and demand discovery

```bash
curl -X POST \
  "https://api.apify.com/v2/acts/signal_lab~google-autocomplete-keywords/runs" \
  -H "Authorization: Bearer $APIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "queries": ["google autocomplete api"],
    "language": "en",
    "country": "us",
    "expandAlphabet": false,
    "includeQuestions": false,
    "maxResults": 20
  }'
```

## 3. Website to Markdown API — clean pages for RAG and LLM ingestion

**Actor:** https://apify.com/signal_lab/website-to-markdown-crawler

Useful for:
- website-to-Markdown conversion
- clean RAG/LLM source documents
- headings, links, metadata, and structured page extraction
- one-page API calls or bounded website crawls

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

## 4. YouTube Transcript API — captions, timestamps, and metadata

**Actor:** https://apify.com/signal_lab/youtube-transcript-scraper

Useful for:
- public YouTube transcripts
- timestamped caption segments
- RAG and semantic search
- research, summarization, and indexing workflows

Open the Actor's Store page for the current input schema and live pricing, then run it from the UI, API, schedule, or MCP.

## MCP / AI-agent usage

Apify Actors can also be exposed through Apify's hosted MCP integration. For example:

```json
{
  "mcpServers": {
    "signal-lab": {
      "url": "https://mcp.apify.com?tools=signal_lab/amazon-price-tracker,signal_lab/google-autocomplete-keywords,signal_lab/website-to-markdown-crawler,signal_lab/youtube-transcript-scraper"
    }
  }
}
```

After authentication, an agent can request tasks such as:
- “Track this Amazon ASIN and return the current price.”
- “Find Google Autocomplete suggestions for this buyer-intent keyword.”
- “Convert this page to clean Markdown for a RAG pipeline.”
- “Get this public YouTube transcript with timestamps.”

## More Signal Lab Actors

Browse the public portfolio: https://apify.com/signal_lab

Use public data responsibly and follow the target site's terms, privacy rules, copyright requirements, and applicable law.
