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

## Workflow

1. Identify the exact data need and select the narrowest matching tool.
   - YouTube captions: `signal_lab/youtube-transcript-scraper`
   - Website to Markdown: `signal_lab/website-to-markdown-crawler`
   - Known public job URL extraction: `signal_lab/job-vacancy-scraper`
   - Amazon price tracking: `signal_lab/amazon-price-tracker`
   - Google Autocomplete research: `signal_lab/google-autocomplete-keywords`
   - Reddit public research: `signal_lab/reddit-search-comments`
   - Restaurant menu extraction: `signal_lab/restaurant-menu-extractor`
2. Read the tool's live Apify input schema and Pricing tab before execution.
3. Prefer Apify hosted MCP when the client supports MCP and the user can authenticate with Apify; otherwise use the Apify REST Actor API with the user's own token.
4. Start with the smallest useful bounded input and inspect the first result before expanding.
5. Verify returned fields against the source and stop on deterministic auth/validation errors instead of blind retries.

## Direct tool links

- YouTube captions: https://apify.com/signal_lab/youtube-transcript-scraper
- Website to Markdown: https://apify.com/signal_lab/website-to-markdown-crawler
- Known public job URL extraction: https://apify.com/signal_lab/job-vacancy-scraper
- Amazon price tracking: https://apify.com/signal_lab/amazon-price-tracker
- Google Autocomplete research: https://apify.com/signal_lab/google-autocomplete-keywords
- Reddit public research: https://apify.com/signal_lab/reddit-search-comments
- Restaurant menu extraction: https://apify.com/signal_lab/restaurant-menu-extractor

## Rules

- Always use the user's own Apify authentication for paid execution or MCP authorization.
- Never embed, expose, proxy, or request Signal Lab owner credentials.
- Never treat a public Actor run counter, total users, a directory listing, or a successful API request as proof of creator revenue.
- Use the live Apify Pricing tab as the commercial source of truth before execution.
- Keep paid retries and scope expansion bounded.

## References

- Signal Lab developer hub: https://first-livid-omega.vercel.app/
- AI-agent discovery index: https://first-livid-omega.vercel.app/llms.txt
- Official MCP Registry identity: `io.github.VZezelin/signal-lab-apify-tools`
- Official MCP Registry search: https://registry.modelcontextprotocol.io/?q=io.github.VZezelin%2Fsignal-lab-apify-tools
- Signal Lab on Apify: https://apify.com/signal_lab
