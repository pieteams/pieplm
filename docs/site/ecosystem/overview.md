# Ecosystem Overview

PiePLM is not intended to be an all-in-one suite. It is designed to sit between engineering files, enterprise systems and AI agents, exposing a small, documented surface that other tools can use.

This page describes the intended ecosystem: the systems around PiePLM, the integration styles, and the standards the project prefers.

## Where PiePLM sits

```text
CAD / Office files        ERP / purchasing        Quality systems
        │                       │                       │
        └───────────┬───────────┴───────────┬───────────┘
                    ▼                       ▼
              ┌─────────────────────────────────┐
              │            PiePLM               │
              │  products, revisions, BOM,      │
              │  changes, requirements          │
              └───────────────┬─────────────────┘
                              │ API / MCP
                ┌─────────────┴─────────────┐
                ▼                           ▼
          BI / reporting               AI agents
```

PiePLM owns the product definition and its change history. It does not own finance, procurement, manufacturing execution or the file authoring tools. Those systems keep their own responsibilities and exchange data through interfaces.

## Integration styles

### REST API

The primary integration path. Downstream systems read products, revisions, BOMs and changes through `/api/v1`. Writes are limited to the operations a module explicitly supports, with authentication and audit.

### Webhooks and events

State changes publish events: revision released, change approved, document attached, non-conformance opened. Consumers can subscribe rather than poll. The initial design favours at-least-once delivery with an idempotent consumer, and a replay window for missed events.

### File exchange

Manufacturing supply chains still exchange files. The intended support covers:

- **STEP (ISO 10303)** for CAD geometry exchange, where a viewer or converter is available
- **PDF** for controlled documents such as drawings and specifications
- **CSV / XLSX** for import and export of product and BOM data
- **ZIP bundles** for exporting a revision with its documents and BOM

File exchange is a boundary, not a data model. Imported files become attachments with checksums; imported tabular data is validated before it creates records.

### MCP

AI agents access the same domain model through the Model Context Protocol. Read-only tools are the default; write tools require an explicit scope and never approve. See [MCP integration](/guide/mcp-integration).

## Standards

PiePLM prefers open, inspectable formats:

| Concern | Standard |
| --- | --- |
| API description | OpenAPI 3.1 |
| Identity | OIDC for human login; scoped bearer tokens for machines |
| Errors | RFC 9457 problem details |
| Timestamps | RFC 3339, UTC |
| Documents | PDF/A where archival is required; original format retained |
| Geometry exchange | STEP where applicable |
| Agent tools | Model Context Protocol |

Where a standard is not practical for a small team, the project documents the deviation rather than inventing a private format silently.

## Related PieTeams projects

### PieMDM

PieMDM governs master data across systems: customers, suppliers, materials, organisations and reference dictionaries. PiePLM and PieMDM overlap at product and supplier identity.

The intended boundary:

- **PieMDM** is authoritative for shared master data used by many systems.
- **PiePLM** is authoritative for the product definition, revision content and change history.
- A link table maps a PiePLM product to a PieMDM product record; neither copies the other's full record.

### PieKBS

PieKBS distills documents into a searchable Markdown wiki for agents. PiePLM stores structured records; PieKBS stores narrative knowledge and source documents.

A combined flow might look like:

1. A specification is attached to a PiePLM revision.
2. PieKBS distills the specification into a source note and updates related concept pages.
3. An agent searches PieKBS for design rationale, then reads PiePLM for the authoritative revision and BOM.

The separation is deliberate. Structured records and curated knowledge have different lifecycles, permissions and failure modes.

## What is not planned

To keep scope honest, the following are not part of the initial ecosystem:

- a marketplace of paid plugins
- a proprietary file format
- a hosted SaaS offering operated by the project
- certification or compliance guarantees
- a replacement for an ERP, MES or CRM

Third parties are welcome to build on the API. The project will document the contract, not operate an app store.

## Getting involved

Integration proposals are welcome as GitHub issues. Describe the system, the data you need to exchange, the direction of flow and the volume. A concrete example is more useful than a vendor name.

## Next steps

- [Integrations](/ecosystem/integrations) — specific system categories
- [Community](/ecosystem/community) — how to follow and contribute
- [API reference](/reference/api) — the contract
