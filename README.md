# 💡 Idea Lab

A personal, self-hosted version of [ideabrowser.com](https://www.ideabrowser.com/):
deep-researched product ideas as structured, sourced reports you can browse like a
mini research site — except the research engine is Claude, the library is yours,
and it costs nothing to run.

## What's inside

```
ideas/<slug>/idea.json          One research report per idea (structured JSON)
schema/idea.schema.json         The report format — scores, why-now, proof & signals,
                                market gap, execution plan, value ladder, frameworks,
                                and an optional build kit
scripts/build.mjs               Zero-dependency static site generator
docs/                           The generated, browsable site (GitHub Pages ready)
.claude/skills/idea-research/   The /idea-research skill that writes new reports
.claude/skills/idea-build/      The /idea-build skill that turns a report into a build kit
research/ideabrowser-teardown.md  Notes on the real ideabrowser.com — features, pricing,
                                the Hub, what's cloned here and what's still open
```

Each **researched** idea gets the full IdeaBrowser-style treatment:

- **Scores** — Opportunity, Problem Severity, Feasibility, Why Now (0-10, each justified)
- **Business fit** — revenue potential, execution difficulty, go-to-market, founder fit
- **Why now** — the timing drivers that make this newly possible or newly urgent
- **Proof & signals** — search demand, community signals, sourced market stats
- **Market gap** — what everyone gets wrong + a competitor table with the gaps they leave
- **Execution plan** — MVP steps, first customers, pricing tiers, first 90 days
- **Value ladder** — lead magnet → frontend → core → backend
- **Framework fit** — Value Equation, Market Matrix, A.C.P.
- **Risks & sources** — every stat traces to a link; estimates are marked `(est.)`

Ideas can also be captured as lightweight **seeds** (title + one-liner + summary)
and upgraded to full reports later.

A researched idea can go one step further with a **build kit** — a PRD,
suggested tech stack, priority-ordered starter backlog, and a paste-ready
build prompt for Claude Code, Cursor, Lovable, or Bolt, with a one-click copy
button on the report page. This is the self-hosted answer to IdeaBrowser's
paid "Idea Builder" feature (see `research/ideabrowser-teardown.md` for how
the real one works).

## Browse the library

```bash
npm run build        # validates ideas/ and regenerates docs/
open docs/index.html # or just open the file in a browser
```

To host it: merge to the default branch, then GitHub → Settings → Pages →
"Deploy from a branch" → branch `master`, folder `/docs`.

## Add a new idea

In a Claude Code session on this repo:

```
/idea-research an app that plans post-op recovery for reactive dogs
```

Claude runs real web research (demand, market stats, competitors, communities,
why-now), fills the schema, validates with `npm run build`, and commits the
report. Say "seed" to just capture an idea without the research pass.

Once an idea is researched, turn it into a build kit:

```
/idea-build reactive-dog-post-op-recovery-planner
```

Claude derives a PRD, tech stack, starter backlog, and a paste-ready build
prompt from that idea's own research — never from generic boilerplate — and
adds a "Build kit" section to its report page.

## Current library

| Idea | Status |
|---|---|
| [Reactive Dog Post-Op Recovery Planner](ideas/reactive-dog-post-op-recovery-planner/idea.json) ("Pawscript") | researched |
| [Self-Hosted Household Finance Command Center](ideas/household-finance-command-center/idea.json) ("FEV") | building — with a [fit report](ideas/household-finance-command-center/idea.json) diffing the real repo against the research |
| [VR Safety Drill Builder for High-Risk Crews](ideas/vr-safety-drill-builder/idea.json) | seed |
| [Backyard Home (ADU) Feasibility Reports](ideas/backyard-adu-feasibility-reports/idea.json) | seed |

---

*Report format inspired by Greg Isenberg's [IdeaBrowser](https://www.ideabrowser.com/).
This is a personal research tool, not affiliated with ideabrowser.com.*
