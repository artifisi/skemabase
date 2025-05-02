/**
 * Generate a Mermaid ER diagram from the SkemaBase IR.
 * @param {Array<Object>} ir - JSON IR: list of entities with attributes and relationships.
 * @param {Object} [options] - Generation options (reserved for future use).
 * @returns {string} Mermaid ER diagram string.
 */
function generateMermaidDiagram(ir, options = {}) {
  const lines = [];
  lines.push('erDiagram');
  // First, entity definitions
  ir.forEach(entity => {
    lines.push(`    ${entity.entity} {`);
    entity.attributes.forEach(attr => {
      const type = attr.type || 'string';
      lines.push(`        ${type} ${attr.name}`);
    });
    lines.push('    }');
  });
  // Then, relationships (AST uses snake_case types)
  const relMap = {
    has_one: '||--||',
    'has one': '||--||',
    has_many: '||--o{',
    'has many': '||--o{',
    belongs_to: '}o--||',
    'belongs to': '}o--||',
    habtm: '}o--o{',
    'has and belongs to many': '}o--o{'
  };
  const relLabel = {
    has_one: 'has one',
    'has one': 'has one',
    has_many: 'has many',
    'has many': 'has many',
    belongs_to: 'belongs to',
    'belongs to': 'belongs to',
    habtm: 'has and belongs to many',
    'has and belongs to many': 'has and belongs to many'
  };
  ir.forEach(entity => {
    entity.relationships.forEach(rel => {
      const symbol = relMap[rel.type];
      if (!symbol) return;
      const label = relLabel[rel.type] || rel.type;
      lines.push(`    ${entity.entity} ${symbol} ${rel.target} : "${label}"`);
    });
  });
  return lines.join('\n');
}

module.exports = { generateMermaidDiagram };