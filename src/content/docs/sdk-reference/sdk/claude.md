---
title: AI System Instructions
description: System instructions for AI coding assistants building Bifrost workflows
---

This page provides instructions for AI coding assistants working on Bifrost projects. Copy the instructions below into your AI assistant's context.

````markdown
# Bifrost AI System Instructions

You are helping build workflows for Bifrost, a workflow automation platform.

## Documentation Access

**IMPORTANT**: Use the Context7 MCP server to access up-to-date Bifrost documentation.

Use the Context7 MCP server tool `get-library-docs` with library ID: `/jackmusick/bifrost-docs`

Before coding, fetch relevant documentation:
- For decorators: Request topic "decorators"
- For SDK modules: Request topic "sdk modules" or "bifrost module"
- For ExecutionContext: Request topic "execution context" or "context api"
- For forms: Request topic "forms"
- For workflows: Request topic "workflows"

Always check the documentation first before writing code to ensure accuracy.

## Critical Rules (Always Apply)

1. **Async/Await**:
   - `config`, `secrets`, `oauth`, `forms`, `organizations`, `executions`, `roles` are **ASYNC** - must `await`
   - `files` and `workflows` modules are **SYNCHRONOUS** - no `await`

2. **OAuth API**: Use `await oauth.get_token("provider")` returning dict with `access_token`
   - NOT `get_oauth_connection()` (doesn't exist)

3. **Files API**: Use `files.list()` NOT `files.list_dir()`

4. **Logger Syntax**: Use `logger.info("msg", extra={})` NOT `logger.info( "msg", {})`

5. **No has_config()**: ExecutionContext has no `has_config()` method - use `await config.get(key)`

6. **Check None**: OAuth/config/secrets can return None - always check before using

7. **Never Log Secrets**: No passwords, tokens, API keys, or full email addresses

8. **Check org_id**: Always verify `context.org_id` exists before org-scoped operations

## Quick Reference

| Module | Async? | Key Functions |
|--------|--------|---------------|
| config | ✅ Yes | get, set, list, delete |
| secrets | ✅ Yes | get, set, list, delete |
| oauth | ✅ Yes | get_token, set_token, list_providers, delete_token, refresh_token |
| files | ❌ No | read, read_bytes, write, write_bytes, list, delete, exists |
| forms | ✅ Yes | list, get |
| organizations | ✅ Yes | create, get, list, update, delete |
| workflows | ❌ No | execute, list, get_status |
| executions | ✅ Yes | list, get, delete |
| roles | ✅ Yes | create, get, list, update, delete, list_users, list_forms, assign_users, assign_forms |

## Workflow Structure Example

```python
from bifrost import workflow, param, ExecutionContext

@workflow(name="my_workflow", description="What it does")
@param("email", "email", required=True)
async def my_workflow(context: ExecutionContext, email: str):
    # Access context
    org_id = context.org_id
    user_id = context.user_id

    # Use SDK modules (async!)
    api_key = await secrets.get("api_key")

    # Files are synchronous (no await)
    content = files.read("data/file.txt")

    return {"success": True}
\```

## Before You Code

1. Use Context7 MCP to fetch relevant documentation
2. Verify APIs against the documentation
3. Check async/sync requirements
4. Validate parameters with @param decorators
5. Handle errors and None returns gracefully
````
