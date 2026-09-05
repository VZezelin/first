---
name: youtube-transcript-api
slug: youtube-transcript-api
version: 1.0.1
tags:
  - youtube
  - transcript
  - captions
  - api
  - rag
  - langchain
description: Use the Signal Lab YouTube Transcript API on Apify when an agent needs available public YouTube captions, timestamped transcript segments, language selection, transcript metadata, JSON/CSV output, or transcript ingestion for Python, RAG, LangChain, research, summarization, and semantic search. Use for public caption extraction, not speech-to-text when a video has no accessible caption track.
license: MIT
compatibility: Requires network access and the user's own Apify authentication for paid Actor or MCP execution. Never use or request Signal Lab owner credentials.
metadata:
  author: Signal Lab
  homepage: https://first-livid-omega.vercel.app/youtube-transcript-api.html
  actor: signal_lab/youtube-transcript-scraper
---

# YouTube Transcript API

Route public YouTube caption work to the focused Signal Lab Actor `signal_lab/youtube-transcript-scraper`. Keep the first call small, use the live Apify input schema and Pricing tab as source of truth, and return only caption data the source actually exposes.

## Use When

- The user needs a YouTube transcript API for one or more public videos with accessible captions.
- The user needs timestamped caption segments for citation-aware RAG, LangChain, semantic search, research, or summarization.
- A Python or REST workflow needs structured caption output and metadata instead of copying transcript text manually.
- An MCP-capable agent should expose the YouTube transcript Actor through Apify's hosted MCP server.
- The user is evaluating a YouTube transcript API alternative and wants a bounded Apify workflow with live pricing visible before execution.

## Don't Use When

- The video has no accessible public caption track and the task requires audio speech-to-text. This Actor extracts available captions; it does not transcribe audio.
- The task requires bypassing private videos, login walls, regional restrictions, CAPTCHAs, or other access controls.
- The requested use would violate copyright, privacy, platform terms, or applicable law.
- A transcript is already present in the conversation and no external execution is needed.

## Workflow

1. Use the live Actor page and input schema for `signal_lab/youtube-transcript-scraper`.
2. Check the live Pricing tab before execution; examples and old documentation are not a pricing guarantee.
3. Start with one public video URL before expanding a batch.
4. Select only the language/caption options the user actually needs.
5. Run with the user's own Apify authentication, either through REST or Apify-hosted MCP.
6. Wait for the terminal run state, then read the documented Dataset/output.
7. Preserve source video URL, language, transcript text, and timestamps when those fields are returned.
8. For RAG or LangChain, chunk downstream only after confirming that caption segments and timing are complete enough for the task.
9. Expand to more videos only after the first bounded result is useful and the user accepts the live economics.

## REST Pattern

Use the user's own token and the live Actor schema. The canonical Actor run endpoint is:

```text
POST https://api.apify.com/v2/acts/signal_lab~youtube-transcript-scraper/runs
Authorization: Bearer $APIFY_TOKEN
Content-Type: application/json
```

Do not hard-code an owner token into source code, examples, shared prompts, or repository files.

## MCP Pattern

For an MCP-compatible client, use the focused Apify-hosted endpoint:

```json
{
  "mcpServers": {
    "signal-lab-youtube-transcript": {
      "url": "https://mcp.apify.com?tools=signal_lab/youtube-transcript-scraper"
    }
  }
}
```

Apify handles the authentication flow. The user supplies their own authorized Apify account.

## Rate Limits, Retries, and Cost Stops

- Treat HTTP `429` as backpressure. Respect `Retry-After` when present; otherwise use bounded exponential backoff with jitter.
- Retry transient `5xx`, network, and timeout errors only a small number of times. Do not retry deterministic validation or authentication `4xx` errors until the underlying problem changes.
- If the Actor run reaches `FAILED`, `TIMED-OUT`, or `ABORTED`, inspect the run evidence before retrying. Never loop paid retries blindly.
- Poll run status with backoff and stop polling at a terminal state.
- Keep the retry input the same size or smaller. Do not increase video count, concurrency, proxy scope, or other paid dimensions as a generic failure response.
- Stop if repeated retries fail or the next attempt would materially increase spend without a clear reason.

## Output Rules

- Describe the result as available public captions/transcript data, not newly generated audio transcription.
- Do not invent missing words, timestamps, speaker labels, or languages.
- If captions are unavailable, return that as the limitation instead of silently switching to another paid service.
- Keep source URLs attached to transcript chunks used in RAG or research.
- Distinguish API execution success from creator revenue or payment evidence.

## Example Tasks

- “Get the transcript and timestamps for this public YouTube video in JSON.”
- “Fetch captions for these three videos and prepare citation-aware chunks for LangChain.”
- “Use a YouTube transcript API from Python and preserve timestamps for semantic search.”
- “Download the available public transcript for this video without inventing text if captions are missing.”

## References

- Live Actor: https://apify.com/signal_lab/youtube-transcript-scraper
- Buyer-intent guide: https://first-livid-omega.vercel.app/youtube-transcript-api.html
- Signal Lab developer hub: https://first-livid-omega.vercel.app/
- Official MCP Registry bundle: `io.github.VZezelin/signal-lab-apify-tools`
