# YouTube Transcript API — captions, timestamps, Python, RAG, and MCP

Use Signal Lab's **YouTube Transcript API** on Apify to extract available public YouTube captions as full transcript text plus optional timestamped segments.

**Run now:** https://apify.com/signal_lab/youtube-transcript-scraper  
**Actor ID:** `signal_lab/youtube-transcript-scraper`

This guide covers common searches such as **YouTube transcript API Python**, **YouTube transcript API alternative**, **YouTube transcript API rate limit**, **YouTube transcript API for LangChain/RAG**, and **download YouTube transcript**.

## What it returns

For public videos with available captions, the Actor can return:

- full transcript text
- timestamped caption segments
- selected/detected caption language
- caption-track information
- video metadata and source URL

It accepts public YouTube watch URLs, Shorts URLs, live/embed links, `youtu.be` links, or 11-character video IDs.

## YouTube Transcript API example

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

## YouTube Transcript API with Python

You can start the same Actor from Python without running a local browser or maintaining a YouTube API integration:

```python
import os
import requests

actor = "signal_lab~youtube-transcript-scraper"
url = f"https://api.apify.com/v2/acts/{actor}/runs"

response = requests.post(
    url,
    headers={
        "Authorization": f"Bearer {os.environ['APIFY_TOKEN']}",
        "Content-Type": "application/json",
    },
    json={
        "urls": ["dQw4w9WgXcQ"],
        "preferredLanguages": ["en"],
        "preferManual": True,
        "includeSegments": True,
        "maxVideos": 10,
    },
    timeout=30,
)
response.raise_for_status()
print(response.json())
```

The response contains the Actor run metadata. Read the run's default Dataset after completion to retrieve the transcript rows.

## Input

| Field | Purpose |
|---|---|
| `urls` | Public YouTube URLs or video IDs. Required. |
| `preferredLanguages` | Caption language priority such as `en`, `uk`, `de`. |
| `preferManual` | Prefer creator-provided caption tracks over auto-generated tracks for the same language. |
| `includeSegments` | Include timestamp, duration, and text for each caption segment. |
| `maxVideos` | Hard cap on videos attempted; current schema allows 1–500. |

## YouTube Transcript API for LangChain and RAG

The Actor does not require a LangChain-specific adapter. A typical pipeline is:

1. run the Actor for one or more public videos;
2. fetch the resulting Dataset rows through the Apify API;
3. preserve transcript text, source URL, language, and timestamps;
4. chunk/embed the text with your preferred LangChain, LlamaIndex, vector database, or custom RAG pipeline.

Timestamped segments are useful when answers need links back to the relevant moment in the source video.

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

## YouTube Transcript API rate limits and batching

The current Actor input schema allows `maxVideos` from **1 to 500** per run. Actual API/run concurrency, account usage limits, and platform quotas depend on the Apify account and current platform settings, so use Apify's live account limits rather than assuming a fixed global rate limit.

For larger pipelines, batch URLs into bounded runs and use Apify schedules, webhooks, or API orchestration rather than creating unbounded requests.

## YouTube transcript API IP blocked / unavailable captions

The Actor runs in Apify's cloud, so you do not need to operate your own local browser session. However, it extracts **available public caption tracks** and does not promise to bypass YouTube restrictions. A video may still return no usable transcript when captions are unavailable, inaccessible, removed, region-limited, or otherwise not served upstream.

## YouTube Transcript API alternative

This Actor is useful as an alternative to maintaining a self-hosted transcript library when you want:

- a hosted API instead of local infrastructure
- Apify schedules and webhooks
- Dataset exports
- MCP access for AI agents
- bounded batch inputs
- pay-per-event Store pricing

It is not a speech-to-text service and does not claim to transcribe audio when no accessible caption track exists.

## Download YouTube transcript

For a no-code workflow:

1. open the [YouTube Transcript API on Apify](https://apify.com/signal_lab/youtube-transcript-scraper);
2. enter a public YouTube URL or video ID;
3. start the run;
4. open the resulting Dataset;
5. export the result as JSON, CSV, or Excel.

For automated downloads, fetch the Dataset through the Apify API after the run completes.

## Is the YouTube Transcript API free?

The Actor uses Apify **Pay per event** pricing rather than promising a permanently free API. Apify account credits, plan allowances, and Actor prices can change. Use the Actor's live **Pricing** tab as the source of truth before running it.

## Common uses

- transcript ingestion for RAG and semantic search
- video research and summarization pipelines
- timestamp-aware question answering
- subtitle/caption analysis
- content indexing and retrieval
- scheduled or API-driven transcript collection

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
