# Reddit Scraper API — search posts and comments without Reddit API setup

Use the public **Signal Lab Reddit Search & Comments Scraper** on Apify when you need structured Reddit posts or optional nested comments through an API, schedule, webhook, or AI-agent workflow.

**Actor:** https://apify.com/signal_lab/reddit-search-comments

> Pricing can change. Use the Actor's live **Pricing** tab in Apify as the source of truth.

## Good fit for

- Reddit search API workflows
- subreddit monitoring
- social listening and market research
- product feedback and pain-point discovery
- collecting bounded post datasets for RAG or analysis
- optional nested comments when discussion context matters

## Run it through the Apify API

```bash
curl -X POST \
  "https://api.apify.com/v2/acts/signal_lab~reddit-search-comments/runs" \
  -H "Authorization: Bearer $APIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "queries": ["product feedback"],
    "subreddits": [],
    "sort": "relevance",
    "time": "month",
    "includeComments": false,
    "maxPosts": 5,
    "maxCommentsPerPost": 0
  }'
```

This starts a bounded run with five post results maximum. Add one or more subreddit names when you want to restrict the search.

## Get posts plus comments

Enable comments only when you need thread context:

```json
{
  "queries": ["pricing complaint"],
  "subreddits": ["SaaS"],
  "sort": "new",
  "time": "month",
  "includeComments": true,
  "maxPosts": 10,
  "maxCommentsPerPost": 20
}
```

The dataset normalizes posts and comments with source URLs, authors when available, scores, timestamps, parent relationships, and source labels.

## Use it from an AI agent with MCP

```json
{
  "mcpServers": {
    "signal-lab-reddit": {
      "url": "https://mcp.apify.com?tools=signal_lab/reddit-search-comments"
    }
  }
}
```

After Apify authentication, an agent can ask for a bounded task such as:

> Search Reddit for recent posts about API pricing complaints, return at most 20 posts, and include the source links.

## Notes

The Actor targets public Reddit content and may use an archive fallback for some subreddit requests when live cloud access is blocked. Output rows identify their source. Archive coverage and freshness can differ from live Reddit.

Use conservative limits and collect public data responsibly. Follow Reddit's terms, privacy rules, and applicable law.
