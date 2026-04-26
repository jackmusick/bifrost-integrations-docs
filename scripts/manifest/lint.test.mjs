import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import yaml from "js-yaml";
import { lintManifest } from "./lint.mjs";

function makeRepo() {
  const root = mkdtempSync(join(tmpdir(), "manifest-lint-"));
  mkdirSync(join(root, "src/assets/forms"), { recursive: true });
  mkdirSync(join(root, "src/content/docs/how-to-guides/forms"), {
    recursive: true,
  });
  writeFileSync(join(root, "astro.config.mjs"), "// stub\n");
  return root;
}

function writeManifest(root, manifest) {
  writeFileSync(join(root, "screenshots.yaml"), yaml.dump(manifest));
  return join(root, "screenshots.yaml");
}

describe("lintManifest", () => {
  let root;
  beforeEach(() => {
    root = makeRepo();
  });
  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("passes on a minimal valid manifest", async () => {
    writeFileSync(join(root, "src/assets/forms/builder.png"), "fake png");
    writeFileSync(
      join(root, "src/content/docs/how-to-guides/forms/build.mdx"),
      "# build\n\n![builder](../../../assets/forms/builder.png)\n",
    );
    writeFileSync(
      join(root, "screenshots.yaml"),
      yaml.dump({
        version: 1,
        entries: [
          {
            id: "forms-builder",
            image: "src/assets/forms/builder.png",
            route: "/forms/new",
            diataxis: {
              page: "src/content/docs/how-to-guides/forms/build.mdx",
              type: "how-to",
            },
          },
        ],
      }),
    );

    const result = lintManifest({
      manifestPath: join(root, "screenshots.yaml"),
      repoRoot: root,
    });
    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);
    expect(result.entryCount).toBe(1);
  });

  it("fails on duplicate ids", async () => {
    writeFileSync(join(root, "src/assets/forms/builder.png"), "fake");
    writeFileSync(
      join(root, "src/content/docs/how-to-guides/forms/build.mdx"),
      "![](../../../assets/forms/builder.png)\n",
    );
    writeFileSync(
      join(root, "screenshots.yaml"),
      yaml.dump({
        version: 1,
        entries: [
          {
            id: "dup",
            image: "src/assets/forms/builder.png",
            route: "/x",
            diataxis: {
              page: "src/content/docs/how-to-guides/forms/build.mdx",
              type: "how-to",
            },
          },
          {
            id: "dup",
            image: "src/assets/forms/builder.png",
            route: "/y",
            diataxis: {
              page: "src/content/docs/how-to-guides/forms/build.mdx",
              type: "how-to",
            },
          },
        ],
      }),
    );

    const result = lintManifest({
      manifestPath: join(root, "screenshots.yaml"),
      repoRoot: root,
    });
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("duplicate id"))).toBe(true);
  });

  it("warns when image is missing from disk (not yet captured)", async () => {
    writeFileSync(
      join(root, "src/content/docs/how-to-guides/forms/build.mdx"),
      "![](../../../assets/forms/builder.png)\n",
    );
    writeFileSync(
      join(root, "screenshots.yaml"),
      yaml.dump({
        version: 1,
        entries: [
          {
            id: "missing",
            image: "src/assets/forms/builder.png",
            route: "/forms/new",
            diataxis: {
              page: "src/content/docs/how-to-guides/forms/build.mdx",
              type: "how-to",
            },
          },
        ],
      }),
    );

    const result = lintManifest({
      manifestPath: join(root, "screenshots.yaml"),
      repoRoot: root,
    });
    expect(result.ok).toBe(true);
    expect(
      result.warnings.some((w) => w.includes("not yet captured")),
    ).toBe(true);
  });

  it("warns when image exists but is not referenced from any MDX", async () => {
    writeFileSync(join(root, "src/assets/forms/builder.png"), "fake");
    writeFileSync(
      join(root, "src/content/docs/how-to-guides/forms/build.mdx"),
      "# no image refs here\n",
    );
    writeFileSync(
      join(root, "screenshots.yaml"),
      yaml.dump({
        version: 1,
        entries: [
          {
            id: "orphan",
            image: "src/assets/forms/builder.png",
            route: "/forms/new",
            diataxis: {
              page: "src/content/docs/how-to-guides/forms/build.mdx",
              type: "how-to",
            },
          },
        ],
      }),
    );

    const result = lintManifest({
      manifestPath: join(root, "screenshots.yaml"),
      repoRoot: root,
    });
    expect(result.ok).toBe(true);
    expect(
      result.warnings.some((w) =>
        w.includes("not referenced by any MDX file"),
      ),
    ).toBe(true);
  });

  it("rejects invalid schema (bad route, bad id)", async () => {
    writeFileSync(
      join(root, "screenshots.yaml"),
      yaml.dump({
        version: 1,
        entries: [
          {
            id: "Bad ID With Spaces",
            image: "x.png",
            route: "no-leading-slash",
            diataxis: { page: "p.mdx", type: "how-to" },
          },
        ],
      }),
    );

    const result = lintManifest({
      manifestPath: join(root, "screenshots.yaml"),
      repoRoot: root,
    });
    expect(result.ok).toBe(false);
    expect(
      result.errors.some((e) => e.includes("schema validation failed")),
    ).toBe(true);
  });

  it("accepts entries with a valid actions list", async () => {
    writeFileSync(join(root, "src/assets/forms/builder.png"), "fake");
    writeFileSync(
      join(root, "src/content/docs/how-to-guides/forms/build.mdx"),
      "![](../../../assets/forms/builder.png)\n",
    );
    writeFileSync(
      join(root, "screenshots.yaml"),
      yaml.dump({
        version: 1,
        entries: [
          {
            id: "with-actions",
            image: "src/assets/forms/builder.png",
            route: "/forms/new",
            capture: {
              actions: [
                { click: 'button[title="Cancel"]' },
                { wait_for: '[role="dialog"]' },
                {
                  fill: { selector: "#field-name", value: "subject" },
                },
                { wait_ms: 200 },
              ],
            },
            diataxis: {
              page: "src/content/docs/how-to-guides/forms/build.mdx",
              type: "how-to",
            },
          },
        ],
      }),
    );

    const result = lintManifest({
      manifestPath: join(root, "screenshots.yaml"),
      repoRoot: root,
    });
    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("rejects an action with an unknown shape", async () => {
    writeFileSync(join(root, "src/assets/forms/builder.png"), "fake");
    writeFileSync(
      join(root, "src/content/docs/how-to-guides/forms/build.mdx"),
      "![](../../../assets/forms/builder.png)\n",
    );
    writeFileSync(
      join(root, "screenshots.yaml"),
      yaml.dump({
        version: 1,
        entries: [
          {
            id: "bad-action",
            image: "src/assets/forms/builder.png",
            route: "/forms/new",
            capture: {
              // `hover` is not a supported action — should fail schema.
              actions: [{ hover: "button.foo" }],
            },
            diataxis: {
              page: "src/content/docs/how-to-guides/forms/build.mdx",
              type: "how-to",
            },
          },
        ],
      }),
    );

    const result = lintManifest({
      manifestPath: join(root, "screenshots.yaml"),
      repoRoot: root,
    });
    expect(result.ok).toBe(false);
    expect(
      result.errors.some((e) => e.includes("schema validation failed")),
    ).toBe(true);
  });

  it("accepts a wait_for_hidden action (used to verify dialog dismissal)", async () => {
    writeFileSync(join(root, "src/assets/forms/builder.png"), "fake");
    writeFileSync(
      join(root, "src/content/docs/how-to-guides/forms/build.mdx"),
      "![](../../../assets/forms/builder.png)\n",
    );
    writeFileSync(
      join(root, "screenshots.yaml"),
      yaml.dump({
        version: 1,
        entries: [
          {
            id: "with-wait-hidden",
            image: "src/assets/forms/builder.png",
            route: "/forms/new",
            capture: {
              actions: [
                { click: 'button[aria-label="Close"]' },
                { wait_for_hidden: '[role="dialog"]' },
              ],
            },
            diataxis: {
              page: "src/content/docs/how-to-guides/forms/build.mdx",
              type: "how-to",
            },
          },
        ],
      }),
    );

    const result = lintManifest({
      manifestPath: join(root, "screenshots.yaml"),
      repoRoot: root,
    });
    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("accepts a scroll_into_view action (used to bring offscreen targets into view)", async () => {
    writeFileSync(join(root, "src/assets/forms/builder.png"), "fake");
    writeFileSync(
      join(root, "src/content/docs/how-to-guides/forms/build.mdx"),
      "![](../../../assets/forms/builder.png)\n",
    );
    writeFileSync(
      join(root, "screenshots.yaml"),
      yaml.dump({
        version: 1,
        entries: [
          {
            id: "with-scroll-into-view",
            image: "src/assets/forms/builder.png",
            route: "/forms/new",
            capture: {
              actions: [
                { wait_for: 'text="HTML Content"' },
                { scroll_into_view: 'text="HTML Content"' },
                { wait_ms: 200 },
              ],
            },
            diataxis: {
              page: "src/content/docs/how-to-guides/forms/build.mdx",
              type: "how-to",
            },
          },
        ],
      }),
    );

    const result = lintManifest({
      manifestPath: join(root, "screenshots.yaml"),
      repoRoot: root,
    });
    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("accepts a press_key action (used to trigger keyboard shortcuts)", async () => {
    writeFileSync(join(root, "src/assets/forms/builder.png"), "fake");
    writeFileSync(
      join(root, "src/content/docs/how-to-guides/forms/build.mdx"),
      "![](../../../assets/forms/builder.png)\n",
    );
    writeFileSync(
      join(root, "screenshots.yaml"),
      yaml.dump({
        version: 1,
        entries: [
          {
            id: "with-press-key",
            image: "src/assets/forms/builder.png",
            route: "/forms/new",
            capture: {
              actions: [
                { press_key: "Meta+k" },
                { wait_for: '[role="dialog"]' },
              ],
            },
            diataxis: {
              page: "src/content/docs/how-to-guides/forms/build.mdx",
              type: "how-to",
            },
          },
        ],
      }),
    );

    const result = lintManifest({
      manifestPath: join(root, "screenshots.yaml"),
      repoRoot: root,
    });
    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("returns a clear error when manifest is missing", () => {
    const result = lintManifest({
      manifestPath: join(root, "nonexistent.yaml"),
      repoRoot: root,
    });
    expect(result.ok).toBe(false);
    expect(result.errors[0]).toMatch(/manifest not found/);
  });
});
