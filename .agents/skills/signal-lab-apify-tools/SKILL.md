---
name: signal-lab-apify-tools
version: 1.0.1
description: Use Signal Lab's focused Apify data APIs or Official MCP tools for public YouTube captions, website-to-Markdown RAG ingestion, known job-posting extraction, Amazon price tracking, Google Autocomplete research, Reddit research, and restaurant menu extraction. Use when an agent needs one of these public-data workflows and should choose a bounded, truthful Apify or MCP path instead of inventing scraping capabilities.
license: MIT
tags:
  - apify
  - mcp
  - web-scraping
  - data-api
  - rag
compatibility: Requires network access and the user's own Apify authentication for paid Actor or MCP execution. Never use or request Signal Lab owner credentials.
metadata:
  author: Signal Lab
  homepage: https://first-livid-omega.vercel.app/
  registry: io.github.VZezelin/signal-lab-apify-tools
  platforms:
    - openclaw
    - mcp
    - claude
    - openai
    - cursor
---

# Signal Lab Apify Tools

Use Signal Lab as a routing skill for a small set of focused public-data workflows. Prefer the narrowest Actor that matches the task, keep inputs bounded, and treat the live Apify Actor input schema and Pricing tab as the source of truth.

## Use When

- The user needs available public YouTube captions or timestamped caption segments for research, RAG, or analysis.
- The user needs a public website or bounded same-domain crawl converted to clean Markdown for RAG, semantic search, indexing, or LLM analysis.
- The user already has one or more public job-posting URLs and needs normalized job fields, especially Schema.org `JobPosting` data when exposed by the page.
- The user needs public Amazon product price or availability tracking, live Google Autocomplete keyword suggestions, public Reddit research, or supported restaurant-menu extraction.
- An MCP-capable client should expose one or more Signal Lab Actors as tools through Apify's hosted MCP server.
- A non-MCP workflow should call the corresponding Actor through the Apify REST API and consume its Dataset.

## Don't Use When

- The task requires bypassing login walls, paywalls, CAPTCHAs, robots restrictions, anti-bot controls, private pages, or other access controls.
- The user asks for audio transcription of a YouTube video with no accessible public caption track; the YouTube Actor extracts available captions and is not a speech-to-text service.
- The website requires client-side JavaScript rendering that an HTTP-only crawler cannot provide; do not claim the Website to Markdown Actor renders SPAs.
- The user wants broad job-board discovery rather than extraction from known supported public job URLs; do not imply the Job Vacancy Scraper searches every job board.
- The requested source or use would violate applicable law, privacy requirements, copyright obligations, site terms, or the user's authorization.
- The task can be answered directly without external data execution; do not start an Actor just to demonstrate the skill.

## Workflow

1. Identify the exact data need and select the narrowest matching tool.
   - YouTube captions: `signal_lab/youtube-transcript-scraper`
   - Website to Markdown: `signal_lab/website-to-markdown-crawler`
   - Known public job URL extraction: `signal_lab/job-vacancy-scraper`
   - Amazon price tracking: `signal_lab/amazon-price-tracker`
   - Google Autocomplete research: `signal_lab/google-autocomplete-keywords`
   - Reddit public research: `signal_lab/reddit-search-comments`
   - Restaurant menu extraction: `signal_lab/restaurant-menu-extractor`
2. Read the tool's live Apify input schema and Pricing tab before execution. Pricing, availability, and schema can change; documentation examples are not a substitute for live state.
3. Choose the execution surface.
   - Prefer Apify hosted MCP when the client supports MCP and the user can authenticate with Apify.
   - Otherwise use the Apify REST Actor API with the user's own Apify token.
4. Start with the smallest useful bounded input.
   - For crawls, minimize page count and depth first.
   - For lists of URLs/videos/products, test a small subset before expanding.
   - Never increase spend or scope merely to collect more data.
5. Wait for the run to finish, then consume the default Dataset or the Actor's documented output.
6. Verify that returned fields actually came from the source. Missing source fields are not evidence that they exist.
7. Scale only after the first bounded result is useful and the user accepts the live pricing/economics.

## Direct tool links

Use these canonical Store pages when a user or agent needs to inspect the live schema, Pricing tab, examples, or start a run:

- YouTube captions: https://apify.com/signal_lab/youtube-transcript-scraper
- Website to Markdown: https://apify.com/signal_lab/website-to-markdown-crawler
- Known public job URL extraction: https://apify.com/signal_lab/job-vacancy-scraper
- Amazon price tracking: https://apify.com/signal_lab/amazon-price-tracker
- Google Autocomplete research: https://apify.com/signal_lab/google-autocomplete-keywords
- Reddit public research: https://apify.com/signal_lab/reddit-search-comments
- Restaurant menu extraction: https://apify.com/signal_lab/restaurant-menu-extractor

