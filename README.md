# skemabase

## Description
Define database schemas using plain English.  
Parse skemabase into JSON IR, SQL DDL, ORM migrations, and diagrams.

## Features
- Plain-English schema statements  
- Entities, attributes, relationships, constraints  
- Optional type annotations, nullability, defaults, unique keys  
- One-to-one, one-to-many, many-to-many relationships  
- JSON intermediate representation  
- SQL DDL generation for PostgreSQL, MySQL, SQLite  
- ORM migration templates (Rails, Django, SQLAlchemy)  
- Graphviz DOT diagram output  
- CLI and JavaScript SDKs  

## Syntax
```
<Entity> has attributes: <name>[:<type>] [unique] [not null] [default <expr>], …
<Entity> has many <Target>
<Entity> has one <Target>
<Entity> belongs to <Target>
<Entity> has and belongs to many <Target>
```

### BNF Grammar
```
<Schema>       ::= <Statement>*
<Statement>    ::= <EntityDecl> | <AttrDecl> | <RelDecl>
<EntityDecl>   ::= <Identifier>
<AttrDecl>     ::= <Identifier> "has attributes:" <AttrList>
<AttrList>     ::= <Attr> ("," <Attr>)*
<Attr>         ::= <Name> [":" <Type>] ["unique"] ["not null"] ["default" <Expr>]
<RelDecl>      ::= <Identifier> <RelType> <IdentifierList>
<RelType>      ::= "has many" | "has one" | "belongs to" | "has and belongs to many"
<IdentifierList> ::= <Identifier> ("," <Identifier>)*
```

## Installation

### CLI
```bash
npm install -g skemabase-cli
```

### JavaScript SDK
```bash
npm install skemabase-js
```


## Quickstart

### Parse CLI
```bash
skemabase parse schema.sb --output schema.json
```

### Generate SQL
```bash
skemabase generate sql schema.sb --dialect postgresql --output schema.sql
```
### Version
```bash
$ skemabase --version
0.1.0
```
Supports relationships defined in the schema (has_many, has_one, belongs_to, has and belongs to many).

### Use JavaScript
```js
import { parse, generateSQL } from 'skemabase-js';

const text = `User has attributes: username, email unique
User has many posts`;
const ir = parse(text);
const sql = generateSQL(ir, { dialect: 'postgresql' });
console.log(sql);
```

## Examples
See `examples/` directory for sample schemas and generated outputs.

## Contributing
Follow code style in `CONTRIBUTING.md`.  
Submit pull requests against `main` branch.

## Roadmap
Please start a new branch for each phase or feature (e.g., `phase-2/schema-parser`) before beginning work.  
Future work and detailed phase-by-phase tasks are tracked in `todo.md`.  
Refer to `todo.md` for the current status of Phase 2 and beyond.

## Developer Documentation
### Parsing Pipeline
1. Tokenization (src/tokenizer.js): splits each non-empty line into tokens (words, punctuation, literals).
2. AST Generation (src/parser.js): transforms token arrays into AST statements (AttrDecl, RelDecl), with detailed syntax error reporting.
3. IR Conversion (src/astToIR.js): aggregates AST statements into the JSON Intermediate Representation (IR) used by downstream SQL/ORM generators.

For large schemas, consider tuning or streaming parsing and optimizing the IR converter to minimize memory churn and lookups.
 
## CLI Reference
See [CLI Reference](docs/CLI.md) for full usage of the `skemabase` command-line tool.
## License
MIT License.  
See `LICENSE` for details.
```

