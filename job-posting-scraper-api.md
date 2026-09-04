# Job Posting Scraper API: title, company, salary, location, and dates

Use the Signal Lab Job Vacancy Scraper when you already have a public job-posting URL and need structured fields for automation, analysis, or export.

**Live Actor:** https://apify.com/signal_lab/job-vacancy-scraper

## What it extracts

- job title
- company
- location
- salary range and currency when present
- employment type
- published / valid-through dates when present
- source URL
- structured JobPosting metadata where available

## Minimal API call

```bash
curl -X POST \
  "https://api.apify.com/v2/acts/signal_lab~job-vacancy-scraper/runs" \
  -H "Authorization: Bearer $APIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "urls": ["https://example.com/public-job-posting"],
    "maxJobs": 5,
    "maxItems": 5
  }'
```

This is a page-to-structured-data API: it does not claim to search every job board or bypass login walls. Use public pages you are authorized to process.

Pricing may change, so use the live Apify **Pricing** tab as the source of truth.
