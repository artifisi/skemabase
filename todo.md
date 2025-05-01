# TODO

This document outlines the high-level roadmap for building SkemaBase, a tool that
lets you define database schemas in plain English and generate JSON IR, SQL DDL,
ORM migrations, and diagrams.

---
## Phase 1: Testing & CI/CD
- [x] Set up Jest (JS)
- [x] Add linting and formatting (ESLint, Prettier)
- [x] Configure GitHub Actions for build, test, and publish workflows
- [x] Monitor code coverage and enforce thresholds

## Phase 2: Core Parsing & IR
- [x] Formalize grammar (BNF) for schema statements
- [x] Implement lexer/tokenizer
- [x] Build parser to emit an AST from tokens
- [x] Define JSON Intermediate Representation (IR) schema
- [x] Serialize AST to JSON IR and back
- [x] Write unit tests for parsing and IR generation

## Phase 3: SQL Generation (MVP)
- [x] Design mapping from IR to SQL DDL constructs
- [x] Implement SQL generator for PostgreSQL
- [x] Add support for SQLite
- [x] Create SQL generator tests (round-trip IR → SQL → IR)
- [x] Integrate `generate sql` command in CLI

## Phase 4: Relationships & Constraints
- [x] Extend IR to represent relationships (1:1, 1:N, N:M)
- [x] Emit foreign keys, join tables, and constraints in SQL
- [x] Support unique, not null, default value annotations
- [x] Write integration tests for relational scenarios

## Phase 5: ORM Migration Templates
- [ ] Rails ActiveRecord migration template
- [ ] Django migrations template
- [ ] SQLAlchemy/Alembic migration template
- [ ] Sample migration outputs in `examples/`
- [ ] Tests for ORM template correctness

## Phase 6: Command-Line Interface
- [ ] Scaffold CLI package (Node.js)
- [ ] Implement `skemabase parse <file> --output <json>`
- [ ] Implement `skemabase generate` subcommands (sql, orm, diagram)
- [ ] Add help, version, and error handling
- [ ] Publish CLI to npm

## Phase 7: SDKs & Language Bindings
### JavaScript SDK
- [ ] Initialize `skemabase-js` package
- [ ] Expose `parse()`, `generateSQL()`, `generateORM()`, `generateDiagram()` APIs
- [ ] Write usage examples and tests
- [ ] Publish to npm


## Phase 8: Diagram Generation
- [ ] Implement IR-to-Graphviz DOT generator
- [ ] Integrate `--diagram` flag in CLI and SDKs
- [ ] Create example ER diagrams in `examples/`
- [ ] Write tests for DOT output

## Phase 9: Examples, Docs & Tutorials
- [ ] Populate `examples/` with schema files and generated artifacts
- [ ] Update README with quickstart and detailed usage
- [ ] Write comprehensive documentation (user guide, API reference)
- [ ] Create CONTRIBUTING.md and style guide

## Phase 10: Releases & Maintenance
- [ ] Adopt semantic versioning (SemVer)
- [ ] Create CHANGELOG.md and release process
- [ ] Plan feature roadmap and backlog grooming
- [ ] Solicit community feedback and contributionsle