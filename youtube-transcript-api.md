# YouTube Transcript API — captions, timestamps, and metadata

Use Signal Lab's **YouTube Transcript API** on Apify to extract available public YouTube captions as full transcript text plus optional timestamped segments.

**Run in Apify Store:** https://apify.com/signal_lab/youtube-transcript-scraper

**Actor ID:** `signal_lab/youtube-transcript-scraper`

## What it returns

For public videos with available captions, the Actor can return:

- full transcript text
- timestamped caption segments
- selected/detected caption language
- caption-track information
- video metadata and source URL

It accepts public YouTube watch URLs, Shorts URLs, live/embed links, `youtu.be` links, or 11-character video IDs.

## Run through the Apify API

Set an Apify API token in `APIFY_TOKEN`, then call the Actor directly:

```bash
curl -X POST \
  "https://api.apify.com/v2/acts/signal_lab~youtube-transcript-scraper/runs" \
  -H "Authorization: Bearer $APIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "urls": ["dQw4w9WgXcQ"],
    "preferredLanguages": ["en"],
    "preferManual": true,
    "includeSegments": true,
    "maxVideos": 10
  }'
```

The run writes results to its default Apify Dataset, which you can export as JSON, CSV, or Excel or fetch through the Apify API.

## Input

| Field | Purpose |
|---|---|
| `urls` | Public YouTube URLs or video IDs. Required. |
| `preferredLanguages` | Caption language priority such as `en`, `uk`, `de`. |
| `preferManual` | Prefer creator-provided caption tracks over auto-generated tracks for the same language. |
| `includeSegments` | Include timestamp, duration, and text for each caption segment. |
| `maxVideos` | Hard cap on videos attempted; current schema allows 1–500. |

## MCP / AI-agent usage

Signal Lab is published in the **Official Model Context Protocol Registry** as:

`io.github.VZezelin/signal-lab-apify-tools`

For a focused YouTube-only MCP connection, use Apify's hosted MCP endpoint:

```json
{
  "mcpServers": {
    "signal-lab-youtube": {
      "url": "https://mcp.apify.com?tools=signal_lab/youtube-transcript-scraper"
    }
  }
}
```

After Apify authentication, an agent can request tasks such as:

> Get the English transcript with timestamps for this public YouTube URL and preserve source timing for a RAG pipeline.

## Common uses

- transcript ingestion for RAG and semantic search
- video research and summarization pipelines
- timestamp-aware question answering
- subtitle/caption analysis
- content indexing and retrieval
- scheduled or API-driven transcript collection

## Pricing

The Actor uses Apify **Pay per event** pricing. Pricing can change, so use the live **Pricing** tab on the Actor page as the source of truth rather than hard-coding a price from this guide.

## Limitations and responsible use

The Actor extracts **available public captions**. It does not promise speech-to-text for videos without accessible caption tracks. Video availability, caption availability, language coverage, and upstream YouTube behavior can affect results.

Only process public content you are authorized to use and follow YouTube's terms, privacy rules, copyright requirements, and applicable law.

## Related Signal Lab APIs

- [Amazon Price Tracker API](./amazon-price-tracker-api.md)
- [Google Autocomplete API](./google-autocomplete-api.md)
- [Website to Markdown API](./website-to-markdown-api.md)
- [Reddit Scraper API](./reddit-scraper-api.md)
- [Job Posting Scraper API](./job-posting-scraper-api.md)
- [Restaurant Menu Scraper API](./restaurant-menu-scraper-api.md)
