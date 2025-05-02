const { generateMermaidDiagram } = require('../src/diagramMermaid');

describe('generateMermaidDiagram', () => {
  test('single entity with no attributes or relationships', () => {
    const ir = [
      { entity: 'User', attributes: [], relationships: [] }
    ];
    const diagram = generateMermaidDiagram(ir);
    const lines = diagram.split('\n');
    expect(lines).toEqual([
      'erDiagram',
      '    User {',
      '    }'
    ]);
  });

  test('entity with attributes and default type', () => {
    const ir = [
      { entity: 'Product', attributes: [
          { name: 'id', type: 'integer' },
          { name: 'name' }
        ],
        relationships: []
      }
    ];
    const diagram = generateMermaidDiagram(ir);
    // Should include attribute lines with correct types
    expect(diagram).toMatch(/integer id/);
    expect(diagram).toMatch(/string name/);
  });

  test('one-to-many relationship', () => {
    const ir = [
      { entity: 'User', attributes: [], relationships: [ { type: 'has many', target: 'Post' } ] },
      { entity: 'Post', attributes: [], relationships: [] }
    ];
    const diagram = generateMermaidDiagram(ir);
    expect(diagram).toMatch(/User \|\|--o\{ Post : "has many"/);
  });

  test('one-to-one relationship', () => {
    const ir = [
      { entity: 'Customer', attributes: [], relationships: [ { type: 'has one', target: 'Profile' } ] },
      { entity: 'Profile', attributes: [], relationships: [] }
    ];
    const diagram = generateMermaidDiagram(ir);
    expect(diagram).toMatch(/Customer \|\|--\|\| Profile : "has one"/);
  });

  test('belongs to relationship', () => {
    const ir = [
      { entity: 'Comment', attributes: [], relationships: [ { type: 'belongs to', target: 'Post' } ] },
      { entity: 'Post', attributes: [], relationships: [] }
    ];
    const diagram = generateMermaidDiagram(ir);
    expect(diagram).toMatch(/Comment \}o--\|\| Post : "belongs to"/);
  });

  test('many-to-many relationship', () => {
    const ir = [
      { entity: 'Author', attributes: [], relationships: [ { type: 'has and belongs to many', target: 'Book' } ] },
      { entity: 'Book', attributes: [], relationships: [] }
    ];
    const diagram = generateMermaidDiagram(ir);
    expect(diagram).toMatch(/Author \}o--o\{ Book : "has and belongs to many"/);
  });
});