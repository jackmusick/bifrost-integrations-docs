---
title: AI-Assisted Development
description: Use AI coding tools to build Bifrost workflows, forms, and apps
---

There are three ways to use AI tools with Bifrost, depending on your setup. Pick whichever fits your workflow - they all talk to the same platform.

| Approach | Best for | Requirements |
|----------|----------|--------------|
| **Claude Code + Skill** | Developers with local repos and git workflows | Claude Code, Bifrost SDK installed |
| **Local SDK** | Any AI tool (Copilot, Cursor, etc.) with local files | Bifrost SDK, Python 3.11+ |
| **MCP (Remote)** | Non-developers, quick edits, no local setup | MCP-compatible AI tool |

## 1. Claude Code with `/bifrost:build`

The fastest path if you use Claude Code. The `/bifrost:build` skill combines local development with CLI and MCP tools automatically.

### Setup

```bash
# Install the SDK from your instance and authenticate
pipx install https://your-instance.gobifrost.com/api/cli/download
bifrost login --url https://your-instance.gobifrost.com

# (Optional) Add the MCP server to Claude Code — only needed for create_form, create_app, create_agent, and knowledge search
claude mcp add --transport http bifrost https://your-instance.gobifrost.com/mcp
```

Or run `/bifrost:setup` inside Claude Code and it walks you through everything.

### How it works

The skill gives Claude Code two modes:

**SDK-first (local development):**
1. Start `bifrost watch` to auto-sync file changes to the platform
2. Write workflow code locally in your git repo
3. Files auto-sync as you save — no manual push needed
4. Test with `bifrost run <file> <function> --params '{...}'`
5. Use `bifrost api` for platform operations (execute, check logs, download docs)
6. Commit and push to GitHub when ready

**MCP-only (remote development):**
1. Write workflow files via MCP file tools, then `register_workflow` to register them. Use `create_form`, `create_app` for other artifacts.
2. Test with `execute_workflow`
3. Iterate with `patch_content` for surgical edits

The skill automatically checks your integrations, reads SDK documentation, validates before declaring anything ready, and asks about org scoping.

### CLI commands for platform operations

The `bifrost api` command provides authenticated REST access without needing MCP:

```bash
# Download SDK documentation (once per session, then grep locally)
bifrost api GET /api/docs/sdk > /tmp/bifrost-docs/sdk.md

# Execute a workflow synchronously (blocks until result)
bifrost api POST /api/workflows/{id}/execute '{"workflow_id":"...","input_data":{...},"sync":true}'

# Check execution logs
bifrost api GET /api/executions/{id}

# List platform state (for debugging sync divergence)
bifrost api GET /api/workflows
```

### When to use which

| Artifact | Local (SDK) | Remote (MCP) |
|----------|-------------|--------------|
| Workflow / Tool / Data Provider | Write locally, test, sync | Write file + `register_workflow` |
| Form | MCP only | `create_form` |
| App | MCP only | `create_app` |

Even in SDK-first mode, forms and apps require MCP because they're platform-managed artifacts, not files.

## 2. Local SDK Development

Works with any AI tool that can edit local files (GitHub Copilot, Cursor, Windsurf, etc.).

### Setup

```bash
pipx install https://your-instance.gobifrost.com/api/cli/download
bifrost login --url https://your-instance.gobifrost.com
```

The login command opens your browser for authentication. Credentials are saved to `~/.bifrost/credentials.json` and refresh automatically.

### Workflow

1. Write Python files with `@workflow`, `@tool`, or `@data_provider` decorators
2. Start `bifrost watch` in your workspace to auto-sync changes to the platform
3. Test locally: `bifrost run my_workflow.py hello_world --params '{"name": "Alice"}'`
4. All SDK modules (`ai`, `integrations`, `config`, `knowledge`, etc.) work locally - they call the remote API
5. Commit and push to git when ready

### What to tell your AI tool

Give your AI assistant this context:

```
I'm building workflows for Bifrost, a Python automation platform.
- Workflows use `@workflow`, `@tool`, or `@data_provider` decorators from the `bifrost` package
- All functions must be async
- SDK modules: bifrost.ai, bifrost.config, bifrost.integrations, bifrost.knowledge, bifrost.tables, bifrost.files, bifrost.users, bifrost.organizations, bifrost.roles, bifrost.executions, bifrost.forms, bifrost.workflows
- Use `from bifrost import context` to access context.org_id, context.user_id, context.email
- Use `logging.getLogger(__name__)` for execution logs
- Return dicts or Pydantic models
```

## 3. MCP for External AI Tools

Connect Claude Desktop, ChatGPT, or any MCP-compatible tool directly to Bifrost. No local files needed.

### Setup

Add the Bifrost MCP server to your AI tool's configuration. For Claude Desktop, add to your config file:

```json
{
  "mcpServers": {
    "bifrost": {
      "type": "http",
      "url": "https://your-instance.gobifrost.com/mcp"
    }
  }
}
```

You can also enable MCP from within Bifrost at **Settings** > **Platform** > **MCP Server**.

### What MCP gives you

Your AI tool automatically discovers all available tools:

- **Discovery:** `list_workflows`, `list_integrations`, `list_forms`, `list_apps`
- **Documentation:** `get_workflow_schema`, `get_sdk_schema`, `get_form_schema`, `get_app_schema`
- **Creation:** `register_workflow`, `create_form`, `create_app`
- **Editing:** `search_content`, `patch_content`, `replace_content`
- **Execution:** `execute_workflow`, `list_executions`, `get_execution`
- **Events:** `create_event_source`, `create_event_subscription`
- **Admin:** `list_organizations`, `list_tables`, `search_knowledge`

### MCP system prompt

Copy this into your AI tool's system instructions for best results:

````markdown
You help build automations on the Bifrost platform using MCP tools.

**Before writing any workflow that uses an integration, run `list_integrations` first.** If the integration isn't configured, guide the user to Settings > Integrations to set it up. Do not write untestable code.

**Before creating any resource, clarify scope:**
1. Which organization? (use `list_organizations` to show options)
2. Global or org-specific?

**Development flow:**
1. Read docs: `get_workflow_schema`, `get_sdk_schema`
2. Check integrations: `list_integrations`
3. Write workflow file via file tools (`replace_content`)
4. Register: `register_workflow` (validates and registers)
5. Test: `execute_workflow`
6. Check logs: `get_execution`
7. Iterate: `patch_content` for edits

**Code standards:**
- async/await for all functions
- Type hints on all parameters
- `logging.getLogger(__name__)` for logs
- Return dicts or Pydantic models

**Forms** are created via `create_form`, not as files. Create the workflow first, verify with `list_workflows`, then create the form linked to the workflow ID.

**Apps** are built granularly: `create_app` > edit files with `replace_content` > preview > `publish_app` only when the user asks.
````

## Choosing an Approach

**Use Claude Code + `/bifrost:build`** if you want the best experience - it handles mode switching, validation, and testing automatically.

**Use Local SDK** if you prefer a different AI tool or want full control over your git workflow.

**Use MCP** if you don't want a local dev environment, or for quick one-off edits and form/app creation.

All three approaches can be combined. A common pattern is developing workflows locally with the SDK, then using MCP tools to create forms and apps that reference those workflows.
