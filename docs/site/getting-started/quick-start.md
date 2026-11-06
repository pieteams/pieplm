# Quick Start

This walkthrough describes the intended first-run experience of PiePLM. Because the project is still in the design phase, the shapes below illustrate the model and the planned API; they are not yet executable instructions.

The goal of the walkthrough is to show how the pieces fit together. A new team should be able to create one product, attach its documents, define a simple bill of materials, submit a change and read the result through the API.

## Before you begin

You need:

- a running PiePLM instance (see [Installation](/getting-started/installation))
- an administrator account
- one product to model, ideally a real one from your team
- one drawing or specification file
- one bill of materials, even if it is currently a spreadsheet

Do not start with your entire catalogue. Start with one product whose information is currently causing confusion.

## 1. Create the organisation and users

The first account is the bootstrap administrator. It should create:

- an **organisation** — the legal or operational entity that owns the data
- a **business unit** — the team responsible for the product
- **users and roles** — at minimum an engineer, a reviewer and an administrator

Roles determine who may create, edit, review and approve. Keep the initial role set small: `admin`, `engineer`, `reviewer`, `viewer`.

## 2. Create a product

A product is the stable identity. It has a code, a name, a description, a lifecycle state and an owner. It does not contain revision-specific data directly; revisions do.

Intended resource shape:

```json
{
  "code": "PUMP-100",
  "name": "Coolant pump",
  "description": "12 V centrifugal pump for the compact chiller range",
  "lifecycleState": "development",
  "owner": "engineering.team"
}
```

The code should be the identifier your organisation already uses. PiePLM should not force a new numbering scheme.

## 3. Create revision A

A revision is a snapshot of the product definition. The first revision is usually `A` or `1`. It records:

- the revision identifier
- the effective date or effectivity rule
- the design documents attached
- the BOM items that make up the product
- the approval state

Creating a revision should be an explicit action, not an implicit side effect of editing a document.

## 4. Attach documents

Upload the drawing, specification and any test report. Each attachment records:

- file name, media type, size and checksum
- the revision it belongs to
- who uploaded it and when
- an optional document type (drawing, specification, test report, certificate)

Files may live on local disk or in object storage. The database stores the metadata and the reference, not the binary.

## 5. Define a simple BOM

A BOM is a tree of items. Each item references either a part or another product, with a quantity, unit and optional reference designator. For the first pass, keep it shallow:

```text
PUMP-100 rev A
├── HOUSING-01        qty 1
├── IMPELLER-02       qty 1
├── SEAL-03           qty 2
└── MOTOR-12V-04      qty 1
```

The important property is that each line has an identity and a revision context. A BOM line is not a row in a spreadsheet that can be edited without history.

## 6. Submit a change

Suppose the seal material changes. The team creates a change request:

- **What** — replace `SEAL-03` with `SEAL-03B`
- **Why** — improved resistance to the coolant additive
- **Impact** — affects revision A and the service kit
- **Approval** — engineering lead and quality manager

The change request is reviewed, approved and then applied to create revision B. The old revision remains readable. The relationship between the change and the new revision is explicit.

## 7. Read through the API

The intended read model is a documented REST API. A representative request:

```http
GET /api/v1/products/PUMP-100/revisions/A/bom
Authorization: Bearer <token>
```

An agent using MCP would call the equivalent tool, for example `bom_get`, with the product code and revision. Read-only access is the default for agent credentials.

## 8. Verify the history

The point of the exercise is not the data entry. It is the history:

- Which revision is current?
- Which change created it and who approved it?
- Which documents belong to the old revision?
- Which supplier parts are affected by the change?

If the system cannot answer these questions without a meeting, the model or the workflow is incomplete.

## A realistic first milestone

Do not attempt every module in the first week. A reasonable first milestone is:

1. One product with two revisions
2. Three documents attached
3. A ten-line BOM
4. One approved change request
5. One API client, even a shell script, reading the current revision

That milestone proves the data model and the workflow. Everything else can be added incrementally.

## Next steps

- [Core modules](/guide/core-modules) — the functional boundaries
- [Architecture](/guide/architecture) — how the service is structured
- [API reference](/reference/api) — the intended interface
- [MCP integration](/guide/mcp-integration) — agent access
