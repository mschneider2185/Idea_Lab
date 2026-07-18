#!/usr/bin/env node
// Idea Lab static site generator.
// Reads ideas/*/idea.json, validates against the report shape, and renders
// a browsable site into docs/ (GitHub Pages friendly). Zero dependencies.

import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const IDEAS_DIR = join(ROOT, "ideas");
const OUT_DIR = join(ROOT, "docs");

const SITE_NAME = "Idea Lab";
const SITE_TAGLINE = "Deep-researched product ideas, IdeaBrowser style — self-hosted.";

// ---------------------------------------------------------------------------
// Load + validate
// ---------------------------------------------------------------------------

const STATUSES = ["seed", "researched", "validating", "building", "shipped", "parked"];

function loadIdeas() {
  if (!existsSync(IDEAS_DIR)) return [];
  const ideas = [];
  for (const entry of readdirSync(IDEAS_DIR).sort()) {
    const dir = join(IDEAS_DIR, entry);
    if (!statSync(dir).isDirectory()) continue;
    const file = join(dir, "idea.json");
    if (!existsSync(file)) {
      fail(`${entry}: missing idea.json`);
      continue;
    }
    let idea;
    try {
      idea = JSON.parse(readFileSync(file, "utf8"));
    } catch (e) {
      fail(`${entry}/idea.json: invalid JSON — ${e.message}`);
      continue;
    }
    validate(idea, entry);
    ideas.push(idea);
  }
  return ideas;
}

let errors = 0;
function fail(msg) {
  errors++;
  console.error(`  ✗ ${msg}`);
}

