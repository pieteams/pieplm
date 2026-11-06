# API Reference

This page describes the intended PiePLM API. The project is in the design phase; endpoint names and payload fields may change before the first release. The conventions below reflect the design constraints the implementation will follow.

## Conventions

- Base path: `/api/v1`
- Format: JSON, UTF-8
- Authentication: session cookie for the web UI, bearer token for API clients
- Errors: RFC 9457-style problem details
- Pagination: cursor-based, with an explicit page size limit
- Idempotency: `Idempotency-Key` header on create operations
- Timestamps: RFC 3339 in UTC
- Identifiers: opaque strings, never sequential integers exposed to clients

## Resource overview

| Resource | Purpose |
| --- | --- |
| `/products` | Product identities and lifecycle state |
| `/products/{code}/revisions` | Revision snapshots |
| `/revisions/{id}/documents` | Attachments and metadata |
| `/revisions/{id}/bom` | Structured bill of materials |
| `/changes` | Change requests and approvals |
| `/suppliers` | Supplier records linked to parts |
| `/quality/nonconformances` | Non-conformance and corrective actions |
| `/search` | Cross-entity search |

## Example: create a product

```http
POST /api/v1/products
Authorization: Bearer <token>
Content-Type: application/json
Idempotency-Key: 3f2c1a9e-...

{
  "code": "PUMP-100",
  "name": "Coolant pump",
  "description": "12 V centrifugal pump for the compact chiller range",
  "owner": "engineering.team"
}
```

Response:

```json
{
  "id": "prd_01J8Z3K4T9",
  "code": "PUMP-100",
  "name": "Coolant pump",
  "lifecycleState": "development",
  "currentRevision": null,
  "createdAt": "2026-11-06T08:00:00Z"
}
```

The code is the human-facing identifier. The `id` is stable even if the code is corrected later.

## Example: create a revision

```http
POST /api/v1/products/PUMP-100/revisions
{
  "revision": "A",
  "effectivity": { "type": "immediate" },
  "note": "Initial design release"
}
```

A revision is immutable once approved. Later edits create a new revision through a change request; they do not mutate the approved snapshot.

## Example: read a BOM

```http
GET /api/v1/products/PUMP-100/revisions/A/bom
```

```json
{
  "product": "PUMP-100",
  "revision": "A",
  "items": [
    { "line": 10, "part": "HOUSING-01", "quantity": 1, "unit": "ea" },
    { "line": 20, "part": "IMPELLER-02", "quantity": 1, "unit": "ea" },
    { "line": 30, "part": "SEAL-03", "quantity": 2, "unit": "ea" },
    { "line": 40, "part": "MOTOR-12V-04", "quantity": 1, "unit": "ea" }
  ]
}
```

BOM lines have stable line identifiers. A line may be added, superseded or removed, but it is not silently overwritten.

## Example: submit a change

```http
POST /api/v1/changes
{
  "title": "Replace seal material",
  "product": "PUMP-100",
  "affectedRevisions": ["A"],
  "reason": "Improved resistance to the coolant additive",
  "items": [
    { "action": "replace", "from": "SEAL-03", "to": "SEAL-03B", "quantity": 2 }
  ],
  "approvers": ["quality.manager", "engineering.lead"]
}
```

The change request is a workflow object. It does not modify the product definition until every required approval is recorded.

## Error format

```json
{
  "type": "https://pieteams.github.io/pieplm/errors/validation",
  "title": "Validation failed",
  "status": 422,
  "detail": "Revision A already exists for product PUMP-100",
  "errors": [
    { "field": "revision", "code": "duplicate" }
  ]
}
```

Clients should branch on `type` and `status`, not on the human-readable `detail`.

## Authentication and authorisation

Two mechanisms are planned:

- **Session cookies** for the server-rendered web UI, with CSRF protection
- **Bearer tokens** for scripts, integrations and agents

Bearer tokens are scoped to an organisation, a role and optionally an entity. A token used by a reporting tool must not be able to approve changes. Every write is recorded in an audit log with the actor, time and request identifier.

## Pagination

```http
GET /api/v1/changes?limit=50&cursor=eyJpZCI6...
```

The response includes `nextCursor` when more data exists. Cursors are opaque and must not be constructed by clients.

## Rate limiting

Write endpoints are rate limited per token and per organisation. Read endpoints are limited more generously. When a limit is exceeded, the API returns `429` with a `Retry-After` header.

## Versioning

The path version (`v1`) changes only for breaking changes. Additive fields do not change the version. Deprecated fields are announced in release notes and kept for at least one minor release.

## MCP surface

The MCP server is a separate interface over the same domain model. Read tools mirror the API:

- `product_search`
- `product_get`
- `revision_list`
- `bom_get`
- `change_list`
- `document_list`

Write tools are disabled by default. See [MCP integration](/guide/mcp-integration).

## Status

No endpoint is live yet. When the first release is published, this page will be replaced with a generated OpenAPI specification and the prose above will remain as an overview of the conventions.

## Next steps

- [Configuration](/reference/config) — settings
- [Architecture](/guide/architecture) — component design
- [GitHub repository](https://github.com/pieteams/pieplm) — implementation milestones
