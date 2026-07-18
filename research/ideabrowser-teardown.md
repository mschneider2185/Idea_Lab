# IdeaBrowser Teardown

Research notes on ideabrowser.com (Greg Isenberg / Startup Ideas Podcast team),
compiled to inform what Idea Lab (this repo) clones, skips, and does
differently. The original pass (2026-07-17) was built without live site access
— from Idea of the Day emails, marketing pages surfaced via search, and
third-party reviews — and flagged its numbers as unverified. A follow-up
session on **2026-07-18** verified everything below against the live site
using a logged-in (free-tier) account: see the **"Verified via live account"**
section at the bottom for what was confirmed, corrected, and newly
discovered. Pricing and feature facts in this doc have been updated to the
verified values.

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
  builder-intent marker). *(2026-07-18: no claim mechanic found on the live
  site — apparently retired in favor of Interested/Saved/Building states.)*
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

## Pricing (verified against /pricing on 2026-07-18)

| Tier | Price | Includes |
|---|---|---|
| Free | $0 | Idea of the Day (24h window), teaser views of trends/market insights, free-tier MCP connector access (browse ideas + Business Coach) |
| Starter | $499/yr | Full idea database, trends + market insights, Idea Generator 20/mo, basic founder-fit, Idea Builder prompts |
| Pro | $1,499/yr | Starter + Research Agent 3/mo, Chat Strategist 100/mo, Idea Generator 100/mo, Hub workspaces, Skills/Agent Library, Context System, MCP Connectors (full), JSON data exports, advanced founder fit |
| Empire | $2,999/yr | Pro with higher limits (Research Agent 9/mo, Chat 300/mo, Generator 500/mo) + weekly coaching (Jordan Mix), monthly Greg Isenberg AMAs, Vibe Coding course + office hours, workshop library, builder community, IRL events, $50K+ tool deals |

Billing is annual-only ("early access"); monthly appears only via promo/invite
links. 14-day full refund. Prorated upgrades (Starter→Pro = the $1,000
difference). Periodic 7-day trials. New free members currently get a
"welcome offer" (Pro at $999 for the first year).

## What's praised vs. criticized (third-party reviews)

- **Praised**: genuinely useful as a daily discovery habit; turns scattered
  Reddit/search signal into a readable, structured pitch; the Founder
  Playbook + Steal This content is valued independent of the idea pitches.
- **Criticized**: claims in reports aren't linked to sources, so numbers
  aren't independently verifiable; skepticism that ideas are truly
  differentiated/validated rather than plausible-sounding; at least one
  reviewer flagged cheaper single-report validation alternatives; better
  received as a brainstorming/discovery tool than as rigorous validation.
  *(2026-07-18 update: the "no sources" criticism is now partially outdated —
  report sub-pages carry numbered "Citations & Sources" lists. But citation
  quality is thin: the same couple of generic blog URLs get cited for most
  claims in a section, and the two keyword-volume figures for the same term
  disagreed within one report. The "plausible-sounding" criticism still has
  teeth — see the verified section.)*

## What Idea Lab (this repo) already covers vs. what's still open

