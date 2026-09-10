---
name: signal-lab-apify-tools
description: Use Signal Lab's focused Apify data APIs and hosted MCP tools for public YouTube captions, website-to-Markdown RAG ingestion, known job-posting extraction, Amazon price tracking, Google Autocomplete research, Reddit research, and restaurant-menu extraction. Use when an agent needs a bounded public-data workflow and should choose a truthful Apify or MCP path.
---

# Signal Lab Apify Tools

Use the narrowest Signal Lab Actor that matches the user's task. Before any paid execution, read the live Apify input schema and Pricing tab and use the user's own Apify authentication.

## Tools

- YouTube captions: `signal_lab/youtube-transcript-scraper`
- Website to Markdown: `signal_lab/website-to-markdown-crawler`
- Known public job URL extraction: `signal_lab/job-vacancy-scraper`
- Amazon price tracking: `signal_lab/amazon-price-tracker`
- Google Autocomplete research: `signal_lab/google-autocomplete-keywords`
- Reddit public research: `signal_lab/reddit-search-comments`
- Restaurant menu extraction: `signal_lab/restaurant-menu-extractor`

## Execution rules

1. Prefer Apify hosted MCP when the client supports MCP; otherwise use the Apify Actor API.
2. Start with the smallest useful bounded input and scale only after verifying the first result and live pricing.
3. Never request, embed, proxy, or expose Signal Lab owner credentials.
4. Do not bypass login walls, paywalls, CAPTCHAs, robots restrictions, private pages, or other access controls.
5. Treat missing source fields as missing; never invent data or capabilities.
6. Treat public run counters, total users, directory listings, successful API requests, and site traffic as discovery signals only—not proof of creator revenue.
7. For YouTube, describe output as available public captions/timestamps, not newly generated speech-to-text.
8. For Website to Markdown, respect its HTTP-crawler limitations and bounded crawl controls.
9. For job extraction, use known public job URLs and do not imply universal job-board search.

## Canonical references

- Full skill: https://github.com/VZezelin/first/blob/main/skills/signal-lab-apify-tools/SKILL.md
- Signal Lab developer hub: https://first-livid-omega.vercel.app/
- Signal Lab on Apify: https://apify.com/signal_lab
- Official MCP Registry identity: `io.github.VZezelin/signal-lab-apify-tools`
