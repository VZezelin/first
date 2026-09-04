# Google Autocomplete API: buyer-intent keyword research

Use the Signal Lab Google Autocomplete Actor to collect long-tail suggestions and inspect commercial keyword patterns such as `cost`, `pricing`, `free`, `alternative`, and `API`.

**Live Actor:** https://apify.com/signal_lab/google-autocomplete-keywords

## Minimal API call

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

## Buyer-intent workflow

1. Start with a product/category phrase.
2. Test commercial modifiers such as `cost`, `pricing`, `free`, `API`, `alternative`, `best`, and `vs`.
3. Repeat by country/language.
4. Export the normalized suggestions to JSON/CSV or pass them into your SEO/research pipeline.

Pricing may change, so use the live Apify **Pricing** tab as the source of truth.
