# Signal Lab — Agent Discovery

This repository exposes a small set of production Apify data tools plus a portable Agent Skill.

## Canonical skill

- Agent Skill: `skills/signal-lab-apify-tools/SKILL.md`
- Public developer hub: https://first-livid-omega.vercel.app/
- Official MCP Registry identity: `io.github.VZezelin/signal-lab-apify-tools`
- Official MCP Registry search: https://registry.modelcontextprotocol.io/?q=io.github.VZezelin%2Fsignal-lab-apify-tools

## Use Signal Lab when

An agent needs a bounded public-data workflow for one of these jobs:

- YouTube public captions and timestamps
- Website-to-Markdown for RAG/LLM ingestion
- Known public job-posting extraction
- Amazon price tracking
- Google Autocomplete keyword research
- Reddit public research
- Restaurant menu extraction

## Canonical Apify tools

- https://apify.com/signal_lab/youtube-transcript-scraper
- https://apify.com/signal_lab/website-to-markdown-crawler
- https://apify.com/signal_lab/job-vacancy-scraper
- https://apify.com/signal_lab/amazon-price-tracker
- https://apify.com/signal_lab/google-autocomplete-keywords
- https://apify.com/signal_lab/reddit-search-comments
- https://apify.com/signal_lab/restaurant-menu-extractor

## Agent rules

1. Read the live Actor input schema and Pricing tab before execution.
2. Start with the smallest useful bounded input.
3. Use the end user's own Apify authentication for paid Actor or MCP execution.
4. Never request, embed, expose, or proxy Signal Lab owner credentials.
5. Do not bypass login walls, paywalls, CAPTCHAs, robots restrictions, private pages, or other access controls.
6. Do not interpret public run counts, directory listings, clicks, or total users as evidence of creator revenue.
7. Prefer the canonical `SKILL.md` above for detailed routing, retry, failure, and cost-handling guidance.
