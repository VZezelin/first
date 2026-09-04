# Amazon Price Tracker API: ASIN monitoring and price-drop alerts

Use the Signal Lab Amazon Price Tracker Actor when you need a small API-driven workflow for monitoring Amazon product prices by ASIN or product URL.

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

## Price-drop alert workflow

1. Run once with `emitOnlyChanges: false` to establish a baseline.
2. Schedule the Actor in Apify.
3. Set `emitOnlyChanges: true` for later checks.
4. Connect successful dataset rows to a webhook, Make, n8n, Slack, email, or your own backend.

## Price history

Persist rows from scheduled checks in your own database or analytics destination. This creates a time series of observed prices and availability for the selected ASINs.

Pricing may change, so use the live Apify **Pricing** tab as the source of truth.
