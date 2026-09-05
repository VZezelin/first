# Signal Lab — MCP Server + Apify Data APIs

Developer-first **Apify Actors and MCP tools** for Amazon price tracking, Google Autocomplete, website-to-Markdown/RAG, YouTube transcripts, Reddit search/comments, public job postings, and restaurant menus.

## Start here

| Need | Run now | API guide |
|---|---|---|
| Track an Amazon ASIN / price drop | [Run Amazon Price Tracker on Apify](https://apify.com/signal_lab/amazon-price-tracker) | [Amazon Price Tracker API](./amazon-price-tracker-api.md) |
| Get Google Autocomplete buyer-intent keywords | [Run Google Autocomplete API on Apify](https://apify.com/signal_lab/google-autocomplete-keywords) | [Google Autocomplete API](./google-autocomplete-api.md) |
| Convert a website to Markdown for RAG/LLMs | [Run Website to Markdown on Apify](https://apify.com/signal_lab/website-to-markdown-crawler) | [Website to Markdown API](./website-to-markdown-api.md) |
| Get a YouTube transcript with timestamps | [Run YouTube Transcript API on Apify](https://apify.com/signal_lab/youtube-transcript-scraper) | [YouTube Transcript API](./youtube-transcript-api.md) |
| Search Reddit posts and comments | [Run Reddit Scraper API on Apify](https://apify.com/signal_lab/reddit-search-comments) | [Reddit Scraper API](./reddit-scraper-api.md) |
| Extract a public job posting | [Run Job Vacancy Scraper on Apify](https://apify.com/signal_lab/job-vacancy-scraper) | [Job Posting Scraper API](./job-posting-scraper-api.md) |
| Extract restaurant menu items and prices | [Run Restaurant Menu Extractor on Apify](https://apify.com/signal_lab/restaurant-menu-extractor) | [Restaurant Menu Scraper API](./restaurant-menu-scraper-api.md) |

**No code:** open any Actor above, enter the input, and click **Start**.  
**API:** use the copy-paste examples below or open the dedicated guide.  
**AI agent / MCP:** connect the single remote endpoint below and choose the tool you need.

> Pricing can change. Use each Actor's live **Pricing** tab in Apify as the source of truth.

## Install as an Agent Skill

Signal Lab also ships a portable Agent Skill that teaches compatible agents when and how to route public-data work through the focused Apify Actors and Official MCP tools without embedding owner credentials.

**Indexed in askill:** https://askill.sh/skills/703900  
**OpenAgentSkill registry:** https://www.openagentskill.com/skills/vzezelin-first-signal-lab-apify-tools

Install from the verified askill registry entry:

```bash
npx askill-cli add gh:VZezelin/first@signal-lab-apify-tools -y
```

Or list/install directly from this public GitHub repository:

```bash
npx skills add VZezelin/first --list
npx skills add VZezelin/first --skill signal-lab-apify-tools -a codex -y --copy
```

The public install path has been verified from a clean workspace. The skill itself is at [`skills/signal-lab-apify-tools/SKILL.md`](./skills/signal-lab-apify-tools/SKILL.md). Installing the skill does not supply Apify credentials; paid Actor or MCP execution still uses the installer's own Apify authentication.

## Official MCP Registry

Signal Lab is published in the **Official Model Context Protocol Registry** as:

`io.github.VZezelin/signal-lab-apify-tools`

Registry search: https://registry.modelcontextprotocol.io/?q=io.github.VZezelin%2Fsignal-lab-apify-tools

The registered remote uses Apify's hosted Streamable HTTP MCP endpoint and exposes a focused set of Signal Lab tools:

```json
{
  "mcpServers": {
    "signal-lab": {
      "url": "https://mcp.apify.com?tools=signal_lab/amazon-price-tracker,signal_lab/google-autocomplete-keywords,signal_lab/website-to-markdown-crawler,signal_lab/youtube-transcript-scraper,signal_lab/reddit-search-comments,signal_lab/job-vacancy-scraper,signal_lab/restaurant-menu-extractor"
    }
  }
}
```

Apify handles the MCP connection and authentication flow. Actor pricing remains defined by each Actor's live Apify Pricing tab.

## Buyer-intent API guides

- [Amazon Price Tracker API — ASIN monitoring and price-drop alerts](./amazon-price-tracker-api.md)
- [Google Autocomplete API — buyer-intent keyword research](./google-autocomplete-api.md)
- [Website to Markdown API — clean RAG and LLM ingestion](./website-to-markdown-api.md)
- [YouTube Transcript API — captions, timestamps, and metadata](./youtube-transcript-api.md)
- [Job Posting Scraper API — title, salary, company, and location](./job-posting-scraper-api.md)
- [Restaurant Menu Scraper API — items, prices, sections, and descriptions](./restaurant-menu-scraper-api.md)
- [Reddit Scraper API — search posts and comments](./reddit-scraper-api.md)

## 1. Amazon Price Tracker API — track an ASIN and build price-drop alerts

**Run in Store:** https://apify.com/signal_lab/amazon-price-tracker

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

**Run in Store:** https://apify.com/signal_lab/google-autocomplete-keywords

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

**Run in Store:** https://apify.com/signal_lab/website-to-markdown-crawler

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

**Run in Store:** https://apify.com/signal_lab/youtube-transcript-scraper  
**API guide:** [youtube-transcript-api.md](./youtube-transcript-api.md)

Useful for:
- public YouTube transcripts
- timestamped caption segments
- RAG and semantic search
- research, summarization, and indexing workflows

The dedicated guide includes the current input fields, a copy-paste API call, and the focused MCP configuration.

## MCP / AI-agent usage

The Official MCP Registry entry above is the canonical discovery record for this Signal Lab tool bundle. You can also configure the same Apify-hosted endpoint directly in MCP-compatible clients.

After authentication, an agent can request tasks such as:
- “Track this Amazon ASIN and return the current price.”
- “Find Google Autocomplete suggestions for this buyer-intent keyword.”
- “Convert this page to clean Markdown for a RAG pipeline.”
- “Get this public YouTube transcript with timestamps.”
- “Search Reddit for recent product feedback and return source URLs.”
- “Extract structured fields from this public job posting.”
- “Extract menu items and prices from this restaurant page.”

## More Signal Lab Actors

Browse the public portfolio: https://apify.com/signal_lab

Use public data responsibly and follow the target site's terms, privacy rules, copyright requirements, and applicable law.
