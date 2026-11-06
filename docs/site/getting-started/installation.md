# Installation

PiePLM has not published an executable release yet, so there is no install command to run today. This page documents the intended installation model and the prerequisites the project is designing for. It is written so that you can evaluate the operational burden before the first release.

## Design goal: one server, few moving parts

The target deployment is a single Go service plus PostgreSQL. No message broker, no Kubernetes operator and no external search cluster are required for the core product. A small manufacturer should be able to run the system on one modest server, or on a laptop for evaluation.

Optional components are exactly that — optional:

| Component | Required | Purpose |
| --- | --- | --- |
| PiePLM service | Yes | API, workflow, search and web UI delivery |
| PostgreSQL 15+ | Yes | Relational data, full-text search, audit history |
| Object storage (S3-compatible or local disk) | No | Large CAD files and attachments |
| Reverse proxy | No | TLS termination and host routing |
| PieKBS | No | Distilled document knowledge for agents |
| PieMDM | No | Shared master data for products and suppliers |

## Prerequisites

- A Linux server, macOS machine or Windows machine with Docker, or a Go toolchain for building from source
- PostgreSQL 15 or newer
- 2 CPU cores and 4 GB RAM for a small team; more for large file storage
- A backup destination for the database and attachment volume

For the intended Docker path, the only host requirement should be a working Docker Engine and Docker Compose. For the source path, Go 1.25+ is the target toolchain.

## Intended deployment options

### Docker Compose

The repository will ship a Compose file with the service and a PostgreSQL container. Configuration is provided through environment variables and a mounted configuration file. This is the recommended path for evaluation and for small production deployments.

### Single binary

The service is intended to compile to one binary with the web assets embedded. This suits teams that already operate PostgreSQL and prefer to manage the process with systemd or a similar supervisor.

### Managed PostgreSQL

If your organisation already runs a managed PostgreSQL service, point PiePLM at it. The database is the only stateful dependency; attachments can live on local disk or in object storage.

## Planned first-run sequence

The first release is intended to follow this sequence. Treat it as a design description, not as commands to copy.

1. Start PostgreSQL and create a database for PiePLM.
2. Provide the database connection, a server secret and an admin bootstrap account through environment variables.
3. Start the service. On first boot it applies migrations and creates the initial schema.
4. Sign in with the bootstrap account and change the password immediately.
5. Create an organisation, a business unit and the first user accounts.
6. Configure authentication (local accounts initially; OIDC is a later milestone).
7. Create a product and attach the first document.
8. Configure a change workflow and an approval role.

## Configuration philosophy

Configuration should be explicit, documented and environment-overridable. The intended conventions are:

- `PIEPLM_` prefix for environment variables
- a YAML file for structured settings, with environment variables taking precedence
- secrets never stored in the repository
- a `/healthz` endpoint for liveness and a `/readyz` endpoint for database readiness

The [configuration reference](/reference/config) describes the intended settings in detail.

## Verification

When a release exists, installation should be verifiable without reading source code:

- the service starts and reports a healthy database connection
- migrations complete without manual SQL
- an administrator can sign in and create a product
- the API returns the created product through a documented endpoint

If any of these fail, the release is not ready for production.

## Upgrades and backups

The intended upgrade path is forward-only migrations shipped with each release. Before upgrading:

1. Back up the PostgreSQL database.
2. Back up the attachment volume or object storage prefix.
3. Read the release notes for migration warnings.
4. Apply the release and run the migration command once.
5. Verify health and sign in.

There is no supported downgrade path in the initial design. This is a deliberate constraint: reversible migrations are difficult to guarantee and easy to get wrong.

## What is explicitly out of scope

To keep the first release small, the following are not planned for the initial version:

- high-availability clustering
- multi-region replication
- a plugin marketplace
- a mobile application
- CAD file authoring

The system should integrate with those concerns rather than reimplement them.

## Next steps

- [Quick start](/getting-started/quick-start) — the intended first product workflow
- [Configuration](/reference/config) — settings and environment variables
- [Architecture](/guide/architecture) — the component model
- [GitHub repository](https://github.com/pieteams/pieplm) — current status and milestones
