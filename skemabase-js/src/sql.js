// SQL Generator: convert JSON IR to SQL DDL
// Supported dialects: postgresql, sqlite

// Convert TitleCase or camelCase name to snake_case
function toSnakeCase(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
    .toLowerCase();
}

function generateSQL(ir, options = {}) {
  const dialect = options.dialect || 'postgresql';
  const statements = [];

  for (const entity of ir) {
    const table = toSnakeCase(entity.entity);
    const columns = [];
    // Primary key
    if (dialect === 'postgresql') {
      columns.push('id SERIAL PRIMARY KEY');
    } else if (dialect === 'sqlite') {
      columns.push('id INTEGER PRIMARY KEY');
    } else {
      throw new Error(`Unsupported dialect: ${dialect}`);
    }
    // Attributes
    for (const attr of entity.attributes) {
      const colName = toSnakeCase(attr.name);
      const sqlType = attr.type ? attr.type.toUpperCase() : 'TEXT';
      let colDef = `${colName} ${sqlType}`;
      if (!attr.nullable) {
        colDef += ' NOT NULL';
      }
      if (attr.unique) {
        colDef += ' UNIQUE';
      }
      if (attr.default != null) {
        colDef += ` DEFAULT ${attr.default}`;
      }
      columns.push(colDef);
    }
    // Relationships: only belongs_to
    for (const rel of entity.relationships) {
      if (rel.type === 'belongs_to') {
        const target = rel.target;
        const targetTable = toSnakeCase(target);
        const colName = `${toSnakeCase(target)}_id`;
        const colDef = `${colName} INTEGER REFERENCES ${targetTable}(id)`;
        columns.push(colDef);
      }
    }
    // Assemble CREATE TABLE
    const stmt =
      `CREATE TABLE ${table} (\n` +
      `  ${columns.join(',\n  ')}\n` +
      ');';
    statements.push(stmt);
  }

  return statements.join('\n\n');
}

module.exports = { generateSQL };