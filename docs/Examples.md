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

You can use these examples as a starting point or reference for your own schemas.