| IdeaBrowser feature | Idea Lab equivalent | Status |
|---|---|---|
| Idea of the Day report format | `schema/idea.schema.json` + report renderer | Done — scores, why-now, proof & signals, market gap, execution plan, value ladder, frameworks |
| Idea Database (browsable, filterable) | `docs/index.html` grid | Done, basic — no filters yet |
| Sourced claims | `sources[]` on every report, estimates marked `(est.)` | Done — and stricter than IdeaBrowser (their #1 criticism) |
| Research Agent (research any idea) | `/idea-research` skill | Done |
| Founder Fit | — | Not built. Would need a stored "your profile" (skills, time, budget) and a scoring pass per idea |
| Idea Builder (shovel-ready prompts) | `/idea-build` skill + build-kit pages | Done — and structurally different from the real one in ways that favor ours (see verified section) |
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

---

# Verified via live account (2026-07-18)

Everything in this section was observed directly on the live site with a
logged-in **free-tier** account (browser session, no scraping). Where the
free tier gated a feature, the paywall/upsell itself is documented instead.
Two Idea Builder prompts were captured verbatim into
`research/artifacts/` (see below). No billing details, API keys, or account
identifiers are reproduced here.

## Confirmed (the original notes were right)

- **Pricing is exactly $499 / $1,499 / $2,999 per year** — the "~" estimates
  were spot-on. Annual-only billing, 14-day refund, prorated upgrades.
- **The 24h Idea of the Day gating is real and strict.** The
  reactive-dog idea (free on 2026-07-17) was already hard-gated by the 18th —
  even logged in, the page shows only a title card and an "Unlock the Full
  Idea Report" upsell. A free account cannot re-open yesterday's idea.
- **Research Agent**: 40-step process, ~30 min, 3/mo (Pro) and 9/mo (Empire),
  keyword customization before the run, solo-builder-calibrated budgets — all
  as described. Fully paywalled on free (marketing page only). New detail:
  reports end in a **BUILD / PIVOT / PASS verdict with confidence scoring**.
- **Idea Builder is context-transfer prompt generation**, exactly as the
  teardown inferred — not a hosted build environment.
- **Hub structure**: Browse/Build split. Build side = Projects (workspaces),
  Agents, Context, Connectors. A project starts from an idea, from scratch,
  or by importing an existing website, then: add context → connect AI → run
  agents.
- **Skills Library**: 18 agents visible in the UI library (marketing claims
  "15+" and elsewhere "40+"), in six categories — Foundation (Brand DNA),
  Analysis (Founder Archetype, Analyze My Business, Roast This Idea, Check
  Founder Fit, Business Coach), Strategy (Offer Coach, ACP Framework, Funnel
  Architect, Master Money Model, Leveraged Agency Strategist), Build (Landing
  Page Architect, Sales Page Surgeon, Email Wizard, VSL Script Writer, YOLO
  Mode), Marketing (Lead Magnet Legend), Research (Competitive Analysis).
  Most are Pro-badged; Roast This Idea and Check Founder Fit are
  Starter-badged; custom agents ("New Agent") are supported.
- **Founder Fit is profile-based**, per the teardown — and deeper than
  guessed (see "New since the original notes").

## Corrected

- **Database size: 1,816 ideas** (live counter on /database). Marketing
  copy inconsistently says "800+" (FAQ) and "1,000+" (pricing page) — both
  understatements, presumably stale.
- **Database filters** are NOT "investment / technical skills / time
  commitment" (that's what their own FAQ claims). The actual filter panel:
  - *Idea Scores*: High Market Opportunity (9+), Significant Pain Point (9+),
    Perfect Timing (9+)
  - *Build Difficulty*: Any / Manageable / Moderate / Challenging
  - *Idea Type* (14): Community, Content, Ecommerce, Hardware, Info product,
    Lead gen, Marketplace, Mobile app, Newsletter, Platform, Plugin,
    Productized service, Saas, Service
  - *Market*: B2B, B2B2C, B2C, D2C
  - *Highlight Tags* (10): 10x better, Clear distribution, High margins
    proven, Massive market, Organic growth, Perfect timing, Product ready,
    Proven founder fit, Recession proof, Unfair advantage
  - *Founder Fit*: Domain expertise required, Sales driven, Solo founder
    friendly, Technical founder needed
  - *Access*: Greg's Pick, Pro Ideas Only
  Plus pipeline tabs on the database itself: All / New / For You (beta) /
  Interested / Saved / Building / Not Interested, and an "AI Suggest" search.
- **No "Claim" feature found anywhere.** The Idea Actions menu on an idea is:
  Get Instant Answers (AI chat), Founder Fit, Download Data (export). The
  claim-an-idea mechanic from early coverage appears retired, replaced by the
  softer Interested/Saved/Building states. The claim row in the feature table
  above should be treated as historical.
- **Market Matrix quadrant names** (relevant to our schema): the live matrix
  is **Tech Novelty** (high uniqueness / low value), **Category King** (high /
  high), **Low Impact** (low / low), **Commodity Play** (low / high). Our
  schema's description ("Category King, Niche Down, Shark Tank, Low Impact")
  came from Greg's older public framework and doesn't match the product.
- **Value ladder has five rungs, not four**: Lead Magnet (Bait) → Frontend →
  Core Offer → **Continuity Program** → Backend, each with offer, price,
  "value provided", and goal. Ours drops Continuity. (Framework explicitly
  credited to Russell Brunson's DotCom Secrets on the page.)
- **The "claims aren't sourced" criticism is partially outdated** — see the
  updated note in the reviews section above. Sub-pages have numbered
  citations, but they're shallow (generic blog/SEO URLs, heavily reused
  within a section) and internal consistency is imperfect: today's report
  cited "MCP server" at 246.0K volume in the keyword block and 60,500 in the
  Why Now narrative. There are also raw template artifacts in the data (a
  literal `loan_approval_time: -` success metric on a non-lending idea).
  Idea Lab's stricter sources-with-URLs-per-stat policy remains a real
  differentiator.

## The live report format (from the free Jul 18 idea, section by section)

The Idea of the Day report is the same format as database reports. Top-level
page: title + highlight tags, 4-paragraph narrative (problem → solution →
execution → pricing/GTM), keyword trend card (volume, growth %, chart),
four scores with labels (Opportunity "Exceptional" 9, Problem "High Pain" 8,
Feasibility "Manageable" 8, Why Now "Perfect Timing" 9), Business Fit
(Revenue Potential $–$$$ + ARR note, Execution Difficulty n/10, Go-To-Market
n/10, "Right for You?" teaser), value-ladder preview, per-section summaries
with drill-in links, Framework Fit (Value Equation scored /10, Market
Matrix, A.C.P. scored per letter, Value Ladder), Categorization (Type /
Market / Target / Main Competitor / Trend Analysis — our `tags` equivalent),
Community Signals counts (Reddit/Facebook/YouTube/Other), Top Keywords
(Fastest Growing / Highest Volume / Most Relevant with real volume +
competition), and a feedback widget ("Chef's kiss / Pretty interesting / You
didn't bring the heat").

Each major section is a **sub-page with an Overall Rating /10, scored
sub-dimensions, and citations**:

- *Why Now*: Market Timing Factors, Technological Enablers, Regulatory &
  Social Catalysts, Risk Reduction Factors, Competitive Window, Supporting
  Data Points, Timing Risks, "Why Wait = Why Fail" — each scored /10.
- *Proof & Signals*: Emotional Frustration Signals, Time-Sensitive Needs,
  Systemic Barriers, Community Demand & Engagement — each scored /10 with
  cited bullets. (Keyword data and community data live in their own
  sections, not here.)
- *Market Gap*: Underserved Customer Segments, Feature Gaps, Integration
  Opportunities, Geographic Opportunities — scored /10. **No competitor
  table anywhere** — the only competitor named is `Main Competitor` in
  Categorization. Our per-competitor weakness table is richer than the real
  product.
- *Execution Plan*: Part 1 Business Classification (personas, pain points),
  Part 2 Phase-1 roadmap 0-6mo (MVP approach, initial offer, lead magnet
  with expected conversion %, acquisition channels with cadence + metrics),
  Part 3 Phase-2 roadmap 6-18mo (traction milestone, expansion), Part 4
  implementation (steps, success metrics like CAC/churn/pilot-conversion,
  team/budget/timeline, risk table, next actions). Risks live *inside* the
  execution plan, not top-level like ours.
- *Value Ladder* and *Value Equation*: as described above; Value Equation
  scores each component /10 and adds "Improvement Suggestions".

**Schema verdict for Idea Lab**: our scores, businessFit, tags,
summary/whyNow/marketGap/executionPlan/valueLadder sections map 1:1 onto the
real thing. What we don't model: per-section 0-10 ratings with scored
sub-dimensions, the Continuity rung, per-letter ACP scores, real keyword
volume/CPC/competition data, community-signal counts, and per-claim numbered
citations. What we model better: competitor tables with weaknesses, a
top-level risk register, and one-source-per-stat discipline.

## The reactive-dog idea: what the live version actually says

The full report is gated (expired window), but the live **database card
summary** is public and differs from our reconstruction in one big way:

- **Live title**: "After surgery rehab app that adjusts for difficult dog
  behavior" (our email-derived title "Reactive Dog Post-Op Recovery Planner"
  survives only in the URL slug).
- **Confirmed matches**: product name **Pawscript**; the exact problem
  framing (generic discharge sheets assuming calm dogs, open floor plans,
  owners who can lift 90 lbs); the intake fields (breed, behavior profile
  incl. crate-refusal and separation anxiety, living space, other pets,
  stairs, caretaker's physical limits); the plan components (confinement
  sized to the space, enrichment for high-drive breeds, harness recs,
  escalation scripts for late-night panics). Our reconstruction of the
  *product* was essentially verbatim-accurate.
- **The GTM is inverted.** The live idea is **clinic-first B2B**: the *vet
  tech* fills the intake before discharge; MVP ships to 3 pilot surgical
  clinics; pricing is **$199–$499/practice/month tiered by procedure
  volume**; integrate with Cornerstone/ezyVet PMS; grow via veterinary
  surgery conferences, Ruffwear / Walkin' Pets partnerships, and referral
  networks; track 30-day callback-rate reduction per clinic. The
  **direct-to-caretaker app is the expansion**, at $29, syncing with the
  discharge summary — plus a second revenue layer selling compliance data to
  pet insurers. Our version runs the opposite way (owner-first $39 plan +
  $19/mo companion, clinic license later at $299/mo). That was a deliberate
  strategy choice built on the email's owner-side framing, but it should be
  read as *our* thesis, not IdeaBrowser's — the report's `sources` entry
  pointing at the IdeaBrowser URL now under-discloses how much we diverged.
  Worth adding a note to `ideas/reactive-dog-post-op-recovery-planner/idea.json`
  if we ever refresh it.

## The real Idea Builder, mechanically

Captured on the free tier (it's Starter-badged but a free account can run it
on the free daily idea):

- Entry point: "Build with Google AI Studio" button on any idea → modal with
  two paths: **Idea Builder** (Starter) and **AI Workspace** (Pro; injects
  research into Claude/Cursor via MCP and runs agents in a workspace).
- Idea Builder = **20 asset templates + Custom Prompt**, at
  `/hub/ideas/<slug>/build/<template>`: Popular (Ad Creatives, Brand
  Package, Landing Page), Marketing (Content Calendar, Email Funnel System,
  Email Sequence, Lead Magnet, Sales Funnel, SEO Content, Tweet-Sized
  Landing Page, User Personas), Product (Feature Specs, MVP Roadmap, Product
  Requirements Doc), Business (GTM Launch Calendar, GTM Strategy, KPI
  Dashboard, Pricing Strategy), Research (Competitive Analysis, Customer
  Interview Guide).
- "Copy Prompt & See All Tools" generates the prompt and offers paste
  targets: Google AI Studio (sponsored placement), Claude, Codex, Cursor,
  Replit, v0, Bolt, Lovable, and others. There's also an "Update with AI"
  refinement control and a public Build Gallery of apps made from ideas.
- **Prompt anatomy** (two captured verbatim in `research/artifacts/`):
  a generic per-asset template full of `[placeholders]` (~4.4K chars for
  Landing Page, ~9.8K for PRD), followed by a `## BUSINESS CONTEXT` block
  (~16K chars) that is **byte-identical across templates for the same idea**
  — the idea's narrative plus raw internal research data (scored objects
  with `analyzedAt` timestamps, YAML-ish lists, template artifacts). The
  value really is pure context-transfer: template + research dump, no
  per-idea prompt curation.

