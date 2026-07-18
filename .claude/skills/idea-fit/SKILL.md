---
name: idea-fit
description: Diff a real project against its researched idea — market-grounded verdict on actual code. Use when the user says "/idea-fit <project-path> [idea-slug]", "how close is my app to the idea", "is this project still worth building", or wants an audit combined with idea research into a BUILD ON / REFOCUS / PIVOT / PARK call.
---

# Idea Fit

Marry a **project audit** (what's actually built, evidenced from the repo)
with an **idea research report** (what the market says is worth building,
per `schema/idea.schema.json`) and produce a verdict neither can produce
alone: a market-grounded ruling on real code. This is the reverse of
IdeaBrowser's "Import business → Analyze My Business" — but grounded in the
codebase, not the marketing surface.

Output: a `fitReport` section written into `ideas/<slug>/idea.json` (rendered
on the library site), a regenerated **brownfield** `buildKit` scoped to the
gap, and a one-page verdict dropped into the project's own `audits/` folder.

## Input

`/idea-fit <project-path> [idea-slug]`. The project path is required. If the
idea slug is omitted, look for a library idea whose report obviously matches
the project; if none exists, you will create one (step 2).

## Process

1. **Gather the reality side.**
   - Find the freshest audit in `<project>/audits/` (or `docs/audit*`). If
     none exists, say so and offer to run `/project-audit` first — do not
     wing a fit report without evidence.
   - **Never trust the audit alone.** Check `git log` and CHANGELOG since
     the audit date — active projects move. Anything the audit calls
     missing/broken that has since shipped must be re-verified against the
     current tree and credited. Cite commits/files for every status you
     assign.

2. **Gather the market side.** Resolve `ideas/<slug>/idea.json`. If the
   project has no library entry, run the `/idea-research` process in
   reverse: state the idea the project *implies* (one line, confirm it in
   your summary), then do the real web-research pass — demand, market stats
   with sources, competitors with weaknesses, communities, why-now. Set
   `status: "building"` (it's a live project) and fill the standard report
   sections. Honesty rules from `/idea-research` apply unchanged: sourced
   stats, `(est.)` marks, no invented numbers.

3. **Diff — the fit analysis.** Fill `fitReport` (see schema):
   - `wedgeCheck` — does what's built serve the researched wedge and target
     user? Name any drift (e.g. private tool → pitchable product) and
     whether it's documented or accidental.
   - `completion[]` — one row per researched core capability / competitor
     must-have: `shipped | partial | missing`, each with repo evidence
     (file, commit, or audit citation). Credit post-audit work explicitly.
   - `scopeRulings[]` — turn the audit's scope-creep observations into
     rulings: keep, cut, or defer, with a reason tied to the research.
   - `monetization` — which value-ladder rungs exist in code (billing,
     pricing page, lead magnet, export/lock-in posture). "None" is a
     finding, not a failure — say what the research implies about whether
     that's fine.
   - `scoreAdjustments[]` — re-score feasibility / whyNow / opportunity
     where the audit gives *evidence* vibes-based research couldn't have
     (passing test count, working deploy, real usage). State was → now and
     why.
   - `verdict` — **BUILD ON / REFOCUS / PIVOT / PARK** + `confidence`
     (High/Medium/Low) + `verdictNote` explaining the call and the single
     most important condition attached to it. (BUILD ON = keep going as
     aimed; REFOCUS = right product, wrong aim/scope — name the new aim;
     PIVOT = the research says point the asset somewhere else; PARK =
     stop investing, preserve.)

4. **Regenerate the build kit brownfield.** Run the `/idea-build` process
   against the *delta*, not from scratch:
   - PRD `problem`/`targetUser` from the research; `coreFeatures` = the gap
     items only (missing/partial rows from `completion`), ordered by what
     the research says matters most; `nonGoals` = the audit's do-not-do
     list plus anything the research rules out; `successMetrics` = concrete
     and instrumentable (projects that scored 0 on metrics get them here).
   - `techStack.suggested` = the project's **actual current stack** unless
     the research gives a hard reason to change — never propose a rewrite
     from a fit report.
   - `buildPrompt` = a brownfield prompt: states what exists (one
     paragraph, from the audit), what to build next (the gap, ordered),
     what NOT to touch, and ends with a `--- BUSINESS CONTEXT ---` block: a
     compact digest of the report (scores + justifications, why-now
     drivers, market-gap narrative, competitor weaknesses, value ladder,
     key sourced stats, `(est.)` marks preserved) so any AI builder
     receives the full research, not a summary sentence. Keep the digest
     under ~1,500 words.

5. **Write outputs.**
   - `ideas/<slug>/idea.json` — report + `fitReport` + brownfield
     `buildKit`. Run `npm run build`; fix validation errors; spot-check the
     rendered page.
   - `<project>/audits/<name>-idea-fit-<date>.md` — a one-page verdict for
     the project side: verdict + conditions, completion snapshot, top gap
     items, pointer to the library page. Respect the project's own privacy
     conventions (if `audits/` is gitignored there, leave it untracked; do
     not commit or push the target project without being asked).
   - Update the README library table if a new idea was added.

6. **Privacy rules (hard).** The library repo may be pushed publicly. Never
   copy real personal/financial figures, credentials, customer data, or
   private URLs from the target project into `idea.json`, the fit report,
   or commit messages. Reference them abstractly ("real household figures
   live in a gitignored seed file") and keep specifics in the project-side
   one-pager only if that location is private.

7. **Commit** the library repo with `Add idea fit: <title>` (or
   `Refresh idea fit: <title>`) and push the current branch.

## Style

The verdict is the product. Lead with it, attach the one condition that
matters, and let the tables carry the evidence. Credit what's genuinely
good — a fit report that only lists gaps reads as a hit piece and gets
ignored. Every claim about the project cites the audit, a commit, or a
file; every claim about the market cites a source.
