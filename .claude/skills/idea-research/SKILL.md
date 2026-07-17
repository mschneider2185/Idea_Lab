---
name: idea-research
description: Run an IdeaBrowser-style deep research report on a startup/product idea and add it to the idea library. Use when the user gives an idea to research ("/idea-research <idea>", "research this idea", "add this to the idea library"), or wants an existing ideas/*/idea.json report refreshed or upgraded from seed to researched.
---

# Idea Research

Produce a structured, sourced research report for a product idea and add it to
this repo's idea library, following `schema/idea.schema.json`. The output is a
new (or updated) `ideas/<slug>/idea.json`, rendered into the browsable site by
`npm run build`.

## Input

The argument is an idea in one line (e.g. "an app that plans post-op recovery
for reactive dogs"). If no argument was given, ask for the idea. If the user
says "seed" or gives several ideas at once, create seed entries only (slug,
title, oneLiner, tags, summary, `status: "seed"`) and skip research.

## Process

1. **Slug + scaffold.** Derive a short kebab-case slug. Create
   `ideas/<slug>/idea.json`. If the slug already exists, you are refreshing it:
   keep the existing `status` unless upgrading a seed, and update
   `researchedAt`.

2. **Research (web).** Run real web searches across these angles — do not
   fill sections from imagination:
   - **Demand:** what people search for around this pain; related keyword
     phrases. Volumes/growth are usually unavailable without a keyword tool —
     include the terms and mark any numbers `(est.)`.
   - **Market stats:** market size, growth (CAGR), spend data, procedure/usage
     counts. Every stat needs a source in `sources`.
   - **Competitors:** direct products, adjacent incumbents, and the
     "non-consumption" alternative (PDFs, spreadsheets, doing nothing). For
     each: positioning + the gap they leave open.
   - **Communities:** subreddits, Facebook groups, Discords, forums where the
     pain is discussed; size and what activity there proves.
   - **Why now:** technology shifts, behavior shifts, cost curves, regulation
     that make this newly possible or newly urgent.

3. **Analysis.** Fill the report sections:
   - `scores` — opportunity, problemSeverity, feasibility, whyNow (0-10, each
     with a one-line justification). Be honest; a 6 with a real reason beats
     an 8 with vibes.
   - `businessFit` — revenuePotential ($ to $$$ + note), executionDifficulty,
     goToMarket, founderFit (who is positioned to win — relate to the user's
     actual situation when known).
   - `summary` — problem / solution / wedge (the narrow entry point).
   - `whyNow` — narrative + discrete drivers.
   - `marketGap` — what the market gets wrong; competitor table with
     weaknesses.
   - `executionPlan` — MVP steps, exactly where the first customers come
     from, pricing model with tiers, 90-day milestones.
   - `valueLadder` — lead magnet → frontend → core → backend, with prices and
     the job of each rung.
   - `frameworks` — valueEquation (dream outcome, likelihood, time delay,
     effort, verdict), marketMatrix (Category King / Niche Down / Shark Tank /
     Low Impact + why), acp (audience, community, product).
   - `risks` — top 3-5 with mitigations.

4. **Honesty rules.**
   - Every market stat gets an entry in `sources` with a URL.
   - Mark all estimated numbers `(est.)`. Never present an estimate as data.
   - If a section can't be supported by research, say so in that section
     rather than inventing content.

5. **Build + verify.** Run `npm run build`. It validates every idea file
   against the schema and regenerates `docs/`. Fix any validation errors.
   Spot-check the rendered page (`docs/idea/<slug>.html`).

6. **Commit** with message `Add research report: <title>` (or
   `Refresh research: <title>`), and push to the current branch.

## Style

Write like the IdeaBrowser reports this format is modeled on: concrete,
specific, no filler. Short punchy sentences. Name real numbers, real
communities, real competitors. The reader should finish knowing exactly what
to build first and who to sell it to.