### What this means for our `/idea-build` skill (proposed edit, not yet applied)

Our `buildPrompt` is *more* curated than the real thing (self-contained
narrative, build order, non-goals, stop point) — keep that. But the real
product gets one thing right that we skip: **every asset prompt carries the
full research context**, so the downstream AI never works from a one-paragraph
summary. Proposed changes to `.claude/skills/idea-build/SKILL.md`:

1. In step 5 (build prompt), add: *"After the closing instruction, append a
   `--- BUSINESS CONTEXT ---` block: a compact structured digest of the
   report — scores with justifications, why-now drivers, market-gap
   narrative, competitor weaknesses, value ladder, and key sourced stats —
   so the receiving AI builder has the full research, not just the summary
   paragraph. Derive it from idea.json; keep it under ~1,500 words; mark
   estimates `(est.)` as in the report."*
2. Optionally add a step 5b: a second paste-ready **landing-page prompt**
   (their most-promoted template) derived from `valueLadder` +
   `summary.wedge`, stored as `buildKit.landingPagePrompt`. Low effort, high
   use: it's the first asset most builders actually need.
3. Non-goal: do NOT copy their raw-data-dump approach (unformatted YAML with
   internal timestamps) — our curated context block is strictly better for
   paste-into-a-chat use.

## Founder Fit, verified

