 # SkemaBase CLI Reference
 
 The `skemabase` command-line tool lets you parse schema files and generate SQL DDL.
 
 ## Installation
 ```bash
 npm install -g skemabase-cli
 ```
 
 ## Commands
 
## Global Options
-- `--help`, `-h`    Show help message
-- `--version`, `-v` Show CLI version

Example:
```bash
$ skemabase --version
0.1.0
```

### parse
 Parse a plain-English schema file into JSON IR.
 
 Usage:
 ```bash
 skemabase parse <input.sb> [--output <output.json>]
 ```
 
 Options:
 - `--output`, `-o`  Path to write JSON output. Defaults to stdout.
 
 Example:
 ```bash
 skemabase parse schema.sb --output schema.json
 ```
 
 ### generate sql
 Generate SQL DDL for a schema file.
 
 Usage:
 ```bash
 skemabase generate sql <input.sb> [--dialect <dialect>] [--output <output.sql>]
 ```
 
 Options:
 - `--dialect`, `-d`  SQL dialect (`postgresql`|`sqlite`). Default: `postgresql`.
 - `--output`, `-o`   Path to write SQL output. Defaults to stdout.
 
 Example:
 ```bash
 skemabase generate sql schema.sb --dialect sqlite --output schema.sql
 ```
Supports relationships defined in the schema (has_many, has_one, belongs_to, has and belongs to many).
### migrate

Use reversible migrations (up/down) to evolve your schema.

Usage:
```bash
skemabase migrate init
skemabase migrate create <name> [--from <oldIR.json|schema.sb>] [--to <newIR.json|schema.sb>]
skemabase migrate up|down [<n>] [--dry-run] [--dialect <dialect>]
```

Options:
- `--from`   Path to old IR JSON file or schema file (for create)
- `--to`     Path to new IR JSON file or schema file (for create)
- `--dry-run`  Print SQL without executing
- `--dialect`, `-d`  SQL dialect (`postgresql`|`sqlite`). Default: `postgresql`.

Note: At this time, `migrate up` and `migrate down` only generate SQL and do not execute against a live database.

Examples:
```bash
# Initialize migrations folder
skemabase migrate init

# Create an empty migration
skemabase migrate create add_users_table

# Create a diff migration between schema or IR snapshots
skemabase migrate create add_email --from schema_v1.sb --to schema_v2.sb
  # or: skemabase migrate create add_email --from schema_v1.json --to schema_v2.json

# Preview the next migration SQL
skemabase migrate up --dry-run

# Roll back the last two migrations
skemabase migrate down 2 --dry-run
```

Example output for 'migrate up --dry-run':
```bash
-- Migration: 20230504_add_email.js
ALTER TABLE users ADD COLUMN email TEXT;

Note: live execution not yet implemented.
```

Example output for 'migrate down --dry-run':
```bash
-- Migration: 20230504_add_email.js
ALTER TABLE users DROP COLUMN email;

Note: live execution not yet implemented.
```

## Exit Codes
- 0: Success (commands executed, or help/version shown)
- 1: Error (missing input, parse error, unsupported dialect, unrecognized command)

## Examples
| Command                                        | Description                         |
|------------------------------------------------|-------------------------------------|
| `skemabase parse my.sb -o my.json`             | Dump IR as JSON file                |
| `skemabase generate sql my.sb`                 | Generate SQL (defaults to stdout)   |
| `skemabase generate sql my.sb -d sqlite`       | Generate SQLite DDL                 |
| `skemabase --version`                          | Show CLI version                    |
| `skemabase --help`                             | Show usage                          |

## Full Examples

For detailed schema examples and generated outputs, see [Examples](Examples.md).