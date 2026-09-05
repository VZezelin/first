# Amazon Price Tracker API: daily price, stock and price-drop monitoring

Use the Signal Lab Amazon Price Tracker Actor when you need an API-driven workflow for checking Amazon product price and availability by ASIN or product URL, keeping an observed price history, or triggering price-drop / stock-change automation.

**Live Actor:** https://apify.com/signal_lab/amazon-price-tracker

## Minimal API call

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

A result can include ASIN, current price, currency, previous price, price-change amount/percentage, availability, rating, review count, brand, URL, and timestamp.

## Daily price and availability monitoring

1. Run once with `emitOnlyChanges: false` to establish a baseline.
2. Schedule the Actor daily or at the interval your workflow needs.
3. Keep runs bounded and verify the live input schema before scaling a large catalog.
4. Store successful dataset rows in your database, spreadsheet, warehouse, or automation destination.

This creates an observed timeline of price and availability checks without requiring you to maintain your own Amazon scraper infrastructure.

## Price-drop and stock-change automation

For later checks, `emitOnlyChanges: true` can reduce downstream noise when a tracked price changes. Connect successful rows to a webhook, Make, n8n, Slack, email, or your own backend for alerts and follow-up logic.

## Price history

Persist scheduled results in your own analytics destination to build a time series of observed Amazon prices and availability. Keep source timestamps and ASINs so you can compare checks over time.

## Scope and reliability

Amazon changes page behavior and anti-bot controls frequently, so start with a small representative batch and inspect the first runs before increasing volume. Do not assume a very large catalog belongs in one run; use the live Actor input schema and Pricing tab as the source of truth for current limits and economics.

Pricing may change, so use the live Apify **Pricing** tab as the source of truth.
