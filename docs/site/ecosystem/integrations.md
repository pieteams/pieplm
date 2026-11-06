# Integrations

PiePLM is designed to exchange data with the systems a manufacturer already runs. This page describes the intended integration categories, the direction of data flow and the constraints that keep the integration honest.

The project is in the design phase; specific connectors are not implemented yet. The patterns below define what a connector must respect.

## Integration principles

- **One source of truth per entity.** PiePLM owns the product definition and change history. It does not become a second copy of the ERP.
- **Explicit mapping.** Identifiers are mapped in a table, not inferred from names. A product code in PiePLM maps to a material number in the ERP, and the mapping is visible.
- **Idempotent exchange.** Every import can be replayed without creating duplicates. Records carry an external key and a checksum.
- **Reversible failures.** A failed import leaves no partial records. Batches are staged, validated and committed atomically.
- **Observable sync.** Every exchange records a timestamp, a count and an error summary that an operator can inspect.

## CAD and design tools

PiePLM does not author CAD files. The intended integration is file-based and metadata-based:

- attach exported STEP, PDF and native files to a revision
- record the source application and version in the attachment metadata
- compute and store a checksum to detect silent changes
- optionally extract metadata such as part number and title from STEP headers

A live CAD plugin is out of scope for the initial design. It requires a per-vendor plugin, a desktop runtime and a support burden the project cannot carry yet.

## ERP and procurement

The ERP remains authoritative for purchase orders, inventory, costs and supplier invoices. PiePLM exchanges:

| Direction | Data |
| --- | --- |
| ERP → PiePLM | Material master references, supplier identity, unit costs (optional) |
| PiePLM → ERP | Released BOM for a revision, effectivity dates, change notices |
| Both | Identifier mapping and sync status |

The BOM export must be revision-aware. Sending “the BOM” without a revision is the integration bug that causes manufacturing to build the wrong configuration.

## Quality systems

Quality systems own non-conformances, audits and regulatory submissions. PiePLM links to them rather than replacing them:

- a non-conformance record references the product and revision
- a corrective action references the change that resolves it
- an audit can query the revision history and approvals

If the quality system is the authoritative source, PiePLM stores a reference and a summary, not a full copy.

## PieMDM

PieMDM governs shared master data. The intended integration is a link, not a merge:

- PiePLM product ↔ PieMDM product record
- PiePLM supplier reference ↔ PieMDM supplier record
- shared reference data (units, countries, categories) read from PieMDM

The mapping table records which system is authoritative for which fields. A field-level ownership matrix prevents the classic failure where two systems overwrite each other.

## PieKBS

PieKBS provides searchable distilled knowledge for agents. The integration is one-directional:

- PiePLM publishes document metadata and, where permitted, document text to a PieKBS raw directory or ingestion endpoint
- PieKBS distills the document and indexes the resulting pages
- agents search PieKBS and read PiePLM for authoritative records

PieKBS never writes back to PiePLM. Knowledge distillation is not a controlled data change.

## CI/CD and engineering tooling

For teams that treat product data as code, the intended integrations are:

- export a revision and BOM as versioned JSON for review in a pull request
- validate the export against a JSON Schema in CI
- publish a release event to a webhook
- compare two revisions programmatically through the API

This is useful for OEMs and engineering teams that already review configuration changes as code.

## Issue trackers

Links to GitHub Issues or Jira are optional. A change request may carry an external issue key for traceability. PiePLM does not attempt to mirror issue status; it stores the key and lets the tracker remain authoritative.

## File storage and backup

Attachments live on local disk or in S3-compatible object storage. The integration contract is simple:

- the database stores metadata and the object key
- object storage stores the binary
- backups capture both consistently
- deletion is soft by default, with a retention window

Do not store large binaries in the database. Do not store metadata only in object tags.

## What a connector must not do

- bypass the API and write directly to tables
- invent identifiers instead of mapping them
- silently drop records that fail validation
- retry without idempotency
- assume a BOM has no revision
- copy personal data from the ERP without a lawful basis

## Proposing an integration

Open an issue with:

1. the system and its version
2. the entities and fields to exchange
3. the direction of flow and expected volume
4. the failure behaviour you need
5. whether you can contribute the connector

A concrete, testable proposal is more likely to be accepted than a request for a vendor logo in a compatibility list.

## Next steps

- [Ecosystem overview](/ecosystem/overview) — the wider picture
- [API reference](/reference/api) — the contract
- [Community](/ecosystem/community) — how to contribute