- **Profile** (`/hub/profile`, free): Stage, Goal, Primary Skill, Time
  commitment, Budget, Interests (multi-select), bio — plus a profile
  completeness meter that feeds analysis quality.
- **Founder Archetype**: a 10-scenario quiz produces a shareable
  trading-card-style archetype (numbered "Founder Series" card) with five
  dimensions (Builder style, Risk profile, Energy pattern, Leverage type,
  Revenue temperament), a primary + secondary archetype (one of 9),
  builds/avoids lists, "wings" (behavior under stress vs. thriving), an
  optimizes-for axis, and a best-partner archetype. It also generates a
  personalized action playbook. This is far richer than the original note's
  "stored profile + fit score" guess.
- **On an idea** (free tier): a generic "Quick Assessment" (Best For / Less
  Ideal For bullets + assessment note) is free; the personalized score is
  gated ("Upgrade to unlock Founder Fit") with promised strength/gap
  analysis, skill-alignment breakdown, next steps, and risk assessment.
  Deeper analysis is pushed toward "connect your AI tools" (MCP).

## New since the original notes

- **MCP Connectors** (`/hub/build/connectors`): API-key based; targets
  Claude Desktop, Claude Code, Cursor, Codex, ChatGPT, Gemini CLI,
  Hyperagent, any MCP client. Capability tiers: FREE = browse/filter the
  idea database + AI Business Coach; STARTER = trends & market insights +
  personalized recommendations; PRO = custom research pipelines + agent
  library + workspaces. Notable: even a **free** account gets a real MCP
  surface into the 1,816-idea database.
