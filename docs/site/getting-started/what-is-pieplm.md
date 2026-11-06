# What is PiePLM?

**PiePLM** is an open, documentation-first blueprint for product lifecycle management in small and mid-sized manufacturers. It defines a narrow, low-burden system for keeping requirements, designs, bills of materials, changes, quality records and supplier data coherent.

PiePLM is currently in the **design and documentation phase**. The public repository contains the problem statement, market research, architecture notes and module design, not an executable release. This page explains what the project intends to be and, just as importantly, what it does not.

## The problem

Traditional PLM systems present significant challenges for SMEs:

- **High costs** — licensing, implementation and ongoing maintenance priced for large organisations
- **Complexity** — long rollouts, specialist administrators and rigid processes
- **Rigid architecture** — difficult to adapt to a small team's actual workflow
- **Data silos** — product information fragmented across drives, spreadsheets and the ERP

The result is predictable. Drawings and BOMs drift apart. Change reasons are lost. Supplier records are duplicated. Audits become manual investigations. The company knows it has a problem, but the available software is larger than the company itself.

## The intended solution

PiePLM addresses the problem with a deliberately narrow scope:

| Capability | What it means in practice |
| --- | --- |
| **Product identity** | One record per product, with a clear owner and lifecycle state |
| **Revision snapshots** | Released revisions are immutable; changes create new revisions |
| **Document control** | Drawings, specifications and reports attached to a revision with checksums |
| **Structured BOM** | A versioned tree, not a spreadsheet attachment |
| **Governed change** | Requests record reason, impact, approvals and the resulting revision |
| **Requirements traceability** | Requirements linked to design and test evidence |
| **Quality and supplier links** | Non-conformances and suppliers reference the affected product and revision |
| **API and MCP** | The same contract serves the UI, integrations and AI agents |

Notice what is absent: portfolio management, programme governance, simulation data management, multi-site configuration and a plugin marketplace. Those are legitimate PLM concerns, but they are not the first problem a thirty-person manufacturer needs to solve.

## Design philosophy

1. **Narrow before broad.** Solve one product record, one BOM and one change flow well before adding modules.
2. **Explicit over implicit.** Relationships use identifiers and versioned records, not folder names and email threads.
3. **Boring infrastructure.** Go and PostgreSQL, deployable on one server. No mandatory message broker or search cluster.
4. **Readable data.** Schema, migrations and API definitions live in the repository. Export is always possible.
5. **Safe automation.** Agents get read-only access by default. A machine may prepare a change; a human approves it.
6. **Honest documentation.** A design document should not pretend to be a shipped product.

## How it relates to the other PieTeams projects

- [PieMDM](https://pieteams.github.io/piemdm/) governs master data such as products, suppliers and materials across systems. PiePLM focuses on the product definition and its lifecycle.
- [PieKBS](https://pieteams.github.io/piekbs/) distills documents into a searchable knowledge base for agents. PiePLM stores authoritative structured records; PieKBS stores narrative knowledge and source material.

They can be adopted independently. When combined, they form a chain from product definition to governed master data to searchable knowledge.

## Status and roadmap

The project is working through design milestones:

1. Problem statement and scope (published)
2. Market and system survey (published on this site)
3. Architecture and module boundaries (published)
4. Data model and API specification (in progress)
5. Implementation of the core modules (not started)
6. Docker-based reference deployment (planned)

Milestones and design discussions are tracked in the [GitHub repository](https://github.com/pieteams/pieplm). Dates are not promised; the project is maintainer-led and open to contributions.

## Who it is for

- **Manufacturing SMEs** evaluating whether an open alternative to a commercial PLM suite is credible
- **PLM consultants** who need a lightweight reference model for small clients
- **Developers** interested in contributing to an open PLM implementation
- **Technical teams** that want to understand the problem before buying software

## Next steps

- [Installation](/getting-started/installation) — the intended deployment model
- [Quick start](/getting-started/quick-start) — the intended first workflow
- [Architecture](/guide/architecture) — the system design
- [Core modules](/guide/core-modules) — module boundaries
- [PLM systems](/getting-started/plm-systems) — the commercial landscape
