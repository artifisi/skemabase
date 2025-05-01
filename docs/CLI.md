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