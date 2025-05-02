Migration Examples
==================

This folder contains two schema snapshots for demonstrating migrations with the SkemaBase CLI.

Files:
- first.sb: Initial schema definition.
- second.sb: Updated schema with a new `email` attribute.

Generate migrations using the CLI (run these inside this folder):
```bash
# Change to the examples/migration directory
cd examples/migration

# Initial migration from empty schema to first snapshot
skemabase migrate create initial --to first.sb

# Diff migration from first snapshot to second snapshot
skemabase migrate create add_email --from first.sb --to second.sb
```

Preview SQL for all migrations:
```bash
skemabase migrate up --dry-run
```
See the generated SQL in `all_up.sql`.

Rollback migrations:
```bash
skemabase migrate down 2 --dry-run
```
See the generated SQL in `all_down.sql`.