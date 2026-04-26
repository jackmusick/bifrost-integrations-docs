# Bootstrap Report

Generated against bifrost @ `/home/jack/GitHub/bifrost/.worktrees/docs-skill` and docs @ `/home/jack/GitHub/bifrost-integrations-docs`.

## Summary
- MDX files scanned: **61**
- Image references found: **23**
- Manifest entries written: **23**
- Low-confidence/missing routes: **1**
- Pages without screenshots: **51**

## Low-confidence route inferences

These entries need a human to confirm or correct the `route:` field before the first capture.

| id | page | heading | inferred route | score | reason |
|---|---|---|---|---|---|
| `core-concepts-dashboard` | `src/content/docs/core-concepts/platform-overview.mdx` | Dashboard | `/` | 0.67 | low-confidence-match |

## Pages without screenshots

These MDX files have zero image references. Either they're text-only by design, or they need entries added manually.

- `src/content/docs/about/index.mdx` — What is Bifrost Integrations?
- `src/content/docs/about/license.mdx` — License (AGPL-3.0)
- `src/content/docs/about/why-open-source.mdx` — Why This Matters
- `src/content/docs/core-concepts/discovery-system.mdx` — Workflow Registration
- `src/content/docs/core-concepts/error-handling.mdx` — Error Handling
- `src/content/docs/core-concepts/manifest-structure.mdx` — Manifest Structure
- `src/content/docs/core-concepts/permissions.md` — Permissions & Roles
- `src/content/docs/core-concepts/scopes.mdx` — Scopes: Global vs Organization
- `src/content/docs/getting-started/for-non-developers.mdx` — For the Non-Developer
- `src/content/docs/getting-started/installation.mdx` — Installation
- `src/content/docs/how-to-guides/ai/agents-and-chat.mdx` — Agents and Chat
- `src/content/docs/how-to-guides/ai/knowledge-bases.mdx` — Knowledge Bases
- `src/content/docs/how-to-guides/ai/llm-configuration.mdx` — LLM Configuration
- `src/content/docs/how-to-guides/ai/using-ai-in-workflows.mdx` — Using AI in Workflows
- `src/content/docs/how-to-guides/analytics/roi-tracking.mdx` — ROI Tracking
- `src/content/docs/how-to-guides/authentication/passkeys.mdx` — Passkeys (WebAuthn)
- `src/content/docs/how-to-guides/authentication/sso.mdx` — Configure SSO
- `src/content/docs/how-to-guides/forms/cascading-dropdowns.mdx` — Cascading Dropdowns
- `src/content/docs/how-to-guides/forms/context-field-references.mdx` — Reference Form Context Data
- `src/content/docs/how-to-guides/forms/html-content.mdx` — Display Personalized Welcome Messages
- `src/content/docs/how-to-guides/forms/startup-workflows.mdx` — Pre-fill Forms from URL Parameters
- `src/content/docs/how-to-guides/integrations/creating-integrations.mdx` — Creating Integrations
- `src/content/docs/how-to-guides/integrations/mcp-server.mdx` — MCP Server
- `src/content/docs/how-to-guides/integrations/microsoft-graph.mdx` — Automate Microsoft 365 User Management
- `src/content/docs/how-to-guides/integrations/sdk-generation.mdx` — SDK Generation
- `src/content/docs/how-to-guides/integrations/secrets-management.mdx` — Store API Keys Securely
- `src/content/docs/how-to-guides/local-dev/ai-coding.md` — AI-Assisted Development
- `src/content/docs/how-to-guides/local-dev/setup.mdx` — Local Development
- `src/content/docs/how-to-guides/ui/keyboard-shortcuts.md` — Keyboard Shortcuts
- `src/content/docs/how-to-guides/workflows/ai-tools.mdx` — AI Tools
- `src/content/docs/how-to-guides/workflows/error-handling.mdx` — Error Handling
- `src/content/docs/how-to-guides/workflows/http-endpoints.mdx` — HTTP Endpoints
- `src/content/docs/how-to-guides/workflows/scheduled-workflows.mdx` — Scheduled Workflows
- `src/content/docs/how-to-guides/workflows/using-decorators.mdx` — Use Decorators
- `src/content/docs/how-to-guides/workflows/webhook-variables.mdx` — Webhook & Event Variables
- `src/content/docs/how-to-guides/workflows/writing-workflows.mdx` — Write Workflows
- `src/content/docs/index.mdx` — Bifrost Integrations
- `src/content/docs/sdk-reference/app-builder/code-apps.mdx` — Code-Based Apps
- `src/content/docs/sdk-reference/sdk/agents-module.mdx` — Agents Module
- `src/content/docs/sdk-reference/sdk/ai-module.mdx` — AI Module
- `src/content/docs/sdk-reference/sdk/bifrost-module.mdx` — bifrost Module Reference
- `src/content/docs/sdk-reference/sdk/config-module.mdx` — Config Module
- `src/content/docs/sdk-reference/sdk/context-api.mdx` — Context API
- `src/content/docs/sdk-reference/sdk/decorators.mdx` — Decorators Reference
- `src/content/docs/sdk-reference/sdk/external-sdk.mdx` — External SDK
- `src/content/docs/sdk-reference/sdk/integrations-module.mdx` — Integrations Module
- `src/content/docs/sdk-reference/sdk/knowledge-module.mdx` — Knowledge Module
- `src/content/docs/sdk-reference/sdk/tables-module.mdx` — Tables Module
- `src/content/docs/troubleshooting/forms.md` — Forms Troubleshooting
- `src/content/docs/troubleshooting/oauth.md` — OAuth Troubleshooting
- `src/content/docs/troubleshooting/workflow-engine.md` — Troubleshooting

## Next steps

1. Review the low-confidence rows above and correct `route:` in `screenshots.yaml`.
2. For any entry where the screenshot should be cropped or have a callout, add `capture.crop` or `capture.callouts` (use the draw-a-box helper).
3. Run `npm run lint:manifest` to validate.
4. Run the capture pipeline.