- **Google AI Studio partnership**: sponsored "Build with Google AI Studio"
  placement on every idea + a Build Gallery.
- **Roast This Idea**: a free-tier-visible button on idea pages (multi-
  perspective critique: customer, competitor, investor, mentor).
- **Trends Library** (`/hub/trends/library`): browsable on free — trend
  cards with search volume, growth %, HOT/BREAKOUT tags, 15 pages deep.
  Trend *research* (run your own) is a separate Pro surface.
- **Idea Generator**: gated behind Starter (marketing page on free), 20/100/
  500 per month by tier, generates ideas against your founder profile with
  fit score, target market, business model, revenue timeline; output can be
  sent to the Research Agent.
- **"For You" personalized database tab** (beta) and AI Suggest search.
- The interior aggressively cross-sells one thing everywhere: connect your
  AI (MCP) so IdeaBrowser becomes context infrastructure rather than a
  website. That's their strategic direction — and exactly the thesis this
  repo already implements locally with skills + idea.json as context.

## Free-tier gating map (what a $0 account actually sees)

| Surface | Free tier reality |
|---|---|
| Idea of the Day (current) | Full report incl. all sub-pages, keywords, community signals |
| Any other idea | Title card + upsell (even yesterday's) |
| Idea database | Full browse/search/filter of all 1,816 summaries; reports gated |
| Trends library | Full card list; per-trend detail not tested |
| Market insights | Teaser views |
| Idea Builder | Works on the free daily idea (all 20 templates) |
| Research Agent | Marketing/paywall page only |
| Idea Generator | Marketing/paywall page only |
| Founder Fit | Profile + archetype quiz free; per-idea score gated (generic quick assessment free) |
| Hub workspaces | Project creation flow visible; agents Pro-gated |
| MCP connector | Free tier: database browse + Business Coach |

## Verbatim artifacts captured

- `research/artifacts/idea-builder-landing-page-prompt.md` — full 20,462-char
  Landing Page prompt (template + BUSINESS CONTEXT) for the Jul 18 idea.
- `research/artifacts/idea-builder-prd-prompt-scaffold.md` — the 9,763-char
  PRD template scaffold (context block identical to the above, noted, not
  duplicated).