function validate(idea, folder) {
  const where = `${folder}/idea.json`;
  for (const key of ["slug", "title", "oneLiner", "status", "researchedAt"]) {
    if (!idea[key]) fail(`${where}: missing required field "${key}"`);
  }
  if (idea.slug && idea.slug !== folder) {
    fail(`${where}: slug "${idea.slug}" does not match folder name "${folder}"`);
  }
  if (idea.slug && !/^[a-z0-9-]+$/.test(idea.slug)) {
    fail(`${where}: slug must be kebab-case (a-z, 0-9, -)`);
  }
  if (idea.status && !STATUSES.includes(idea.status)) {
    fail(`${where}: status "${idea.status}" not one of ${STATUSES.join(", ")}`);
  }
  const scoreGroups = [idea.scores, idea.businessFit].filter(Boolean);
  for (const group of scoreGroups) {
    for (const [k, v] of Object.entries(group)) {
      if (v && typeof v === "object" && "score" in v) {
        if (typeof v.score !== "number" || v.score < 0 || v.score > 10) {
          fail(`${where}: ${k}.score must be a number 0-10`);
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// HTML helpers
// ---------------------------------------------------------------------------

const esc = (s) =>
  String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

// Paragraph-ize plain text (double newline = new paragraph).
const paras = (s) =>
  String(s ?? "")
    .split(/\n{2,}/)
    .map((p) => `<p>${esc(p.trim())}</p>`)
    .join("\n");

const scoreClass = (n) => (n >= 8 ? "high" : n >= 6 ? "mid" : "low");

function scoreCard(label, s) {
  if (!s || typeof s.score !== "number") return "";
  return `<div class="score-card">
    <div class="score-num ${scoreClass(s.score)}">${s.score}<span>/10</span></div>
    <div class="score-label">${esc(label)}</div>
    ${s.note ? `<div class="score-note">${esc(s.note)}</div>` : ""}
  </div>`;
}

function section(title, inner, subtitle = "") {
  if (!inner || !inner.trim()) return "";
  return `<section class="report-section">
    <h2>${esc(title)}</h2>
    ${subtitle ? `<p class="section-sub">${esc(subtitle)}</p>` : ""}
    ${inner}
  </section>`;
}

function table(headers, rows) {
  if (!rows.length) return "";
  return `<div class="table-wrap"><table>
    <thead><tr>${headers.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>
    <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("\n")}</tbody>
  </table></div>`;
}

const list = (items, ordered = false) =>
  items?.length
    ? `<${ordered ? "ol" : "ul"}>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</${ordered ? "ol" : "ul"}>`
    : "";

const statusBadge = (status) => `<span class="badge badge-${esc(status)}">${esc(status)}</span>`;

function tagline(tags) {
  if (!tags) return "";
  const parts = [tags.type, tags.market, tags.target && `for ${tags.target}`, tags.trend]
    .filter(Boolean)
    .map((t) => `<span class="tag">${esc(t)}</span>`);
  return parts.length ? `<div class="tags">${parts.join("")}</div>` : "";
}

function pageShell({ title, body, depth = 0 }) {
  const base = "../".repeat(depth);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<link rel="stylesheet" href="${base}style.css">
</head>
<body>
<header class="site-header">
  <a class="logo" href="${base}index.html">💡 ${SITE_NAME}</a>
  <span class="tagline">${SITE_TAGLINE}</span>
</header>
<main>
${body}
</main>
<footer class="site-footer">
  <p>Generated by <code>npm run build</code> · Add ideas with the <code>/idea-research</code> skill · Format inspired by <a href="https://www.ideabrowser.com/">ideabrowser.com</a></p>
</footer>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Index page
// ---------------------------------------------------------------------------

function renderIndex(ideas) {
  const order = { researched: 0, validating: 1, building: 2, shipped: 3, seed: 4, parked: 5 };
  const sorted = [...ideas].sort(
    (a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9) || (b.researchedAt || "").localeCompare(a.researchedAt || "")
  );

  const cards = sorted
    .map((idea) => {
      const s = idea.scores || {};
      const chips = [
        ["Opportunity", s.opportunity],
        ["Problem", s.problemSeverity],
        ["Feasibility", s.feasibility],
        ["Why now", s.whyNow],
      ]
        .filter(([, v]) => v && typeof v.score === "number")
        .map(([l, v]) => `<span class="chip ${scoreClass(v.score)}" title="${esc(l)}: ${esc(v.note || "")}">${esc(l)} ${v.score}</span>`)
        .join("");
      return `<a class="card" href="idea/${esc(idea.slug)}.html">
        <div class="card-top">${statusBadge(idea.status)}<span class="date">${esc(idea.researchedAt)}</span></div>
        <h2>${esc(idea.title)}</h2>
        <p>${esc(idea.oneLiner)}</p>
        ${chips ? `<div class="chips">${chips}</div>` : ""}
        ${tagline(idea.tags)}
      </a>`;
    })
    .join("\n");

  const body = `<div class="hero">
    <h1>The idea library</h1>
    <p>${ideas.length} idea${ideas.length === 1 ? "" : "s"} · full research reports with scores, proof &amp; signals, market gaps, execution plans, and framework fits.</p>
  </div>
  <div class="grid">${cards}</div>`;

  return pageShell({ title: SITE_NAME, body });
}

// ---------------------------------------------------------------------------
// Idea report page
// ---------------------------------------------------------------------------

function renderIdea(idea) {
  const s = idea.scores || {};
  const bf = idea.businessFit || {};
  const parts = [];

  // Hero
  parts.push(`<div class="report-hero">
    <a class="back" href="../index.html">← All ideas</a>
    <div class="card-top">${statusBadge(idea.status)}<span class="date">researched ${esc(idea.researchedAt)}</span></div>
    <h1>${esc(idea.title)}${idea.name ? ` <span class="workname">“${esc(idea.name)}”</span>` : ""}</h1>
    <p class="one-liner">${esc(idea.oneLiner)}</p>
    ${tagline(idea.tags)}
  </div>`);

  // Scores
  const scoreCards = [
    scoreCard("Opportunity", s.opportunity),
    scoreCard("Problem severity", s.problemSeverity),
    scoreCard("Feasibility", s.feasibility),
    scoreCard("Why now", s.whyNow),
  ].join("");
  if (scoreCards.trim()) parts.push(`<div class="score-row">${scoreCards}</div>`);

  // Business fit
  {
    const cells = [];
    if (bf.revenuePotential)
      cells.push(`<div class="fit-card"><div class="fit-big">${esc(bf.revenuePotential.rating || "")}</div>
        <div class="score-label">Revenue potential</div><div class="score-note">${esc(bf.revenuePotential.note || "")}</div></div>`);
    if (bf.executionDifficulty) cells.push(scoreCard("Execution difficulty", bf.executionDifficulty).replace('class="score-card"', 'class="fit-card"'));
    if (bf.goToMarket) cells.push(scoreCard("Go-to-market", bf.goToMarket).replace('class="score-card"', 'class="fit-card"'));
    let inner = cells.length ? `<div class="fit-row">${cells.join("")}</div>` : "";
    if (bf.founderFit) inner += `<div class="callout"><strong>Founder fit:</strong> ${esc(bf.founderFit)}</div>`;
    parts.push(section("Business fit", inner));
  }

  // Summary
  if (idea.summary) {
    const sm = idea.summary;
    parts.push(
      section(
        "The idea",
        [
          sm.problem && `<h3>Problem</h3>${paras(sm.problem)}`,
          sm.solution && `<h3>Solution</h3>${paras(sm.solution)}`,
          sm.wedge && `<div class="callout"><strong>The wedge:</strong> ${esc(sm.wedge)}</div>`,
        ]
          .filter(Boolean)
          .join("\n")
      )
    );
  }

  // Why now
  if (idea.whyNow) {
    parts.push(
      section(
        "Why now",
        [idea.whyNow.narrative && paras(idea.whyNow.narrative), list(idea.whyNow.drivers)].filter(Boolean).join("\n")
      )
    );
  }

  // Proof & signals
  if (idea.proofSignals) {
    const ps = idea.proofSignals;
    const inner = [];
    if (ps.searchDemand?.length) {
      inner.push(`<h3>Search demand</h3>`);
      inner.push(
        table(
          ["Keyword", "Volume", "Growth", "Note"],
          ps.searchDemand.map((k) => [esc(k.term), esc(k.volume || "—"), esc(k.growth || "—"), esc(k.note || "")])
        )
      );
    }
    if (ps.communities?.length) {
      inner.push(`<h3>Community signals</h3>`);
      inner.push(
        table(
          ["Platform", "Community", "Size", "What it proves"],
          ps.communities.map((c) => [
            esc(c.platform),
            c.url ? `<a href="${esc(c.url)}">${esc(c.name)}</a>` : esc(c.name),
            esc(c.size || "—"),
            esc(c.signal || ""),
          ])
        )
      );
    }
    if (ps.marketStats?.length) {
      inner.push(`<h3>Market stats</h3>`);
      inner.push(
        `<ul class="stats">${ps.marketStats
          .map(
            (m) =>
              `<li>${esc(m.stat)}${m.source ? ` <span class="src">${m.url ? `<a href="${esc(m.url)}">${esc(m.source)}</a>` : esc(m.source)}</span>` : ""}</li>`
          )
          .join("")}</ul>`
      );
    }
    parts.push(section("Proof & signals", inner.join("\n")));
  }

  // Market gap
  if (idea.marketGap) {
    const mg = idea.marketGap;
    const inner = [
      mg.narrative && paras(mg.narrative),
      mg.competitors?.length &&
        table(
          ["Competitor", "Positioning", "The gap they leave"],
          mg.competitors.map((c) => [
            c.url ? `<a href="${esc(c.url)}">${esc(c.name)}</a>` : esc(c.name),
            esc(c.positioning || ""),
            esc(c.weakness || ""),
          ])
        ),
    ]
      .filter(Boolean)
      .join("\n");
    parts.push(section("Market gap", inner));
  }

  // Execution plan
  if (idea.executionPlan) {
    const ep = idea.executionPlan;
    const inner = [];
    if (ep.mvp?.length) inner.push(`<h3>MVP</h3>${list(ep.mvp, true)}`);
    if (ep.firstCustomers?.length) inner.push(`<h3>First customers</h3>${list(ep.firstCustomers)}`);
    if (ep.pricing) {
      inner.push(`<h3>Pricing</h3>`);
      if (ep.pricing.model) inner.push(paras(ep.pricing.model));
      if (ep.pricing.tiers?.length)
        inner.push(
          table(
            ["Tier", "Price", "Includes"],
            ep.pricing.tiers.map((t) => [esc(t.name || ""), esc(t.price || ""), esc(t.includes || "")])
          )
        );
    }
    if (ep.milestones90Days?.length) inner.push(`<h3>First 90 days</h3>${list(ep.milestones90Days, true)}`);
    parts.push(section("Execution plan", inner.join("\n")));
  }

  // Value ladder
  if (idea.valueLadder?.length) {
    const steps = idea.valueLadder
      .map(
        (v, i) => `<div class="ladder-step">
        <div class="ladder-rank">${i + 1}</div>
        <div>
          <div class="ladder-tier">${esc(v.tier)}${v.price ? ` · <span class="price">${esc(v.price)}</span>` : ""}</div>
          <div class="ladder-offer">${esc(v.offer)}</div>
          ${v.goal ? `<div class="score-note">${esc(v.goal)}</div>` : ""}
        </div>
      </div>`
      )
      .join("");
    parts.push(section("Value ladder", `<div class="ladder">${steps}</div>`));
  }

  // Frameworks
  if (idea.frameworks) {
    const f = idea.frameworks;
    const cards = [];
    if (f.valueEquation) {
      const ve = f.valueEquation;
      cards.push(`<div class="fw-card"><h3>Value equation</h3><dl>
        ${ve.dreamOutcome ? `<dt>Dream outcome</dt><dd>${esc(ve.dreamOutcome)}</dd>` : ""}
        ${ve.perceivedLikelihood ? `<dt>Perceived likelihood</dt><dd>${esc(ve.perceivedLikelihood)}</dd>` : ""}
        ${ve.timeDelay ? `<dt>Time delay</dt><dd>${esc(ve.timeDelay)}</dd>` : ""}
        ${ve.effortAndSacrifice ? `<dt>Effort &amp; sacrifice</dt><dd>${esc(ve.effortAndSacrifice)}</dd>` : ""}
        ${ve.verdict ? `<dt>Verdict</dt><dd><strong>${esc(ve.verdict)}</strong></dd>` : ""}
      </dl></div>`);
    }
    if (f.marketMatrix) {
      cards.push(`<div class="fw-card"><h3>Market matrix</h3>
        ${f.marketMatrix.quadrant ? `<div class="quadrant">${esc(f.marketMatrix.quadrant)}</div>` : ""}
        ${f.marketMatrix.explanation ? paras(f.marketMatrix.explanation) : ""}</div>`);
    }
    if (f.acp) {
      cards.push(`<div class="fw-card"><h3>A.C.P. fit</h3><dl>
        ${f.acp.audience ? `<dt>Audience</dt><dd>${esc(f.acp.audience)}</dd>` : ""}
        ${f.acp.community ? `<dt>Community</dt><dd>${esc(f.acp.community)}</dd>` : ""}
        ${f.acp.product ? `<dt>Product</dt><dd>${esc(f.acp.product)}</dd>` : ""}
      </dl></div>`);
    }
    if (cards.length) parts.push(section("Framework fit", `<div class="fw-grid">${cards.join("")}</div>`));
  }

  // Risks
  if (idea.risks?.length) {
    parts.push(
      section(
        "Risks",
        table(
          ["Risk", "Mitigation"],
          idea.risks.map((r) => [esc(r.risk), esc(r.mitigation || "")])
        )
      )
    );
  }

  // Fit report (reality diff from /idea-fit)
  if (idea.fitReport) {
    const fr = idea.fitReport;
    const inner = [];
    if (fr.verdict) {
      inner.push(`<div class="callout"><strong>Verdict: ${esc(fr.verdict)}</strong>${
        fr.confidence ? ` (confidence: ${esc(fr.confidence)})` : ""
      }${fr.verdictNote ? ` — ${esc(fr.verdictNote)}` : ""}</div>`);
    }
    if (fr.wedgeCheck) inner.push(`<h3>Wedge check</h3>${paras(fr.wedgeCheck)}`);
    if (fr.completion?.length) {
      inner.push(`<h3>Completion vs. the research</h3>`);
      const mark = { shipped: "✅ shipped", partial: "🟡 partial", missing: "❌ missing" };
      inner.push(
        table(
          ["Capability", "Status", "Evidence"],
          fr.completion.map((c) => [esc(c.aspect), mark[c.status] || esc(c.status), esc(c.evidence || "")])
        )
      );
    }
    if (fr.scopeRulings?.length) {
      inner.push(`<h3>Scope rulings</h3>`);
      inner.push(
        table(
          ["Observation", "Ruling"],
          fr.scopeRulings.map((r) => [esc(r.observation), esc(r.ruling)])
        )
      );
    }
    if (fr.monetization) inner.push(`<h3>Monetization reality</h3>${paras(fr.monetization)}`);
    if (fr.scoreAdjustments?.length) {
      inner.push(`<h3>Score adjustments (evidence-based)</h3>`);
      inner.push(
        table(
          ["Dimension", "Was", "Now", "Why"],
          fr.scoreAdjustments.map((a) => [
            esc(a.dimension),
            a.was ?? "—",
            a.now ?? "—",
            esc(a.reason || ""),
          ])
        )
      );
    }
    const sub = [fr.generatedAt && `Generated ${fr.generatedAt}`, fr.auditRef && `Grounded in ${fr.auditRef}`]
      .filter(Boolean)
      .join(" · ");
    parts.push(section("Fit report — research vs. reality", inner.join("\n"), sub));
  }

  // Build kit
  if (idea.buildKit) {
    const bk = idea.buildKit;
    const inner = [];
    if (bk.prd) {
      const p = bk.prd;
      inner.push(`<h3>PRD</h3>`);
      const dl = [
        p.problem && `<dt>Problem</dt><dd>${esc(p.problem)}</dd>`,
        p.targetUser && `<dt>Target user</dt><dd>${esc(p.targetUser)}</dd>`,
      ]
        .filter(Boolean)
        .join("");
      if (dl) inner.push(`<dl class="prd-dl">${dl}</dl>`);
      if (p.coreFeatures?.length) inner.push(`<h4>Core features (v1)</h4>${list(p.coreFeatures, true)}`);
      if (p.nonGoals?.length) inner.push(`<h4>Non-goals (v1)</h4>${list(p.nonGoals)}`);
      if (p.successMetrics?.length) inner.push(`<h4>Success metrics</h4>${list(p.successMetrics)}`);
    }
    if (bk.techStack) {
      inner.push(`<h3>Tech stack</h3>`);
      if (bk.techStack.suggested) inner.push(`<div class="callout"><strong>${esc(bk.techStack.suggested)}</strong>${bk.techStack.rationale ? ` — ${esc(bk.techStack.rationale)}` : ""}</div>`);
    }
    if (bk.backlog?.length) {
      inner.push(`<h3>Starter backlog</h3>`);
      inner.push(
        table(
          ["", "Task", "Description"],
          bk.backlog.map((b) => [`<span class="pri pri-${esc(b.priority)}">${esc(b.priority)}</span>`, esc(b.title), esc(b.description || "")])
        )
      );
    }
    if (bk.buildPrompt) {
      inner.push(`<h3>Build prompt <span class="section-sub">paste into Claude Code, Cursor, Lovable, Bolt, or ChatGPT</span></h3>`);
      inner.push(`<div class="prompt-box">
        <button class="copy-btn" onclick="navigator.clipboard.writeText(document.getElementById('build-prompt').textContent).then(()=>{this.textContent='Copied!';setTimeout(()=>this.textContent='Copy prompt',1500)})">Copy prompt</button>
        <pre id="build-prompt">${esc(bk.buildPrompt)}</pre>
      </div>`);
    }
    parts.push(section("Build kit", inner.join("\n"), bk.generatedAt ? `Generated ${bk.generatedAt}` : ""));
  }

  // Sources
  if (idea.sources?.length) {
    parts.push(
      section(
        "Sources",
        `<ol class="sources">${idea.sources
          .map((src) => `<li>${src.url ? `<a href="${esc(src.url)}">${esc(src.title)}</a>` : esc(src.title)}</li>`)
          .join("")}</ol>`
      )
    );
  }

  return pageShell({ title: `${idea.title} — ${SITE_NAME}`, body: parts.join("\n"), depth: 1 });
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

console.log("Idea Lab build");
const ideas = loadIdeas();
if (errors) {
  console.error(`\n${errors} validation error(s). Fix them and re-run.`);
  process.exit(1);
}

mkdirSync(join(OUT_DIR, "idea"), { recursive: true });
writeFileSync(join(OUT_DIR, ".nojekyll"), "");
writeFileSync(join(OUT_DIR, "style.css"), CSS());
writeFileSync(join(OUT_DIR, "index.html"), renderIndex(ideas));
for (const idea of ideas) {
  writeFileSync(join(OUT_DIR, "idea", `${idea.slug}.html`), renderIdea(idea));
  console.log(`  ✓ idea/${idea.slug}.html`);
}
console.log(`  ✓ index.html (${ideas.length} idea${ideas.length === 1 ? "" : "s"})`);
console.log(`Done → docs/`);

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

function CSS() {
  return `:root {
  --accent: #4c44ff;
  --accent-soft: #eef2ff;
  --bg: #ffffff;
  --bg-soft: #f9fafb;
  --text: #111827;
  --text-soft: #4b5563;
  --text-faint: #6b7280;
  --border: #e5e7eb;
  --high: #059669;
  --mid: #d97706;
  --low: #dc2626;
}
@media (prefers-color-scheme: dark) {
  :root {
    --accent: #8b85ff;
    --accent-soft: #1e1b4b;
    --bg: #0f1117;
    --bg-soft: #171a23;
    --text: #f3f4f6;
    --text-soft: #b8bfcc;
    --text-faint: #8a93a3;
    --border: #2a2f3c;
    --high: #34d399;
    --mid: #fbbf24;
    --low: #f87171;
  }
}
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
}
main { max-width: 880px; margin: 0 auto; padding: 24px 20px 64px; }
a { color: var(--accent); text-decoration: none; font-weight: 600; }
a:hover { text-decoration: underline; }

.site-header {
  display: flex; align-items: baseline; gap: 16px; flex-wrap: wrap;
  padding: 20px 24px; border-bottom: 1px solid var(--border);
}
.logo { font-size: 20px; font-weight: 800; color: var(--text); }
.logo:hover { text-decoration: none; color: var(--accent); }
.site-header .tagline { color: var(--text-faint); font-size: 14px; }
.site-footer { border-top: 1px solid var(--border); padding: 20px 24px; color: var(--text-faint); font-size: 13px; text-align: center; }

.hero { padding: 24px 0 8px; }
.hero h1 { margin: 0 0 4px; font-size: 32px; }
.hero p { color: var(--text-soft); margin: 0; }

.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; margin-top: 24px; }
.card {
  display: block; border: 1px solid var(--border); border-radius: 12px; padding: 18px;
  color: inherit; background: var(--bg-soft); transition: border-color .15s, transform .15s;
}
.card:hover { border-color: var(--accent); text-decoration: none; transform: translateY(-2px); }
.card h2 { margin: 10px 0 6px; font-size: 18px; line-height: 1.35; }
.card p { margin: 0; color: var(--text-soft); font-size: 14px; }
.card-top { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
.date { color: var(--text-faint); font-size: 12px; }

.badge {
  display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px;
  padding: 2px 8px; border-radius: 999px; border: 1px solid var(--border); color: var(--text-faint);
}
.badge-researched { background: var(--accent-soft); color: var(--accent); border-color: transparent; }
.badge-seed { background: var(--bg-soft); }
.badge-building, .badge-validating { background: #fef3c7; color: #92400e; border-color: transparent; }
.badge-shipped { background: #d1fae5; color: #065f46; border-color: transparent; }

.chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
.chip { font-size: 11.5px; font-weight: 700; padding: 2px 8px; border-radius: 6px; background: var(--bg); border: 1px solid var(--border); }
.chip.high { color: var(--high); }
.chip.mid { color: var(--mid); }
.chip.low { color: var(--low); }

.tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
.tag { font-size: 12px; color: var(--text-faint); background: var(--bg); border: 1px solid var(--border); border-radius: 6px; padding: 2px 8px; }

.report-hero { padding: 24px 0 4px; }
.report-hero .back { font-size: 14px; display: inline-block; margin-bottom: 16px; }
.report-hero h1 { margin: 10px 0 8px; font-size: 34px; line-height: 1.2; }
.workname { color: var(--text-faint); font-weight: 500; font-size: 22px; }
.one-liner { font-size: 18px; color: var(--text-soft); margin: 0; }

.score-row, .fit-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin: 24px 0 8px; }
.score-card, .fit-card { border: 1px solid var(--border); border-radius: 12px; padding: 14px; background: var(--bg-soft); }
.score-num { font-size: 28px; font-weight: 800; }
.score-num span { font-size: 14px; color: var(--text-faint); font-weight: 600; }
.score-num.high { color: var(--high); }
.score-num.mid { color: var(--mid); }
.score-num.low { color: var(--low); }
.fit-big { font-size: 26px; font-weight: 800; color: var(--accent); letter-spacing: 2px; }
.score-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; color: var(--text-faint); margin-top: 2px; }
.score-note { font-size: 13px; color: var(--text-soft); margin-top: 6px; }

.report-section { margin-top: 36px; }
.report-section h2 {
  font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;
  color: var(--accent); border-bottom: 1px solid var(--border); padding-bottom: 8px; margin: 0 0 14px;
}
.report-section h3 { font-size: 16px; margin: 18px 0 8px; }
.report-section p { color: var(--text-soft); margin: 0 0 12px; }
.section-sub { color: var(--text-faint); font-size: 14px; }
.report-section li { color: var(--text-soft); margin-bottom: 6px; }

.callout {
  background: var(--accent-soft); border-left: 4px solid var(--accent); border-radius: 8px;
  padding: 12px 16px; margin: 14px 0; color: var(--text-soft); font-size: 15px;
}

.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 14px; margin: 8px 0 16px; }
th { text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: .5px; color: var(--text-faint); border-bottom: 2px solid var(--border); padding: 8px 10px; }
td { border-bottom: 1px solid var(--border); padding: 9px 10px; vertical-align: top; color: var(--text-soft); }

.stats { padding-left: 20px; }
.stats .src { font-size: 12px; color: var(--text-faint); }
.stats .src a { font-weight: 500; }

.ladder { display: flex; flex-direction: column; gap: 10px; }
.ladder-step { display: flex; gap: 14px; border: 1px solid var(--border); border-radius: 12px; padding: 14px; background: var(--bg-soft); }
.ladder-rank {
  flex: 0 0 32px; height: 32px; border-radius: 50%; background: var(--accent-soft); color: var(--accent);
  display: flex; align-items: center; justify-content: center; font-weight: 800;
}
.ladder-tier { font-weight: 700; }
.ladder-tier .price { color: var(--accent); }
.ladder-offer { color: var(--text-soft); font-size: 14.5px; margin-top: 2px; }

.fw-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; }
.fw-card { border: 1px solid var(--border); border-radius: 12px; padding: 16px; background: var(--bg-soft); }
.fw-card h3 { margin: 0 0 10px; font-size: 15px; }
.fw-card dl { margin: 0; }
.fw-card dt { font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; color: var(--text-faint); margin-top: 10px; }
.fw-card dd { margin: 2px 0 0; font-size: 14px; color: var(--text-soft); }
.quadrant { font-size: 20px; font-weight: 800; color: var(--accent); margin-bottom: 8px; }

.sources { font-size: 14px; }
.sources li { margin-bottom: 4px; }

.report-section h4 { font-size: 14px; margin: 16px 0 6px; color: var(--text); }
.prd-dl dt { font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; color: var(--text-faint); margin-top: 10px; }
.prd-dl dd { margin: 2px 0 0; color: var(--text-soft); }
.pri { display: inline-block; font-size: 11px; font-weight: 800; padding: 2px 7px; border-radius: 6px; }
.pri-P0 { background: #fee2e2; color: #991b1b; }
.pri-P1 { background: #fef3c7; color: #92400e; }
.pri-P2 { background: var(--bg); color: var(--text-faint); border: 1px solid var(--border); }
@media (prefers-color-scheme: dark) {
  .pri-P0 { background: #451a1a; color: #fca5a5; }
  .pri-P1 { background: #452a06; color: #fcd34d; }
}
.prompt-box { position: relative; margin-top: 8px; }
.prompt-box pre {
  background: var(--bg-soft); border: 1px solid var(--border); border-radius: 10px; padding: 18px;
  font-size: 13px; line-height: 1.6; white-space: pre-wrap; word-wrap: break-word; color: var(--text);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}
.copy-btn {
  position: absolute; top: 10px; right: 10px; font-size: 12px; font-weight: 700;
  background: var(--accent); color: #fff; border: none; border-radius: 6px; padding: 6px 10px; cursor: pointer;
}
.copy-btn:hover { opacity: 0.9; }
`;
}
