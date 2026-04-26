#!/usr/bin/env node
import { readFileSync, existsSync, statSync } from "node:fs";
import { resolve, dirname, isAbsolute, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import yaml from "js-yaml";
import { ManifestSchema } from "./schema.mjs";

const __filename = fileURLToPath(import.meta.url);
const SCRIPTS_DIR = dirname(__filename);
const REPO_ROOT = resolve(SCRIPTS_DIR, "..", "..");

export function loadManifest(manifestPath) {
  const raw = readFileSync(manifestPath, "utf8");
  const parsed = yaml.load(raw);
  return ManifestSchema.parse(parsed);
}

export function lintManifest({
  manifestPath = resolve(REPO_ROOT, "screenshots.yaml"),
  repoRoot = REPO_ROOT,
} = {}) {
  const errors = [];
  const warnings = [];

  if (!existsSync(manifestPath)) {
    return {
      ok: false,
      errors: [`manifest not found at ${manifestPath}`],
      warnings: [],
    };
  }

  let manifest;
  try {
    manifest = loadManifest(manifestPath);
  } catch (e) {
    return {
      ok: false,
      errors: [`schema validation failed:\n${e.message ?? String(e)}`],
      warnings: [],
    };
  }

  const seenIds = new Set();
  for (const entry of manifest.entries) {
    if (seenIds.has(entry.id)) {
      errors.push(`duplicate id: ${entry.id}`);
    }
    seenIds.add(entry.id);

    const imagePath = isAbsolute(entry.image)
      ? entry.image
      : resolve(repoRoot, entry.image);
    if (!existsSync(imagePath)) {
      warnings.push(`[${entry.id}] image not yet captured: ${entry.image}`);
    } else if (!statSync(imagePath).isFile()) {
      errors.push(`[${entry.id}] image path is not a file: ${entry.image}`);
    }

    const pagePath = isAbsolute(entry.diataxis.page)
      ? entry.diataxis.page
      : resolve(repoRoot, entry.diataxis.page);
    if (!existsSync(pagePath)) {
      warnings.push(
        `[${entry.id}] diataxis.page does not exist yet: ${entry.diataxis.page}`,
      );
    }

    const imageBasename = entry.image.split("/").pop();
    const referencedInMdx = isImageReferenced({
      repoRoot,
      imagePath: entry.image,
      imageBasename,
    });
    if (!referencedInMdx && existsSync(pagePath)) {
      warnings.push(
        `[${entry.id}] image not referenced by any MDX file (run authoring pass to embed)`,
      );
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    entryCount: manifest.entries.length,
  };
}

function isImageReferenced({ repoRoot, imagePath, imageBasename }) {
  try {
    execSync(
      `grep -r --include='*.mdx' --include='*.md' -l ${JSON.stringify(imageBasename)} ${JSON.stringify(resolve(repoRoot, "src/content"))} ${JSON.stringify(resolve(repoRoot, "astro.config.mjs"))}`,
      { stdio: ["ignore", "pipe", "ignore"] },
    );
    return true;
  } catch {
    return false;
  }
}

if (process.argv[1] === __filename) {
  const result = lintManifest();
  if (result.warnings.length) {
    for (const w of result.warnings) console.warn(`warn: ${w}`);
  }
  if (!result.ok) {
    for (const e of result.errors) console.error(`error: ${e}`);
    console.error(`\nlint failed (${result.errors.length} error(s))`);
    process.exit(1);
  }
  console.log(
    `manifest ok: ${result.entryCount} entries, ${result.warnings.length} warning(s)`,
  );
}
