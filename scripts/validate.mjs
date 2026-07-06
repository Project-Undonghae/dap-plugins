// Validate plugin_catalog.json: valid JSON, required fields, unique ids, repo shape.
// Run: node scripts/validate.mjs   (CI runs this on every PR touching the catalog)
import { readFileSync } from "node:fs";

const path = new URL("../plugin_catalog.json", import.meta.url);
let raw;
try {
  raw = JSON.parse(readFileSync(path, "utf8"));
} catch (e) {
  console.error("plugin_catalog.json is not valid JSON:", e.message);
  process.exit(1);
}

const plugins = raw?.plugins;
if (!Array.isArray(plugins)) {
  console.error('top level must be { "plugins": [ ... ] }');
  process.exit(1);
}

const REPO_RE = /^[\w.-]+\/[\w.-]+$/;
const CATEGORIES = new Set(["productivity", "utility", "developer"]);
const ids = new Set();
let ok = true;
const fail = (m) => {
  console.error("✗ " + m);
  ok = false;
};

for (const p of plugins) {
  const where = p?.id ? `'${p.id}'` : JSON.stringify(p);
  if (!p || typeof p.id !== "string" || !p.id) fail(`entry missing string id: ${where}`);
  if (typeof p.repo !== "string" || !p.repo) fail(`${where}: missing repo`);
  else if (!REPO_RE.test(p.repo) && !p.repo.includes("github.com")) fail(`${where}: repo must be "owner/name" or a github URL (got "${p.repo}")`);
  if (p.name != null && typeof p.name !== "string") fail(`${where}: name must be a string`);
  if (p.ref != null && typeof p.ref !== "string") fail(`${where}: ref must be a string`);
  if (p.category != null && !CATEGORIES.has(p.category)) {
    fail(`${where}: category must be one of ${[...CATEGORIES].join(", ")} (got "${p.category}")`);
  }
  if (typeof p.id === "string") {
    if (ids.has(p.id)) fail(`duplicate id: ${p.id}`);
    ids.add(p.id);
  }
}

console.log(ok ? `✓ OK — ${plugins.length} plugin(s)` : "catalog validation FAILED");
process.exit(ok ? 0 : 1);
