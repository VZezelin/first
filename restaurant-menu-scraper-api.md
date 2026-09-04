# Restaurant Menu Scraper API: items, prices, sections, and descriptions

Use the Signal Lab Restaurant Menu Extractor to turn a public restaurant/menu page into structured menu rows for apps, comparison workflows, data pipelines, or exports.

**Live Actor:** https://apify.com/signal_lab/restaurant-menu-extractor

## What it can extract

- menu item name
- description
- section/category
- price and currency when present
- diet metadata where available
- source URL
- Schema.org / JSON-LD menu data where present

## Minimal API call

```bash
curl -X POST \
  "https://api.apify.com/v2/acts/signal_lab~restaurant-menu-extractor/runs" \
  -H "Authorization: Bearer $APIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "urls": ["https://example.com/menu"],
    "maxItems": 50
  }'
```

The Actor targets public HTML/JSON-LD menu pages. It does not claim OCR/PDF extraction unless the live Actor page explicitly says so.

Pricing may change, so use the live Apify **Pricing** tab as the source of truth.