For MCP clients, expose only the tool(s) needed for the current task through Apify's hosted MCP server rather than giving an agent a broader tool surface than necessary.

## Failure, Retry, and Cost Handling

- Treat HTTP `429` as backpressure, not permission to increase concurrency. Respect `Retry-After` when present; otherwise use bounded exponential backoff with jitter.
- Retry transient `5xx`, network, or timeout failures only a small number of times. Do not retry deterministic `4xx` validation/authentication errors until the input or authentication problem is corrected.
- If an Actor run reaches `FAILED`, `TIMED-OUT`, or `ABORTED`, inspect the run status/log evidence before deciding whether a retry is justified. Never loop paid retries blindly.
- For polling, back off between status checks rather than hammering the API. Stop polling once the run is terminal.
- Keep the original input bounded when retrying. Do not raise `maxPages`, item counts, crawl depth, concurrency, or proxy scope as a generic failure response.
- Re-check the live Pricing tab before materially expanding a retry or batch. A successful API request does not mean the downstream run is free.
- Stop and report the blocker if repeated transient retries fail, the source blocks lawful access, authentication is unavailable, or the next attempt would materially increase spend.
- Never convert a failed paid run into an excuse to start a different paid Actor without a clear task fit and user-authorized economics.

## Rules

- Always use the user's own Apify authentication for paid execution or MCP authorization.
- Never embed, expose, proxy, or request Signal Lab owner credentials.
- Never treat a public Actor run counter, total users, a directory listing, or a successful API request as proof of creator revenue.
- Never promise fields the source page or caption track does not expose.
- Never claim access-control bypass capabilities.
- Prefer reversible, bounded calls and the minimum required data volume.
- Use the live Apify Pricing tab as the commercial source of truth before execution.
- For Website to Markdown, respect its HTTP-crawler limitation and bounded crawl controls.
- For YouTube, describe output as available public captions/timestamps, not newly generated transcription.
- For Job Posting extraction, describe it as known-public-URL extraction and Schema.org-aware parsing, not universal job search.

## Examples

### YouTube captions for RAG

User need: "Get timestamps from these public YouTube videos so I can build a citation-aware RAG index."

Use `signal_lab/youtube-transcript-scraper` with a small set of public URLs, request timestamped segments, then preserve source URL, language, transcript text, and segment timing when building the downstream index.

### Website documentation to Markdown

User need: "Turn this documentation site into a small Markdown corpus for my LLM."

Use `signal_lab/website-to-markdown-crawler`. Start with one page or a low `maxPages` value, keep `sameDomainOnly` enabled, keep crawl depth low, and respect robots rules. Inspect the first Dataset rows before expanding.

### Known job posting to structured JSON

User need: "Normalize title, company, location, salary, and dates from these five job URLs."

Use `signal_lab/job-vacancy-scraper` only for the supplied public URLs. Return fields that the pages actually expose and note missing values rather than fabricating them.

### MCP connection

For a focused Website to Markdown tool, an MCP-capable client can use:

```json
{
  "mcpServers": {
    "signal-lab-markdown": {
      "url": "https://mcp.apify.com?tools=signal_lab/website-to-markdown-crawler"
    }
  }
}
```

Apify handles authentication. Do not put an owner token into shared configuration.

## Edge Cases

- If Apify authentication is unavailable, provide the correct Actor or MCP connection path but do not execute paid work on somebody else's credentials.
- If the live Actor schema differs from this skill, follow the live schema and update assumptions accordingly.
- If the page is JavaScript-only and the HTTP crawler returns incomplete content, stop and explain the rendering limitation instead of escalating into access-control bypass techniques.
- If YouTube exposes no usable public captions, stop and report that limitation; do not silently switch to a different paid transcription product.
- If a job page lacks salary or structured metadata, return the fields that are verifiably present and mark the rest missing.
- If a requested run could become large or costly, shrink the initial input and ask for approval before materially expanding spend.

## References

- Signal Lab developer hub: https://first-livid-omega.vercel.app/
- AI-agent discovery index: https://first-livid-omega.vercel.app/llms.txt
- Official MCP Registry identity: `io.github.VZezelin/signal-lab-apify-tools`
- Official MCP Registry search: https://registry.modelcontextprotocol.io/?q=io.github.VZezelin%2Fsignal-lab-apify-tools
- Signal Lab on Apify: https://apify.com/signal_lab
- YouTube Transcript API guide: https://first-livid-omega.vercel.app/youtube-transcript-api.html
- Website to Markdown API guide: https://first-livid-omega.vercel.app/website-to-markdown-api.html
- Job Posting Scraper API guide: https://first-livid-omega.vercel.app/job-posting-scraper-api.html
