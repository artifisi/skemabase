 # skemabase-js

 JavaScript SDK for parsing plain-English database schemas into a JSON intermediate representation (IR), generating SQL DDL, and creating Mermaid ER diagrams.

 ## Installation

 ```bash
 npm install skemabase-js
 ```

 ## Usage

 ```js
 import { parse, generateSQL, generateMermaidDiagram } from 'skemabase-js';

 const schema = `
   User has attributes: username unique, email unique, created_at:timestamp default now()
   User has many Post
   Post has attributes: title not null, body, created_at:timestamp default now()
 `;

 const ir = parse(schema);
 const sql = generateSQL(ir, { dialect: 'postgresql' });
 console.log(sql);

 const diagram = generateMermaidDiagram(ir);
 console.log(diagram);
 ```

 ## API

 - parse(text: string): Array<object>
 - generateSQL(ir: Array<object>, options?: { dialect: 'postgresql' | 'sqlite' }): string
 - generateMermaidDiagram(ir: Array<object>): string

 ## Documentation

 See the [SkemaBase CLI Reference](../docs/CLI.md) for command-line usage, and the [root README](../README.md) for full project documentation.

 ## License

 MIT