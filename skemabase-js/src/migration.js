// Migration diff engine and IR types

const { generateSQL } = require('./sql');

/**
 * @typedef {Object} Op
 * @property {string} name - operation name (e.g., 'createTable', 'dropTable')
 * @property {any[]} args - arguments for the operation
 * @property {boolean} reversible - whether the operation is reversible
 */

/**
 * @typedef {Object} Migration
 * @property {Op[]} up - operations to apply
 * @property {Op[]} down - operations to rollback
 */

/**
 * @typedef {Object} Op
 * @property {string} name - operation name (e.g., 'createTable', 'dropTable')
 * @property {any[]} args - arguments for the operation
 * @property {boolean} reversible - whether the operation is reversible
 */

/**
 * Compute the migration operations between two schema IR snapshots.
 *
 * @param {Array<{entity: string, attributes: any[], relationships: any[]}>} oldIR
 * @param {Array<{entity: string, attributes: any[], relationships: any[]}>} newIR
 * @returns {{ up: Op[], down: Op[] }} migration with up/down ops
 */
function diffSchemas(oldIR, newIR) {
  const oldMap = new Map(oldIR.map(e => [e.entity, e]));
  const newMap = new Map(newIR.map(e => [e.entity, e]));
  const up = [];
  const down = [];

  // New entities → createTable in up, dropTable in down
  for (const [entity, newDecl] of newMap) {
    if (!oldMap.has(entity)) {
      up.push({ name: 'createTable', args: [entity, newDecl.attributes], reversible: true });
      down.push({ name: 'dropTable', args: [entity], reversible: true });
    }
  }

  // Removed entities → dropTable in up, recreate in down
  for (const [entity, oldDecl] of oldMap) {
    if (!newMap.has(entity)) {
      up.push({ name: 'dropTable', args: [entity], reversible: true });
      down.push({ name: 'createTable', args: [entity, oldDecl.attributes], reversible: true });
    }
  }

  // Attribute-level diffs for existing entities
  for (const [entity, oldDecl] of oldMap) {
    if (newMap.has(entity)) {
      const newDecl = newMap.get(entity);
      const oldAttrs = oldDecl.attributes || [];
      const newAttrs = newDecl.attributes || [];
      const oldNames = new Set(oldAttrs.map(a => a.name));
      const newNames = new Set(newAttrs.map(a => a.name));
      // Added attributes
      for (const attr of newAttrs) {
        if (!oldNames.has(attr.name)) {
          up.push({ name: 'addColumn', args: [entity, attr], reversible: true });
          down.push({ name: 'removeColumn', args: [entity, attr.name], reversible: true });
        }
      }
      // Removed attributes
      for (const attr of oldAttrs) {
        if (!newNames.has(attr.name)) {
          up.push({ name: 'removeColumn', args: [entity, attr.name], reversible: true });
          down.push({ name: 'addColumn', args: [entity, attr], reversible: true });
        }
      }
    }
  }
  return { up, down };
}

/**
 * Convert TitleCase or camelCase name to snake_case
 * @param {string} name
 * @returns {string}
 */
function toSnakeCase(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
    .toLowerCase();
}

/**
 * Generate SQL statements for a migration.
 * @param {Migration} migration
 * @param {Object} [options]
 * @param {string} [options.dialect='postgresql']
 * @returns {{ upSQL: string, downSQL: string }}
 */
function generateMigrationSQL(migration, options = {}) {
  const dialect = options.dialect || 'postgresql';
  const upSQL = migration.up.map(op => sqlForOp(op, dialect)).join('\n');
  const downSQL = migration.down.map(op => sqlForOp(op, dialect)).join('\n');
  return { upSQL, downSQL };
}

/**
 * Generate a SQL statement for a single migration operation.
 * @param {Op} op
 * @param {string} dialect
 * @returns {string}
 */
function sqlForOp(op, dialect) {
  const [entity, ...rest] = op.args;
  switch (op.name) {
    case 'createTable': {
      const attrs = rest[0] || [];
      return generateSQL([{ entity, attributes: attrs, relationships: [] }], { dialect });
    }
    case 'dropTable': {
      const table = toSnakeCase(entity);
      return `DROP TABLE ${table};`;
    }
    case 'addColumn': {
      const [attr] = rest;
      const table = toSnakeCase(entity);
      const col = toSnakeCase(attr.name);
      const type = attr.type ? attr.type.toUpperCase() : 'TEXT';
      let def = `${col} ${type}`;
      if (!attr.nullable) def += ' NOT NULL';
      if (attr.unique) def += ' UNIQUE';
      if (attr.default != null) def += ` DEFAULT ${attr.default}`;
      return `ALTER TABLE ${table} ADD COLUMN ${def};`;
    }
    case 'removeColumn': {
      const [col] = rest;
      const table = toSnakeCase(entity);
      return `ALTER TABLE ${table} DROP COLUMN ${col};`;
    }
    default:
      throw new Error(`Unsupported migration op: ${op.name}`);
  }
}

module.exports = { diffSchemas, generateMigrationSQL };