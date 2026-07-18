# IdeaBrowser Teardown

Research notes on ideabrowser.com (Greg Isenberg / Startup Ideas Podcast team),
compiled to inform what Idea Lab (this repo) clones, skips, and does
differently. IdeaBrowser blocks automated fetching (403s on direct requests
and headless Chromium — this network's outbound proxy can't reach it either),
so this is built from your actual Idea of the Day emails, IdeaBrowser's own
public marketing pages surfaced via search, and third-party reviews. Treat
numbers here the way the rest of this repo treats estimates: directional, not
verified against the live site.

## The shape of the product: two layers

**1. The exterior — free daily content, the acquisition engine.**
One free "Idea of the Day" email, live on the site until midnight UTC, then
gated. This is the loop you're subscribed to. Structure of the email (from
your actual 6 emails, spanning June–November 2025 and July 2026):

- **Idea of the Day** — problem paragraph, solution paragraph, "Browse this
  idea" + featured image + "View full idea" links, countdown urgency ("free
  until midnight UTC")
- **Also released today** — 2-3 more ideas dropped same day, so the database
  visibly grows daily
- **Trend Watch / Hidden Niche Opportunity** — alternates between a search-trend
  writeup (a specific query like "engagement ring style" analyzed for buying
  intent) and a niche-opportunity writeup (a narrower pain than the main idea)
- **Founder Playbook** — a real operator's growth story (e.g., GreenPal's
  founder texting 500 leads a night) distilled into a named, reusable tactic
  ("The night-shift supply run") with numbered steps — content marketing that
  also teaches execution
- **Steal This** — a boxed, actionable mini-framework extracted from the
  playbook (e.g. "The free-tool channel test": 3 criteria for when a free
  companion tool works as a channel)
- **Builder Bookmarks** — 3 curated tweets/links worth a click
- **Sneak peek at tomorrow's idea** — one italic teaser line, keeps the open
  loop going
- **PS line** — a fun, low-stakes aside (irrelevant to the pitch, just
  personality)
- Occasional workshop/event plugs and a "founder fit quiz" CTA

This is a content-marketing machine as much as a product: every email is
itself a mini masterclass (Founder Playbook + Steal This) wrapped around the
idea pitch, which is why it has staying power as a subscription people
actually open.

**2. The hub — the paid build system, behind login.**
Once you're in (Starter/Pro/Empire), the product shifts from "browse ideas"
to "run a company":

- **Idea Database** — 1,000+ pre-researched ideas (per IdeaBrowser's own
  claim), each representing "50+ hours of research condensed into a 10-minute
  read." Filterable by required investment, technical skills needed, time
  commitment.
- **Claim** — each idea can be claimed once; claiming appears to signal intent
  / reduce duplicate builders, though the report itself presumably stays
  visible to others (claim ≠ exclusivity in the report content, just a
  builder-intent marker).
- **Founder Fit** — every idea gets scored against *your* stored profile
  (technical skills, industry experience, time, budget, personal situation) —
  a personalized fit score shown right on the idea page, no extra setup.
- **Research Agent (v1 → v2 in "Launch Week")** — the pay-to-research-your-own-idea
  product. Drop in any idea, get a full report in ~30 minutes via a "40-step"
  automated research process crawling Reddit, YouTube, Facebook groups, and
  keyword data. v2 added keyword customization (feed it your own seed
  keywords) and recalibrated budget/timeline estimates toward solo,
  AI-augmented builders (2-4 week MVPs instead of 3-6 month builds).
  Rate-limited: 3 reports/mo (Pro), 9/mo (Empire).
- **Custom Market Insights / Niche Generator** — lighter-weight than the full
  Research Agent: type any market ("golf training") and get pain points,
  solution gaps, underserved segments, and communities without a full report;
  or hit "Surprise Me" / pick a category / match-to-profile for instant niche
  ideas.
- **AI Chat Strategist** — a Q&A chat scoped to a specific idea, for
  pressure-testing plans, funnels, and copy.
- **Idea Builder** — the "start building it for you" surface you asked about.
  Not actual hosted execution — it's shovel-ready prompt generation: pick an
  idea (or write a custom ask), it assembles a prompt pre-loaded with that
  idea's market research, audience, features, and competitive context, sized
  to paste directly into Cursor, Bolt, Lovable, Claude, or ChatGPT. The value
  is context-transfer, not a build environment of their own.
- **Hub / Workspaces / Skills Library** — the layer that ties it together.
  Each project workspace attaches one or more ideas as "context"; a library of
  15+ "Skills" (proven playbooks for offers, landing pages, emails, funnels)
  read that context and generate output that chains off prior outputs. This
  is the part that turns IdeaBrowser from a research tool into a lightweight
  agency-in-a-box.

## Pricing (as marketed; verify before quoting to anyone)

| Tier | Price | Includes |
|---|---|---|
| Free | $0 | Idea of the Day only, 24h before gating |
| Starter | ~$499/yr | Full 1,000+ idea database, trend reports, 20 AI-generated ideas/mo |
| Pro | ~$1,499/yr | Starter + Research Agent (3 reports/mo) + Hub/Skills |
| Empire | ~$2,999/yr | Pro + Research Agent (9 reports/mo) + weekly coaching, AMAs, builder community |

## What's praised vs. criticized (third-party reviews)

- **Praised**: genuinely useful as a daily discovery habit; turns scattered
  Reddit/search signal into a readable, structured pitch; the Founder
  Playbook + Steal This content is valued independent of the idea pitches.
- **Criticized**: claims in reports aren't linked to sources, so numbers
  aren't independently verifiable; skepticism that ideas are truly
  differentiated/validated rather than plausible-sounding; at least one
  reviewer flagged cheaper single-report validation alternatives; better
  received as a brainstorming/discovery tool than as rigorous validation.

## What Idea Lab (this repo) already covers vs. what's still open

| IdeaBrowser feature | Idea Lab equivalent | Status |
|---|---|---|
| Idea of the Day report format | `schema/idea.schema.json` + report renderer | Done — scores, why-now, proof & signals, market gap, execution plan, value ladder, frameworks |
| Idea Database (browsable, filterable) | `docs/index.html` grid | Done, basic — no filters yet |
| Sourced claims | `sources[]` on every report, estimates marked `(est.)` | Done — and stricter than IdeaBrowser (their #1 criticism) |
| Research Agent (research any idea) | `/idea-research` skill | Done |
| Founder Fit | — | Not built. Would need a stored "your profile" (skills, time, budget) and a scoring pass per idea |
| Idea Builder (shovel-ready prompts) | — | Building now: `/idea-build` skill + build-kit pages |
| AI Chat Strategist | — | Not built; lowest priority — you already have this conversation |
| Hub / Skills Library / multi-idea workspace context chaining | — | Partially implicit (repo *is* the workspace); no chained "skills" yet beyond research + build |
| Trend Watch / Niche Generator (browse by market, not just by idea) | — | Not built |

## Recommendation

The highest-leverage next build is the **Idea Builder clone** — it's the one
feature IdeaBrowser gates behind the top tiers that has an obvious,
free-to-you version: a skill that reads a researched `idea.json` and produces
a shovel-ready build prompt plus a lightweight PRD, ready to paste into
Claude Code, Cursor, Lovable, or Bolt. That's what's built next in this
session. Founder Fit and a Trends/Niche browser are natural follow-ups if you
want to keep going.
