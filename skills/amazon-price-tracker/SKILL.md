---
name: amazon-price-tracker
version: 1.0.0
description: Use Signal Lab's Apify Amazon Price Tracker when an agent needs bounded public Amazon price or availability monitoring for a known product/ASIN. Use when the user wants repeatable price checks or change detection and should rely on the live Apify schema and Pricing tab rather than guessed fields or stale pricing.
license: MIT
tags:
  - ecommerce
  - amazon
  - price-tracking
  - apify
  - data-api
compatibility: Requires network access and the user's own Apify authentication for paid Actor execution. Never use or request Signal Lab owner credentials.
metadata:
  author: Signal Lab
  homepage: https://first-livid-omega.vercel.app/amazon-price-tracker-api.html
  platforms:
    - openclaw
    - mcp
    - claude
    - openai
    - cursor
---

# Amazon Price Tracker

Use `signal_lab/amazon-price-tracker` for bounded monitoring of public Amazon product price and availability data for products the user already knows.

## Use when

- The user has a known Amazon product URL or ASIN and wants its current public price/availability checked.
- The user wants repeatable monitoring or a price-change workflow for a bounded product list.
- An agent needs structured Amazon price data through Apify instead of scraping ad hoc HTML itself.

## Do not use when

- The task requires bypassing login, CAPTCHA, anti-bot controls, private data, or other access restrictions.
- The user wants broad product discovery across Amazon without supplying a bounded target set.
- The requested use would violate applicable law, privacy requirements, site terms, or the user's authorization.

## Workflow

1. Open the live Actor page: https://apify.com/signal_lab/amazon-price-tracker
2. Read the current input schema and Pricing tab before execution; treat those as the source of truth.
3. Start with one known product/ASIN or the smallest useful batch.
4. Run with the user's own Apify authentication.
5. Wait for a terminal run state, then read the documented Dataset/output.
6. Return only fields actually present in the result. Missing price, stock, or metadata is not evidence that it exists.
7. For monitoring, compare successive successful results and record timestamps rather than inventing historical data.
8. Scale only after the bounded test is useful and the user accepts the live pricing/economics.

## Rules

- Never embed, expose, proxy, or request Signal Lab owner credentials.
- Never treat public run counts, directory listings, total users, or successful API responses as proof of creator revenue.
- Keep retries bounded; do not loop paid retries blindly.
- Respect `429` backpressure and stop on deterministic validation/authentication errors until corrected.
- Do not promise universal Amazon coverage or fields not exposed by the live Actor result.
- Use the live Apify Pricing tab rather than copied numeric pricing, because pricing can change.

## References

- Actor: https://apify.com/signal_lab/amazon-price-tracker
- API guide: https://first-livid-omega.vercel.app/amazon-price-tracker-api.html
- Signal Lab developer hub: https://first-livid-omega.vercel.app/
- Signal Lab Agent Skill bundle: https://first-livid-omega.vercel.app/skills/signal-lab-apify-tools/SKILL.md
