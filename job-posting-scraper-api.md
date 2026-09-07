# Job Posting Scraper API: title, company, salary, location, and dates

Use the Signal Lab Job Vacancy Scraper when you already have a public job-posting URL and need structured fields for recruiting automation, hiring-market monitoring, ATS ingestion, analysis, or export.

**Live Actor:** https://apify.com/signal_lab/job-vacancy-scraper

## Best-fit use cases

- normalize public job pages before importing them into an ATS or internal database
- monitor hiring pages for title, location, salary, and expiry-date changes
- build company hiring-signal datasets from known public vacancy URLs
- enrich recruiting or market-research workflows with structured `JobPosting` fields
- export a small set of public vacancies to downstream CSV/JSON workflows without writing a custom parser

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

## Expected result shape

A successful result is designed for direct downstream use and can include fields such as:

```json
{
  "title": "Senior Backend Engineer",
  "company": "Example Company",
  "location": "Remote",
  "employmentType": "FULL_TIME",
  "salary": {
    "currency": "USD",
    "min": 120000,
    "max": 150000
  },
  "datePosted": "2026-09-01",
  "validThrough": "2026-10-01",
  "url": "https://example.com/public-job-posting"
}
```

Fields are returned only when the source page exposes them; missing values are not invented.

This is a page-to-structured-data API: it does not claim to search every job board or bypass login walls. Use public pages you are authorized to process.

Pricing may change, so use the live Apify **Pricing** tab as the source of truth.
