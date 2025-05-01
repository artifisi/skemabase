 # SkemaBase CLI Reference
 
 The `skemabase` command-line tool lets you parse schema files and generate SQL DDL.
 
 ## Installation
 ```bash
 npm install -g skemabase-cli
 ```
 
 ## Commands
 
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