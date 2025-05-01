// Convert AST statements into JSON IR
function astToIR(statements) {
  // Initialize IR entries for each unique entity (pre-allocation)
  const entities = new Map();
  for (const stmt of statements) {
    if (!entities.has(stmt.entity)) {
      entities.set(stmt.entity, { entity: stmt.entity, attributes: [], relationships: [] });
    }
  }
  // Ensure target-only entities (from relationships) are also pre-allocated
  for (const stmt of statements) {
    if (stmt.type === 'RelDecl') {
      for (const target of stmt.targets) {
        if (!entities.has(target)) {
          entities.set(target, { entity: target, attributes: [], relationships: [] });
        }
      }
    }
  }
  // Populate attributes and relationships
  for (const stmt of statements) {
    const decl = entities.get(stmt.entity);
    if (stmt.type === 'AttrDecl') {
      decl.attributes.push(...stmt.attributes);
    } else if (stmt.type === 'RelDecl') {
      for (const target of stmt.targets) {
        decl.relationships.push({ type: stmt.relType, target });
      }
    }
  }
  return Array.from(entities.values());
}

module.exports = { astToIR };