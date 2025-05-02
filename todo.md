# TODO

This document outlines the high-level roadmap for building SkemaBase, a tool that
lets you define database schemas in plain English and generate JSON IR, SQL DDL,
ORM migrations, and diagrams.

## Feature 1 - Migration Strategy
Below is the detailed plan leveraging ActiveRecord-style reversible migrations:

- [x] Define Migration-IR types (`Migration`, `Op`) and JSDoc for each
- [x] Scaffold `diffSchemas(oldIR, newIR)` to emit reversible ops (`createTable`, `dropTable`, etc.)
- [x] Write Jest tests for `diffSchemas` covering entity add/remove scenarios
- [x] Extend SQL generator to translate Migration-IR ops into up/down SQL DDL
- [x] Integrate new CLI commands:
  - `skemabase migrate init` (bootstraps migrations folder/config)
  - `skemabase migrate create <name> [--from <old>.json --to <new>.json]`
  - `skemabase migrate up|down [<n>]` with `--dry-run`, `--dialect`, `--url`
- [x] Add documentation, examples, and update README/CLI docs
