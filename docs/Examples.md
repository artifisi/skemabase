# Examples

The `examples/` directory contains sample schemas and the corresponding generated outputs.

## basic
- `basic.sb`: Simple schema declaring a single entity and attributes.
- `basic.ir.json`: Parsed JSON IR for the basic schema.
- `basic.sql`: SQL DDL generated from the IR.

## full
- `full.sb`: More comprehensive schema including relationships and constraints.
- `full.ir.json`: Parsed JSON IR for the full schema.
- `full.sql`: SQL DDL generated from the IR.

## twitter
- `twitter.sb`: Twitter-like schema defining Users and Tweets with a one-to-many relationship.
- `twitter.ir.json`: Parsed JSON IR for the Twitter schema.
- `twitter.sql`: SQL DDL generated from the Twitter schema.

## facebook
## facebook
- `facebook.sb`: Facebook-like schema with users, profiles, groups, posts, comments, and likes.
- `facebook.ir.json`: Parsed JSON IR for the Facebook schema.
- `facebook.sql`: SQL DDL generated from the Facebook schema.

## supercomplex
- `supercomplex.sb`: Auto-generated 100-line schema with 50 entities and relationships.
- `supercomplex.ir.json`: Parsed JSON IR for the supercomplex schema.
- `supercomplex.sql`: SQL DDL generated from the supercomplex schema.

## live demo
- `live/index.html`: Interactive web demo where you can edit a SkemaBase schema and see the IR and SQL in real time.

You can use these examples as a starting point or reference for your own schemas.
  
## migrations
This folder contains two schema snapshots under `examples/migration`:
- `first.sb`: Initial schema
- `second.sb`: Updated schema with an additional `email` attribute
  
Generate migrations using the CLI (run inside the `examples/migration` folder):
```bash
# Change to the migration examples directory
cd examples/migration

#! Initial migration from empty schema to first snapshot
skemabase migrate create initial --to first.sb

#! Diff migration from first snapshot to second snapshot
skemabase migrate create add_email --from first.sb --to second.sb
```
  
Preview SQL for all migrations (still inside `examples/migration`):
```bash
skemabase migrate up --dry-run
```
  
Rollback migrations:
```bash
skemabase migrate down 2 --dry-run
```

