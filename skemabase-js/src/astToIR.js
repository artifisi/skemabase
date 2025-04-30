// Convert AST statements into JSON IR
function astToIR(statements) {
  const entities = new Map();
  for (const stmt of statements) {
    const { entity } = stmt;
    if (!entities.has(entity)) {
      entities.set(entity, { entity, attributes: [], relationships: [] });
    }
    const decl = entities.get(entity);
    if (stmt.type === 'AttrDecl') {
      for (const attr of stmt.attributes) {
        decl.attributes.push(attr);
      }
    } else if (stmt.type === 'RelDecl') {
      for (const target of stmt.targets) {
        decl.relationships.push({ type: stmt.relType, target });
      }
    }
  }
  return Array.from(entities.values());
}

module.exports = { astToIR };