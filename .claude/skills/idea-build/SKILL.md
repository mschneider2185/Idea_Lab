---
name: idea-build
description: Turn a researched idea into a shovel-ready build kit (PRD, tech stack, starter backlog, paste-ready AI build prompt) — the Idea Lab equivalent of IdeaBrowser's "Idea Builder". Use when the user says "/idea-build <slug>", "let's build <idea>", "give me a build prompt for <idea>", or wants to hand an idea to Claude Code/Cursor/Lovable/Bolt to start building.
---

# Idea Build

Generate a `buildKit` for an idea already in `ideas/<slug>/idea.json` (per
`schema/idea.schema.json`) and write it back into that same file. This is
what lets the user go from "researched" straight into a real build session —
in this repo, in a fresh one, or pasted into another AI builder entirely.

## Input

The argument is a slug or an idea title. Resolve it to `ideas/<slug>/idea.json`.
If no argument was given, list ideas with `status: "researched"` (or later)
from the `ideas/` directory and ask which one.

If the idea's `status` is `"seed"`, stop and say so — run `/idea-research`
first. A build kit built on an unresearched idea is just guessing.

## Process

1. **Read the full report.** The build kit must be *derived from* the
   report's `summary`, `executionPlan`, `marketGap`, and `valueLadder` — not
   invented fresh. If the report is thin in a section you need, say so rather
   than filling gaps with generic SaaS boilerplate.

2. **Write the PRD** (`buildKit.prd`):
   - `problem` / `targetUser` — sharpen from `summary.problem` and the report's
     tags/audience, don't just copy verbatim.
   - `coreFeatures` — the smallest feature set that delivers the `summary.wedge`,
     grounded in `executionPlan.mvp`. Order matters; first item ships first.
   - `nonGoals` — be explicit about what v1 skips. This is what keeps scope
     sane; don't leave it empty.
   - `successMetrics` — 2-4 concrete, checkable signals (not vanity metrics)
     that tell the founder the MVP worked.

3. **Pick a tech stack** (`buildKit.techStack`): the simplest stack that fits
   the actual product (web app vs. mobile vs. internal tool vs. Chrome
   extension). Default toward boring and fast to ship (e.g. Next.js +
   Supabase/Postgres + Stripe for a SaaS with billing) unless the idea has a
   real reason to need something else. State the rationale in one or two
   sentences — why this stack, not a tour of alternatives.

4. **Write the starter backlog** (`buildKit.backlog`): 8-15 items, each with a
   `priority` of P0 (nothing ships without this), P1 (needed to actually sell
   it), or P2 (fast follow). Order P0s first. Titles should be concrete build
   tasks, not epics ("Build the intake form with breed/behavior/home-layout
   fields" not "Build onboarding").

5. **Write the build prompt** (`buildKit.buildPrompt`): a single self-contained
   string, ready to paste into Claude Code, Cursor, Lovable, Bolt, or
   ChatGPT/Claude directly, that includes:
   - One paragraph of product context (problem, solution, wedge — pulled from
     the report, not generic)
   - Target user
   - The recommended tech stack and why
   - The P0 feature list from the backlog, as a numbered build order
   - Explicit non-goals ("Do NOT build X yet")
   - A closing instruction telling the AI builder what to do first (e.g.
     "Start by scaffolding the project and building the intake form; stop and
     show me before wiring up payments.")

   Write it as plain text the user can literally copy-paste elsewhere — no
   markdown headers that would look odd pasted into a chat box, just clear
   paragraph and list structure.

6. **Write back.** Add/replace the `buildKit` object in
   `ideas/<slug>/idea.json` with `generatedAt` set to today. Do not change
   `status` unless the user says they're starting the build now — if so, set
   `status: "building"`.

7. **Build + verify.** Run `npm run build`, fix any validation errors, and
   confirm the rendered build-kit section on the idea page looks right
   (headings, backlog table, prompt block).

8. **Commit** with message `Add build kit: <title>` and push to the current
   branch.

## After generating

Tell the user the build prompt is ready to paste into whichever tool they
want to use (Claude Code in this repo, a fresh Claude Code session, Cursor,
Lovable, Bolt...), and ask which they'd like to do — don't start writing
application code yourself unless they say to.
