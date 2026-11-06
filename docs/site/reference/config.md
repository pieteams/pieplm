# Configuration

This page describes the intended configuration model for PiePLM. The project is in the design phase, so names and defaults may change before the first release. The principles, however, are stable: explicit settings, environment overrides and no secrets in the repository.

## Precedence

Configuration is resolved in this order, highest priority first:

1. environment variables
2. a configuration file passed with `--config`
3. built-in defaults

Environment variables use the `PIEPLM_` prefix and uppercase snake case. For example, `database.url` becomes `PIEPLM_DATABASE_URL`.

## Minimal configuration

A minimal deployment needs a database URL, a server secret and a public base URL:

```yaml
server:
  host: 0.0.0.0
  port: 8080
  publicUrl: https://plm.example.com

database:
  url: postgres://pieplm:secret@localhost:5432/pieplm?sslmode=require
  maxOpenConnections: 20
  maxIdleConnections: 5

security:
  # Used to sign sessions and short-lived tokens.
  # Provide through PIEPLM_SECURITY_SECRET in production.
  secret: change-me
  sessionHours: 12
```

The secret must be generated with a cryptographically secure random source and stored in a secret manager or environment file outside version control. Rotating it invalidates existing sessions, which is the intended behaviour.

## Settings by area

### Server

| Key | Default | Description |
| --- | --- | --- |
| `server.host` | `127.0.0.1` | Interface to bind |
| `server.port` | `8080` | HTTP port |
| `server.publicUrl` | — | External URL used in links and callbacks |
| `server.trustedProxies` | empty | Proxies allowed to set forwarded headers |
| `server.maxBodyBytes` | `52428800` | Upload limit per request |

Bind to `127.0.0.1` when a reverse proxy terminates TLS. Bind to `0.0.0.0` only on a trusted network.

### Database

| Key | Default | Description |
| --- | --- | --- |
| `database.url` | — | PostgreSQL connection string |
| `database.maxOpenConnections` | `20` | Connection pool ceiling |
| `database.maxIdleConnections` | `5` | Idle connections retained |
| `database.migrations` | `auto` | `auto`, `manual` or `off` |

In production, prefer `manual` migrations so that schema changes are reviewed and applied deliberately rather than at process start.

### Authentication

| Key | Default | Description |
| --- | --- | --- |
| `auth.mode` | `local` | `local` or `oidc` |
| `auth.sessionHours` | `12` | Session lifetime |
| `auth.apiKeyEnabled` | `true` | Allow API keys for integrations |
| `auth.oidc.issuer` | — | OIDC issuer URL when enabled |
| `auth.oidc.clientId` | — | OIDC client identifier |
| `auth.oidc.clientSecret` | — | Provide through the environment |

API keys should be scoped to a role and an organisation. A key issued to a reporting tool should not be able to approve changes.

### Storage

| Key | Default | Description |
| --- | --- | --- |
| `storage.driver` | `local` | `local` or `s3` |
| `storage.local.path` | `./data/files` | Attachment directory |
| `storage.s3.endpoint` | — | S3-compatible endpoint |
| `storage.s3.bucket` | — | Bucket name |
| `storage.s3.region` | — | Region |
| `storage.s3.accessKey` | — | Prefer environment or instance role |
| `storage.s3.secretKey` | — | Prefer environment or instance role |

Store large binaries outside the database. Back up the attachment volume and the database together so that metadata and files remain consistent.

### Search

| Key | Default | Description |
| --- | --- | --- |
| `search.language` | `simple` | PostgreSQL text search configuration |
| `search.embeddings.enabled` | `false` | Enable optional vector channel |
| `search.embeddings.model` | — | Embedding model identifier |
| `search.hybrid.weightLexical` | `0.7` | Lexical weight in fusion |
| `search.hybrid.weightVector` | `0.3` | Vector weight in fusion |

PostgreSQL full-text search is the baseline. Vector search is an optional second channel and should be fused with lexical results rather than replacing them. See [Search engine](/guide/search-engine).

### MCP

| Key | Default | Description |
| --- | --- | --- |
| `mcp.enabled` | `false` | Enable the MCP server |
| `mcp.transport` | `stdio` | `stdio` or `http` |
| `mcp.readOnly` | `true` | Disable write tools by default |
| `mcp.authToken` | — | Token for HTTP transport |

Read-only access is the safe default for agents. Enabling write tools should require an explicit configuration change and a scoped token.

### Workflow

| Key | Default | Description |
| --- | --- | --- |
| `workflow.requireApprovalForChanges` | `true` | Changes need approval |
| `workflow.requireApprovalForBom` | `true` | BOM edits need approval |
| `workflow.escalationHours` | `72` | Reminder threshold |

Approval requirements should not be configurable to the point of being disableable by the author of a change. Separate the permission to configure a workflow from the permission to approve within it.

## Environment overrides

```bash
export PIEPLM_DATABASE_URL='postgres://pieplm:secret@db.internal:5432/pieplm?sslmode=require'
export PIEPLM_SECURITY_SECRET="$(openssl rand -hex 32)"
export PIEPLM_SERVER_PUBLIC_URL='https://plm.example.com'
```

Never commit a real secret, even in an example file. Commit an `.env.example` with placeholder values and document each variable.

## Validation and failure behaviour

Configuration is validated at startup. The process should fail fast, with a clear message, when:

- the database URL is missing or unreachable
- the security secret is missing or shorter than the required minimum
- `auth.mode=oidc` but the issuer or client ID is absent
- `storage.driver=s3` but the bucket or credentials are missing
- `mcp.transport=http` but no token is configured

A service that starts with invalid configuration is harder to diagnose than one that refuses to start.

## Next steps

- [API reference](/reference/api) — endpoints and conventions
- [Architecture](/guide/architecture) — deployment topology
- [Installation](/getting-started/installation) — deployment options
