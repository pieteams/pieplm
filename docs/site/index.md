---
layout: home

hero:
  name: "PiePLM"
  text: "Product lifecycle management for small manufacturers"
  tagline: An open, documentation-first blueprint for keeping product requirements, designs, BOMs and changes coherent — without a heavyweight PLM suite.
  actions:
    - theme: brand
      text: Read the blueprint
      link: /getting-started/what-is-pieplm
    - theme: alt
      text: Architecture
      link: /guide/architecture
    - theme: alt
      text: GitHub
      link: https://github.com/pieteams/pieplm

features:
  - title: Narrow scope
    details: Product records, requirements, BOMs, changes, quality and suppliers. Portfolio governance and simulation management can wait.
  - title: Revision-aware model
    details: A product is not a file name. Products, revisions, parts and documents have distinct identities and explicit links.
  - title: Governed change
    details: A change request records what changed, why, who is affected and who approved it. History is reconstructed, not remembered.
  - title: API and MCP first
    details: The same documented contract serves the web UI, the ERP integration and an AI agent. No screen-only features.
  - title: Open source
    details: MIT licensed. The model, migrations and API definitions live in the repository and can be reviewed before adoption.
  - title: Honest status
    details: PiePLM is in the documentation and design phase. This site describes the intended system, not a shipped release.
---

## Project status

PiePLM is currently a **design and documentation project**. The public repository contains the problem statement, market research, architecture notes and module design. There is no executable release yet, and this site does not pretend otherwise.

We publish the blueprint early for two reasons: manufacturers can evaluate the proposed model before committing to an implementation, and contributors can challenge the design while changes are still inexpensive.

Implementation milestones will be published in the [GitHub repository](https://github.com/pieteams/pieplm) as they are completed. The documentation will be updated at the same time.

## The problem in one paragraph

A small manufacturer usually manages product information with shared drives, spreadsheets, email and an ERP. Drawings and BOMs drift apart, change reasons are lost, supplier records are duplicated and audits become archaeology. Traditional PLM suites solve this, but they are priced and implemented for organisations with dedicated IT teams and long rollouts. PiePLM explores the narrow, low-burden subset that a small team can actually run.

## Design commitments

- **One product identity.** Every product has one record, one current revision and one owner.
- **Explicit relationships.** Requirements, documents, BOM items and changes are linked by identifiers, not by folder names.
- **Boring infrastructure.** Go and PostgreSQL, deployable on a single server or a laptop.
- **Readable data.** Schema and migrations are versioned; export is always possible.
- **Safety before automation.** Read-only agent access by default; writes require an explicit permission and an approval path.

## Explore

- [What is PiePLM](/getting-started/what-is-pieplm) — the problem, scope and design philosophy
- [Installation](/getting-started/installation) — the intended deployment model
- [Quick start](/getting-started/quick-start) — the first product record, end to end
- [Architecture](/guide/architecture) — layers, modules and data flow
- [PLM systems](/getting-started/plm-systems) — the commercial landscape
- [PieTeams projects](https://pieteams.github.io/projects) — how PiePLM relates to PieMDM and PieKBS
