// SQL Generator: convert JSON IR to SQL DDL
// Supported dialects: postgresql, sqlite

// Convert TitleCase or camelCase name to snake_case
function toSnakeCase(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
    .toLowerCase();
}

/**
 * Generate SQL DDL statements from SkemaBase IR, including relationship constraints.
 * Supports:
 *   - belongs_to: adds foreign key to source table.
 *   - has_many: adds foreign key to target table.
 *   - has_one: adds foreign key to target table with UNIQUE constraint.
 *   - has and belongs to many: creates join table with composite primary key.
 *
 * @param {Array<Object>} ir - JSON IR of entities (from parse()).
 * @param {Object} [options] - Generation options.
 * @param {string} [options.dialect='postgresql'] - SQL dialect: 'postgresql' or 'sqlite'.
 * @returns {string} SQL DDL statements.
 * @throws {Error} If an unsupported dialect is specified.
 */
function generateSQL(ir, options = {}) {
  const dialect = options.dialect || 'postgresql';
  // Map of entities to their table definitions (columns)
  const tables = new Map();

  // Initialize tables with primary key and attributes
  for (const entity of ir) {
    const tableName = toSnakeCase(entity.entity);
    const cols = [];
    if (dialect === 'postgresql') {
      cols.push('id SERIAL PRIMARY KEY');
    } else if (dialect === 'sqlite') {
      cols.push('id INTEGER PRIMARY KEY');
    } else {
      throw new Error(`Unsupported dialect: ${dialect}`);
    }
    for (const attr of entity.attributes) {
      const colName = toSnakeCase(attr.name);
      const sqlType = attr.type ? attr.type.toUpperCase() : 'TEXT';
      let colDef = `${colName} ${sqlType}`;
      if (!attr.nullable) colDef += ' NOT NULL';
      if (attr.unique) colDef += ' UNIQUE';
      if (attr.default != null) colDef += ` DEFAULT ${attr.default}`;
      cols.push(colDef);
    }
    tables.set(entity.entity, { tableName, columns: cols });
  }

  // Pre-allocate any referenced target-only entities so SQL generation can add FKs
  for (const entity of ir) {
    for (const rel of entity.relationships) {
      const tgtName = rel.target;
      if (!tables.has(tgtName)) {
        const tableName = toSnakeCase(tgtName);
        const cols = [];
        if (dialect === 'postgresql') {
          cols.push('id SERIAL PRIMARY KEY');
        } else if (dialect === 'sqlite') {
          cols.push('id INTEGER PRIMARY KEY');
        }
        tables.set(tgtName, { tableName, columns: cols });
      }
    }
  }
  // Process relationships: foreign keys and join tables
  const addedFK = new Set();
  const joinKeys = new Set();
  const joinTables = [];
  for (const entity of ir) {
    const srcName = entity.entity;
    const srcDef = tables.get(srcName);
    const srcTable = srcDef.tableName;
    for (const rel of entity.relationships) {
      const tgtName = rel.target;
      const tgtDef = tables.get(tgtName);
      const tgtTableName = toSnakeCase(tgtName);
      if (rel.type === 'belongs_to') {
        const colName = `${tgtTableName}_id`;
        const key = `${srcTable}.${colName}`;
        if (!addedFK.has(key)) {
          srcDef.columns.push(`${colName} INTEGER REFERENCES ${tgtTableName}(id)`);
          addedFK.add(key);
        }
      } else if (rel.type === 'has_many' || rel.type === 'has_one') {
        const colName = `${toSnakeCase(srcName)}_id`;
        const key = `${tgtTableName}.${colName}`;
        if (!addedFK.has(key)) {
          let colDef = `${colName} INTEGER REFERENCES ${srcTable}(id)`;
          if (rel.type === 'has_one') colDef += ' UNIQUE';
          tgtDef.columns.push(colDef);
          addedFK.add(key);
        }
      } else if (rel.type === 'habtm') {
        const pair = [srcName, tgtName].sort();
        const jk = pair.join('~');
        if (!joinKeys.has(jk)) {
          joinKeys.add(jk);
          const a = toSnakeCase(pair[0]);
          const b = toSnakeCase(pair[1]);
          joinTables.push({ name: `${a}_${b}`, left: a, right: b });
        }
      }
    }
  }

  // Assemble CREATE TABLE statements
  const statements = [];
  for (const { tableName, columns } of tables.values()) {
    const stmt =
      `CREATE TABLE ${tableName} (\n` +
      `  ${columns.join(',\n  ')}\n` +
      ');';
    statements.push(stmt);
  }

  // Create join tables for many-to-many relationships
  for (const jt of joinTables) {
    const cols = [
      `${jt.left}_id INTEGER REFERENCES ${jt.left}(id)`,
      `${jt.right}_id INTEGER REFERENCES ${jt.right}(id)`,
      `PRIMARY KEY (${jt.left}_id, ${jt.right}_id)`
    ];
    const stmt =
      `CREATE TABLE ${jt.name} (\n` +
      `  ${cols.join(',\n  ')}\n` +
      ');';
    statements.push(stmt);
  }

  return statements.join('\n\n');
}

module.exports = { generateSQL };