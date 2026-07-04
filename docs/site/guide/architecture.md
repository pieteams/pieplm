# Architecture

PiePLM follows a modular, layered architecture designed for extensibility and maintainability.

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Web UI (React)                          │
├─────────────────────────────────────────────────────────────┤
│                      REST API / gRPC                         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────┐  │
│  │Requirements│ │  Design  │ │   BOM    │ │   Changes      │  │
│  │  Module   │ │ Module   │ │ Module   │ │  Module        │  │
│  └──────────┘ └──────────┘ └──────────┘ └────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    Core Services Layer                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────┐  │
│  │  Search  │ │  Auth    │ │  Events  │ │  Notifications │  │
│  │  Engine  │ │  Service │ │  Bus     │ │  Service       │  │
│  └──────────┘ └──────────┘ └──────────┘ └────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    Data Layer (PostgreSQL)                     │
└─────────────────────────────────────────────────────────────┘
```

## Core Principles

### 1. Single Binary
- Pure Go implementation (no CGO dependencies)
- PostgreSQL for reliable data storage
- Easy deployment and distribution

### 2. Modular Design
Each domain (requirements, designs, BOM, changes) is a self-contained module with:
- Independent data models
- REST/gRPC interfaces
- Event publishing
- Extension points

### 3. AI-Native Integration
- Built-in vector search + embeddings
- MCP (Model Context Protocol) server
- LLM-ready APIs for agent integration

### 4. Local-First
- Works offline by default
- Optional cloud sync
- Data ownership stays with you

## Technology Stack

| Layer | Technology |
|-------|------------|
| Language | Go 1.25+ |
| Database | PostgreSQL |
| Search | Full-text search + vector embeddings |
| API | REST + gRPC + MCP |
| Web UI | React + Vite |
| Build | Go modules + esbuild |

## Data Flow

1. **Input** - CLI, Web UI, API, MCP tools, file watchers
2. **Processing** - Validation, enrichment, embedding generation
3. **Storage** - PostgreSQL (relational + full-text) + vectors
4. **Indexing** - Real-time search index updates
5. **Output** - Search results, notifications, webhooks, AI agents

## Extension Points

- **Plugins** - Custom modules via Go plugins
- **Webhooks** - Event-driven integrations
- **MCP Tools** - AI agent capabilities
- **Templates** - Document & workflow templates

## Next Steps

- [Core Modules](/guide/core-modules) - Domain module details
- [Search Engine](/guide/search-engine) - How search works
- [MCP Integration](/guide/mcp-integration) - AI agent setup