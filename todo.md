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


## Phase 5: Command-Line Interface
- [x] Scaffold CLI package (Node.js)
- [x] Implement `skemabase parse <file> --output <json>`
- [x] Implement `skemabase generate sql <file> --dialect <dialect> --output <sql>`
- [x] Add help (`--help`, `-h`) and version (`--version`, `-v`) flags
- [x] Improve error handling (exit codes, messages)

## Phase 6: Examples, Docs & Tutorials
- [x] Populate `examples/` with schema files and generated artifacts
- [x] Update README with quickstart and detailed usage
- [x] Write comprehensive documentation (user guide, API reference)
- [x] Create CONTRIBUTING.md and style guide

## Phase 7: Releases & Maintenance
- [ ] Adopt semantic versioning (SemVer)
- [ ] Create CHANGELOG.md and release process
- [ ] Plan feature roadmap and backlog grooming
- [ ] Solicit community feedback and contributions