---
title: ExecutionContext API
description: Complete reference for the ExecutionContext object passed to workflows
---

The `ExecutionContext` object provides access to organization data, user information, and execution metadata. Every workflow receives this object as its first parameter.

For configuration, secrets, OAuth, and file operations, use the SDK modules:
```python
from bifrost import config, secrets, oauth, files
```

## Properties

### Organization Properties

```python
context.organization: Organization | None
```
The organization object (with `id`, `name`, `is_active`). None for global scope.

```python
context.org_id: str | None
```
The ID of the organization executing the workflow. None for global scope.

```python
context.org_name: str | None
```
The display name of the organization. None for global scope.

### User Properties

```python
context.user_id: str
```
The ID of the user who triggered the workflow.

```python
context.email: str
```
The email address of the user who triggered the workflow.

```python
context.name: str
```
The display name of the user who triggered the workflow.

### Execution Properties

```python
context.execution_id: str
```
Unique identifier for this workflow execution. Useful for logging and tracking.

```python
context.scope: str
```
The scope of the execution (typically the organization ID or "GLOBAL").

```python
context.is_platform_admin: bool
```
Whether the user is a platform administrator.

```python
context.is_function_key: bool
```
Whether the request was authenticated via function key (vs user authentication).

```python
context.is_global_scope: bool
```
True if executing in GLOBAL scope (no organization).

## Backwards Compatibility

For backwards compatibility, the context also provides:

```python
context.executed_by: str           # Alias for context.user_id
context.executed_by_email: str     # Alias for context.email
context.executed_by_name: str      # Alias for context.name
```

## SDK Modules

The ExecutionContext is intentionally minimal - it only provides identity, organization, and execution metadata. All functionality (config, secrets, OAuth, files) is provided through SDK modules:

### Configuration

```python
from bifrost import config

# Get configuration value
api_base_url = config.get("api_base_url", default="https://api.example.com")

# Set configuration
config.set("api_base_url", "https://api.example.com")

# List all config
all_config = config.list()

# Delete config
config.delete("old_key")
```

### Secrets

```python
from bifrost import secrets

# Get secret from Key Vault (org-scoped: {org_id}--{key})
api_key = secrets.get("github_api_key")

# Set secret
secrets.set("github_api_key", "secret_value")

# Delete secret
secrets.delete("old_secret")
```

### OAuth

```python
from bifrost import oauth

# Get OAuth credentials
creds = oauth.get_oauth_connection("microsoft_graph")
auth_header = creds.get_auth_header()  # "Bearer {access_token}"

# Use in API call
headers = {"Authorization": auth_header}
response = await session.get("https://graph.microsoft.com/v1.0/me", headers=headers)
```

### Files

```python
from bifrost import files

# Write file
files.write("data/users.csv", "id,name\n1,Alice\n")

# Read file
content = files.read("data/users.csv")

# List directory
items = files.list_dir("data/")

# Delete file
files.delete("data/old.csv")
```

## Logging

Use Python's built-in logging module for logging in workflows:

```python
import logging

logger = logging.getLogger(__name__)

# Log with context information
logger.info("User creation started", extra={
    "email": "alice@example.com",
    "department": "engineering",
    "org_id": context.org_id
})

logger.error("API call failed", extra={
    "endpoint": "/users",
    "status_code": 500,
    "org_id": context.org_id
})
```

**Important**: Never log sensitive data like passwords, API keys, or tokens.

## Usage Examples

### Basic Workflow

```python
import logging
from bifrost import config, secrets

logger = logging.getLogger(__name__)

@workflow(name="example")
async def example(context: ExecutionContext):
    # Access user and organization
    logger.info("Executing workflow", extra={
        "user_id": context.user_id,
        "org_id": context.org_id
    })

    # Get configuration
    api_base_url = config.get("api_base_url")

    # Get secret
    api_key = secrets.get("api_key")

    # Use in API call
    headers = {"Authorization": f"Bearer {api_key}"}

    return {
        "success": True,
        "executed_by": context.user_id,
        "organization": context.org_id
    }
```

### Error Handling

