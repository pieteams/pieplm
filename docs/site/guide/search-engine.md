# Search Engine

PiePLM needs search for two different audiences: people looking for a product, document or change, and agents looking for evidence. Both need results that are relevant, permission-aware and explainable. This page describes the intended search design.

## Baseline: PostgreSQL full-text search

The default search implementation uses PostgreSQL, not an external search cluster. This keeps deployment to one stateful service and avoids an index that can drift out of sync with the database.

The core pieces:

- a `tsvector` column for each searchable entity
- a GIN index on the vector
- a text search configuration appropriate to the content language
- triggers or application code that refresh the vector on write

For English content, PostgreSQL's built-in `english` configuration handles stemming and stop words. For Chinese content, the `simple` configuration is not sufficient; a segmenter such as `pg_jieba` or `zhparser` is needed. The intended deployment documents an optional extension and falls back to `simple` with bigram indexing if the extension is unavailable.

## What is indexed

Not every column should be searchable. The index covers the fields a user would actually type:

| Entity | Indexed fields |
| --- | --- |
| Product | code, name, description, tags |
| Revision | revision label, note, release status |
| Document | file name, title, document type, extracted text |
| BOM | part code, part name, reference designator |
| Change | title, reason, affected items |
| Supplier | name, code, contact description |
| Quality | title, description, disposition |

Binary CAD files are not text-extracted in the initial design. Their metadata and file names are searchable; content extraction is a later integration.

## Ranking

Raw full-text matching answers “does this document contain the words?” It does not answer “which result should I read first?” Ranking combines several signals:

- **Lexical relevance** — `ts_rank_cd` or a BM25-style score
- **Exact match boost** — a product code or error identifier matched verbatim ranks higher
- **Recency** — recently updated records rank higher, all else equal
- **Entity type weight** — products and revisions usually outrank attachments
- **Link popularity** — documents referenced by many changes or requirements rank higher
- **Lifecycle state** — obsolete products are demoted unless the query asks for them

The weights are configuration, not hard-coded constants. A small manufacturer may care more about recency; a regulated manufacturer may care more about approved revisions.

## Optional vector channel

Semantic search helps when the query uses different words from the source: “cooling pump” versus “coolant pump”, or a paraphrased requirement. The intended design supports an optional vector channel using `pgvector`.

Two rules keep it honest:

1. **Vector search does not replace lexical search.** Exact identifiers matter in manufacturing, and embeddings are weak on codes.
2. **Results are fused, not concatenated.** Reciprocal rank fusion (RRF) combines the two ranked lists without requiring comparable scores.

```text
lexical results ─┐
                 ├─ RRF ─ ranked results
vector results ──┘
```

Embeddings are generated for chunks of document text and for product and change descriptions. The model identifier is stored alongside the vector so that a re-embedding can be planned when the model changes.

## Permission-aware results

Search must not leak data across organisations, business units or roles. Two approaches are possible:

- **Filter after retrieval** — simple, but can return fewer results than requested and leaks timing information.
- **Filter during retrieval** — the query includes the caller's scope before ranking.

PiePLM intends to filter during retrieval by joining the caller's scope into the query. A result the caller may not read should never be scored, counted or returned.

PostgreSQL row-level security is a candidate for enforcing this at the database layer, with application-level checks as defence in depth. The trade-off is complexity; the decision will be documented in the repository.

## Freshness and reindexing

Search results are only useful if they reflect the current data. The design prefers synchronous index updates for small writes and a background job for bulk reindexing:

- create, update and delete refresh the entity's vector in the same transaction
- bulk import and model changes trigger a batched reindex
- a checksum or version column detects drift
- a maintenance command rebuilds the index from source data

There is no separate search service to keep alive. The database is the index.

## Query API

The planned search endpoint accepts a query, optional filters and a limit:

```http
GET /api/v1/search?q=coolant+pump&type=product,document&state=active&limit=20
```

Filters include entity type, lifecycle state, owner, revision and date range. Results include a snippet, the entity type, the identifier and a score explanation for debugging.

Agents use the same search through MCP (`product_search`, `document_search`). The tool response includes the fields an agent needs to decide whether to read the full record.

## Evaluation

Search quality should be measured, not asserted. The intended approach:

- a small labelled query set from real user questions
- precision at k and recall at k for each entity type
- latency percentiles for typical and worst-case queries
- a regression run before changing weights or the tokenizer

A search feature without an evaluation set is a guess. The repository will include a fixture corpus and a query file so that changes can be compared.

## Failure modes to avoid

- **Index drift** — the index says a document exists but the row was deleted.
- **Over-boosting codes** — every code matches, so ranking becomes meaningless.
- **Language mismatch** — Chinese content indexed with an English stemmer.
- **Permission leaks** — a snippet reveals a record the caller cannot open.
- **Silent truncation** — a limit returns partial results with no indication.

Each of these is testable. Each should have a test before the feature is considered complete.

## Next steps

- [Architecture](/guide/architecture) — where search sits
- [Core modules](/guide/core-modules) — what is indexed
- [MCP integration](/guide/mcp-integration) — agent access
