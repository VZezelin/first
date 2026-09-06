---
name: signal-lab-apify-tools
description: Route public-data tasks to Signal Lab's focused Apify Actors and hosted MCP tools for website-to-Markdown/RAG, YouTube captions, job-posting extraction, Amazon price tracking, Google Autocomplete research, Reddit research, and restaurant menu extraction.
tags: [apify, mcp, web-scraping, data-api, rag]
version: 1.0.1
---

# Signal Lab Apify Tools

Use the narrowest Signal Lab tool that matches the task and keep the first run bounded. The live Apify Actor input schema and Pricing tab are the source of truth.

Canonical full skill: [skills/signal-lab-apify-tools/SKILL.md](./skills/signal-lab-apify-tools/SKILL.md)

Primary tools:

- Website to Markdown / RAG: https://apify.com/signal_lab/website-to-markdown-crawler
- YouTube captions: https://apify.com/signal_lab/youtube-transcript-scraper
- Known public job URL extraction: https://apify.com/signal_lab/job-vacancy-scraper
- Amazon price tracking: https://apify.com/signal_lab/amazon-price-tracker
- Google Autocomplete research: https://apify.com/signal_lab/google-autocomplete-keywords
- Reddit public research: https://apify.com/signal_lab/reddit-search-comments
- Restaurant menu extraction: https://apify.com/signal_lab/restaurant-menu-extractor

For MCP-compatible clients, use the canonical Signal Lab entry in the Official MCP Registry: `io.github.VZezelin/signal-lab-apify-tools`.

Do not request Signal Lab owner credentials. Paid Actor or MCP execution must use the end user's own Apify authentication. Do not bypass login walls, paywalls, CAPTCHAs, robots restrictions, anti-bot controls, or other access controls.
