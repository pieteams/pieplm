# Core Modules

PiePLM is organised around a small number of domain modules. Each module owns its data, publishes an interface and can be adopted incrementally. The boundaries matter: a module that reaches into another module's tables becomes impossible to replace.

This page describes the intended modules, what each owns and how they interact. The implementation is in progress; the module boundaries are the stable part of the design.

## Module map

| Module | Owns | Depends on |
| --- | --- | --- |
| **Product** | Product identity, lifecycle state, ownership | — |
| **Revision** | Revision snapshots, effectivity, release state | Product |
| **Documents** | Attachments, metadata, checksums, document types | Product, Revision |
| **BOM** | Structured bill of materials, part references, alternates | Product, Revision |
| **Requirements** | Requirements, acceptance criteria, trace links | Product, Revision |
| **Changes** | Change requests, impact analysis, approvals | Product, Revision, BOM |
| **Quality** | Non-conformances, corrective actions, links to revisions | Product, Revision |
| **Suppliers** | Supplier records, approvals, part sourcing | Product |
| **Platform** | Identity, roles, workflow engine, audit log, search | All modules |

## Product

The product module is deliberately thin. It owns the stable identity and the lifecycle state machine (`development`, `active`, `phase-out`, `obsolete`). It does not own revision content.

Why separate product from revision? Because identity and content change at different rates. A product code can exist for a decade; its revision contents change every few months. Mixing them produces either duplicated identities or lost history.

## Revision

A revision is an immutable snapshot once released. It records:

- the revision label (`A`, `B`, `1`, `2`, or a customer-specific scheme)
- effectivity (immediate, date-based or serial-based)
- the documents and BOM that belong to it
- the approval record that released it

Draft revisions may be edited. Released revisions may not. A correction after release creates a new revision through the change module.

## Documents

The document module stores metadata and a reference to a binary. It owns:

- file name, media type, size and checksum
- storage location (local path or object key)
- document type (drawing, specification, test report, certificate, other)
- revision and product association
- upload and review metadata

It does not parse or render CAD files in the initial design. Viewing is delegated to the client or to a later integration.

## BOM

The BOM module owns the product structure:

- lines with stable identifiers
- part or product references
- quantity, unit and reference designators
- alternates and substitutes
- effectivity inherited from the revision

A BOM is versioned with the revision. It is not a floating spreadsheet. Changes to a released BOM must go through the change module, which creates a new revision.

## Requirements

The requirements module captures what the product must do and links it to design and test evidence. A requirement has:

- an identifier and statement
- a category (functional, safety, regulatory, commercial)
- a priority and verification method
- trace links to documents, BOM items and tests

The initial implementation deliberately avoids a full requirements management methodology. The goal is traceability for a small team, not compliance theatre.

## Changes

The change module is the only path to modifying a released revision. A change request records:

- what changes
- why (reason and evidence)
- affected products, revisions, BOM lines and documents
- impact analysis (affected service kits, open orders, suppliers)
- approvals and their timestamps

Approval is a workflow. The workflow engine is a platform service; the change module defines the states and the required roles. When approved, the change produces a new revision and links back to the request.

## Quality

The quality module records non-conformances and corrective actions. Each record links to the product and revision it concerns, which turns quality data into product history rather than an isolated ticket queue.

Out of scope initially: full CAPA workflow, audit management and regulatory submissions. The data model leaves room for them.

## Suppliers

The supplier module stores supplier identity, contact data, qualification status and the parts they supply. It is intentionally not a full procurement system. Purchase orders and invoices belong to the ERP.

## Platform services

The platform module provides cross-cutting capabilities:

- **Identity and access** — users, roles, permissions, API keys
- **Workflow** — states, transitions, approvers, escalation
- **Audit** — append-only record of writes and approvals
- **Search** — cross-entity indexing (see [Search engine](/guide/search-engine))
- **Files** — storage abstraction for attachments

Keeping these services separate prevents each domain module from inventing its own permission model or audit format.

## Adoption order

A pragmatic rollout:

1. Product + Revision + Documents — get one product record right
2. BOM — replace the master spreadsheet
3. Changes — introduce governed change with a lightweight flow
4. Requirements — trace new products only
5. Quality + Suppliers — link existing records to revisions

Each step should be useful on its own. If a step requires three other modules to deliver value, it is scoped too broadly.

## Boundary rules

To keep modules replaceable:

- No module reads another module's tables directly; it calls the interface.
- Shared concerns live in platform services, not copied into each module.
- Events are published for state changes; consumers do not poll tables.
- Each module owns its migrations and its API resources.
- Cross-module reports use read models, not ad hoc joins across ownership boundaries.

These rules cost more upfront than a single monolithic schema. They pay back when the first module is replaced or extracted.

## Next steps

- [Architecture](/guide/architecture) — the layered view
- [API reference](/reference/api) — resource surface
- [Search engine](/guide/search-engine) — indexing across modules
