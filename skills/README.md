# Skills — the portable method

This folder is a **vendor-neutral copy** of the three skills that power this
repo. Each `SKILL.md` is a plain-language procedure: read it, follow it. There
is no Claude-specific API, binary, or proprietary format anywhere in here —
just Markdown instructions plus a JSON schema (`../schema/idea.schema.json`)
and a zero-dependency Node build script (`../scripts/build.mjs`).

The point of this copy is that the *method* survives independent of any one
agent. If you switch tools, you copy this folder (plus the schema and build
script) into the new tool's convention and keep going. The idea library
itself (`../ideas/*/idea.json`) and the generated site (`../docs/`) don't care
what wrote them.

## The three-skill loop

| Skill | What it does |
|---|---|
| [`idea-research`](idea-research/SKILL.md) | Web-researches an idea into a sourced `ideas/<slug>/idea.json` report — scores, why-now, competitors, execution plan, value ladder, framework fits. Honesty rules baked in (every stat cited, estimates marked `(est.)`). |
| [`idea-build`](idea-build/SKILL.md) | Turns a researched report into a greenfield build kit: PRD, tech stack, backlog, and a paste-ready build prompt derived from that idea's own research. |
| [`idea-fit`](idea-fit/SKILL.md) | Diffs a **real project** (its `/project-audit` output + live repo evidence) against a researched idea into a **BUILD ON / REFOCUS / PIVOT / PARK** verdict, plus a brownfield build kit scoped to the gap. The capability neither research nor build has alone: evidence-based rescoring from actual code. |

They compose into a cycle: research an idea → build it → later, fit-check what
you actually built against the research → regenerate the build kit against the
gap → repeat.

## ⚠️ This is a generated mirror — do not edit here

The canonical copies live in `../.claude/skills/<name>/SKILL.md` (that path is
where the Claude Code harness discovers them, which is what makes the
`/idea-research`, `/idea-build`, and `/idea-fit` slash commands work). **Edit
the canonical copies.** `npm run build` re-mirrors them into this folder on
every run, so any edit made directly here will be overwritten.

## Using these with a different agent

1. Copy this `skills/` folder, `../schema/idea.schema.json`, and
   `../scripts/build.mjs` into your project.
2. Register each `SKILL.md` in your agent's own skill/instruction system
   (e.g. a Cursor rule, a Copilot instructions file, an Assistant tool config,
   or just paste the file when you want to run it).
3. Give the agent the four capabilities the method assumes: read the repo
   (files + `git log`), search the web and cite it, reason over research +
   code to make the call, and write JSON + run `npm run build`.

The *format* is fully portable. The *sharpness of the judgment* — the part
that catches a go-to-market problem invisible to market research, or
re-verifies a stale audit against newer commits — depends on the reasoning of
whatever model is driving. A weaker model running the identical `SKILL.md`
produces a structurally valid but shallower report.
