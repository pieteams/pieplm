# MCP Integration

The Model Context Protocol (MCP) lets AI agents call tools exposed by a server. PiePLM plans to ship an MCP server so that an agent can query product data without scraping a web UI or holding database credentials.

This page describes the intended integration: the tools, the transports, the permission model and the safety rules. The project is in the design phase, so tool names may change before release.

## Why expose product data to agents

Three realistic uses:

1. **Engineering assistant** — “What changed between revision A and B of PUMP-100, and who approved it?”
2. **Quality investigation** — “Which open non-conformances affect the current revision of this product?”
3. **Operations support** — “Which supplier parts are on the service kit for this product, and are any obsolete?”

Each question requires reading several records and following relationships. A search tool plus a read tool is usually enough; a natural-language answer tool is not, because the agent needs to cite the underlying records.

## Design principles

- **Read-only by default.** Write tools are disabled unless explicitly enabled and scoped.
- **Same permissions as a user.** An MCP token inherits a role and an organisation scope. It does not bypass access control.
- **Stable identifiers.** Tools return product codes, revision labels and record IDs that a human can search for in the UI.
- **Bounded responses.** Every list tool has a default and maximum page size.
- **Auditable access.** MCP reads are logged with the token, actor and query.
- **No hidden generation.** The server returns records and fields; it does not invent summaries. If a summary is useful, it is produced by the calling agent, which can be asked to show its sources.

## Planned read tools

| Tool | Purpose |
| --- | --- |
| `product_search` | Find products by code, name, description or tag |
| `product_get` | Read a product identity and lifecycle state |
| `revision_list` | List revisions for a product |
| `revision_get` | Read a revision snapshot |
| `document_list` | List documents for a product or revision |
| `bom_get` | Read the bill of materials for a revision |
| `change_list` | List change requests affecting a product |
| `change_get` | Read a change request, impact and approvals |
| `quality_list` | List non-conformances for a product or revision |
| `supplier_get` | Read a supplier record and its parts |
| `search` | Cross-entity search with filters |

## Planned write tools (disabled by default)

| Tool | Purpose | Required scope |
| --- | --- | --- |
| `change_draft` | Create a draft change request | `change:write` |
| `document_attach` | Attach a document to a draft revision | `document:write` |
| `requirement_add` | Add a requirement to a draft | `requirement:write` |

Write tools never approve. Approval remains a human action in the web UI or through a dedicated API with a human identity. An agent may prepare a change; it may not release one.

## Transports

### stdio

The server runs as a child process of the agent host and communicates over standard input and output. This is the simplest setup for a local development machine: the agent starts the server, the server connects to the PiePLM API with a scoped token.

```json
{
  "mcpServers": {
    "pieplm": {
      "command": "pieplm-mcp",
      "env": {
        "PIEPLM_API_URL": "https://plm.example.com",
        "PIEPLM_API_TOKEN": "<scoped token>"
      }
    }
  }
}
```

### HTTP

The server exposes an HTTP endpoint for remote agents. This requires TLS, a token and network restrictions. The HTTP transport is intended for shared infrastructure, not for exposing product data to the public internet.

## Permission model

An MCP token is a normal API credential with a role and a scope:

- **organisation** — which organisation's data may be read
- **role** — `viewer`, `engineer`, `reviewer`, `admin`
- **entity scope** — optionally limited to specific product families or business units
- **tool scope** — which tools the token may call

A token issued for a reporting job should be limited to read tools and a single organisation. A token issued to an engineering assistant may read drafts but not approve them.

## Audit and rate limits

Every tool call records:

- token identifier (not the secret)
- actor and organisation
- tool name and redacted arguments
- record identifiers returned
- timestamp and duration

Rate limits apply per token. A runaway agent loop should hit a limit rather than exhaust the database. The error is returned as a structured MCP error with a retry hint.

## Safety rules

- **Never return secrets or internal URLs.** Tool responses contain domain data only.
- **Never allow SQL or arbitrary query languages.** Tools accept structured filters.
- **Never bypass permissions for convenience.** If a field is restricted in the UI, it is restricted in MCP.
- **Do not let an agent approve.** Approval requires a human identity and an explicit action.
- **Bound list sizes.** A tool that can return 100,000 rows will eventually do so.

## Relationship to PieKBS

PiePLM stores structured product data. PieKBS stores distilled knowledge: procedures, specifications, meeting notes and design rationale. An agent may use both:

- PiePLM for authoritative product and revision records
- PieKBS for narrative knowledge and source documents

The two servers expose different tools and different permissions. They are not merged into a single index, because authoritative transactional data and curated knowledge have different lifecycles and different failure modes.

## Example agent flow

```text
User: What changed in the seal for PUMP-100 between revisions A and B?

Agent:
1. product_search({ query: "PUMP-100" })          → product code PUMP-100
2. revision_list({ product: "PUMP-100" })          → A, B
3. bom_get({ product: "PUMP-100", revision: "A" }) → SEAL-03 qty 2
4. bom_get({ product: "PUMP-100", revision: "B" }) → SEAL-03B qty 2
5. change_list({ product: "PUMP-100" })            → CHG-2041
6. change_get({ id: "CHG-2041" })                  → reason and approvers
7. Answer with citations to the records above.
```

The agent's answer is only as good as the records. The value of the MCP server is that the records are authoritative, permission-checked and citable.

## Next steps

- [API reference](/reference/api) — the underlying interface
- [Core modules](/guide/core-modules) — the data model
- [Configuration](/reference/config) — MCP settings
- [PieKBS](https://pieteams.github.io/piekbs/) — knowledge for agents