```python
import logging

logger = logging.getLogger(__name__)

@workflow(name="resilient_workflow")
async def resilient(context: ExecutionContext):
    try:
        logger.info("Starting operation")
        result = await risky_operation()
        logger.info("Operation succeeded")
        return result

    except ValueError as e:
        logger.warning("Invalid input", extra={
            "error": str(e),
            "user": context.user_id
        })
        raise

    except Exception as e:
        logger.error("Operation failed", extra={
            "error": str(e),
            "error_type": type(e).__name__,
            "user": context.user_id,
            "org": context.org_id
        })
        raise
```

### OAuth Integration

```python
import logging
from bifrost import oauth

logger = logging.getLogger(__name__)

@workflow(name="sync_with_graph")
async def sync_with_graph(context: ExecutionContext):
    try:
        # Get OAuth credentials
        creds = oauth.get_oauth_connection("microsoft_graph")

        # Check if credentials are valid
        if creds.is_expired():
            logger.warning("OAuth token expired, refreshing")
            # Token refresh happens automatically

        # Use in API call
        headers = {"Authorization": creds.get_auth_header()}

        async with aiohttp.ClientSession() as session:
            async with session.get(
                "https://graph.microsoft.com/v1.0/me",
                headers=headers
            ) as response:
                user = await response.json()

        logger.info("Retrieved user from Graph", extra={
            "user_id": user["id"]
        })

        return {"success": True, "user": user}

    except Exception as e:
        logger.error("Graph sync failed", extra={"error": str(e)})
        raise
```

## Type Annotations

Use the ExecutionContext type hint for IDE autocomplete:

```python
from bifrost import workflow, ExecutionContext, config, secrets, oauth

@workflow(name="typed_example")
async def typed_example(context: ExecutionContext, param: str):
    # Access context properties
    org_id = context.org_id
    user_id = context.user_id

    # Use SDK modules for functionality
    api_url = config.get("api_url")
    api_key = secrets.get("api_key")
    creds = oauth.get_oauth_connection("provider")
```

## Security Considerations

**✅ DO:**
- Log only non-sensitive data
- Use `secrets.get()` for passwords and tokens
- Store organization-scoped secrets
- Check `context.org_id` for authorization
- Use `context.is_platform_admin` for admin checks

**❌ DON'T:**
- Log secrets, tokens, or credentials
- Hardcode sensitive values
- Log PII (personally identifiable information)
- Bypass organization checks
- Access data from other organizations

## Complete Example

```python
from bifrost import workflow, param, ExecutionContext, config, secrets
from datetime import datetime
import aiohttp
import logging

logger = logging.getLogger(__name__)

@workflow(
    name="comprehensive_example",
    description="Demonstrates all context and SDK features"
)
@param("email", "email", required=True)
async def comprehensive(context: ExecutionContext, email: str):
    """Complete example using context and SDK modules."""

    # Log execution start
    logger.info("Starting comprehensive workflow", extra={
        "user_id": context.user_id,
        "email_param": email,
        "organization": context.org_id,
        "execution_id": context.execution_id
    })

    try:
        # Step 1: Get configuration
        api_base_url = config.get("api_base_url")
        if not api_base_url:
            raise ValueError("Missing required configuration: api_base_url")

        logger.info("Configuration validated", extra={
            "api_base_url": api_base_url
        })

        # Step 2: Get credentials
        api_key = secrets.get("api_key")
        headers = {"Authorization": f"Bearer {api_key}"}

        logger.info("Credentials retrieved")

        # Step 3: Make API call
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{api_base_url}/users",
                json={"email": email},
                headers=headers
            ) as response:
                if response.status == 201:
                    user = await response.json()
                    user_id = user["id"]
                else:
                    error = await response.text()
                    raise Exception(f"API error: {response.status} - {error}")

        logger.info("User created via API", extra={
            "user_id": user_id,
            "email": email
        })

        return {
            "success": True,
            "user_id": user_id,
            "email": email,
            "created_by": context.user_id
        }

    except Exception as e:
        logger.error("Workflow failed", extra={
            "error": str(e),
            "error_type": type(e).__name__,
            "email_param": email
        })
        raise
```

## See Also

- [Workflow Development Guide](/guides/workflows/writing-workflows/)
- [Decorators Reference](/reference/sdk/decorators/)
- [Secrets Management](/guides/integrations/secrets-management/)
