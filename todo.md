# TODO

This document outlines the high-level roadmap for building SkemaBase, a tool that
lets you define database schemas in plain English and generate JSON IR, SQL DDL,
ORM migrations, and diagrams.

---
## Feature: Mermaid ER Diagram Generator

Generate entity-relationship (ER) diagrams in Mermaid syntax from the JSON IR.

Tasks:
- [x] Design mapping from IR entities and relationships to Mermaid ER diagram syntax
- [x] Implement `generateMermaidDiagram(ir, options)` in `skemabase-js/src/diagramMermaid.js`
- [x] Add public API entry point in `skemabase-js/src/index.js`
- [x] Expose CLI flag `skemabase generate diagram --format mermaid [--output <file>]`
- [x] Write Jest unit tests in `skemabase-js/tests/diagramMermaid.test.js` covering:
  - Single-entity schemas
  - One-to-many, one-to-one, many-to-many relationships
  - Attribute display (types, nullability, defaults)
- [x] Update `docs/CLI.md` and `README.md` with examples and usage instructions
