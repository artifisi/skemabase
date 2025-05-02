const { diffSchemas } = require('../src/migration');

describe('diffSchemas', () => {
  test('creates a createTable op for a new entity', () => {
    const oldIR = [];
    const newIR = [
      { entity: 'users', attributes: [{ name: 'id', type: 'serial' }], relationships: [] }
    ];
    const { up, down } = diffSchemas(oldIR, newIR);
    expect(up).toEqual([
      { name: 'createTable', args: ['users', newIR[0].attributes], reversible: true }
    ]);
    expect(down).toEqual([
      { name: 'dropTable', args: ['users'], reversible: true }
    ]);
  });

  test('creates a dropTable op for a removed entity', () => {
    const oldIR = [
      { entity: 'users', attributes: [{ name: 'id', type: 'serial' }], relationships: [] }
    ];
    const newIR = [];
    const { up, down } = diffSchemas(oldIR, newIR);
    expect(up).toEqual([
      { name: 'dropTable', args: ['users'], reversible: true }
    ]);
    expect(down).toEqual([
      { name: 'createTable', args: ['users', oldIR[0].attributes], reversible: true }
    ]);
  });

  test('no operations when schemas are identical', () => {
    const ir = [
      { entity: 'posts', attributes: [{ name: 'id', type: 'serial' }], relationships: [] }
    ];
    const result = diffSchemas(ir, ir);
    expect(result).toEqual({ up: [], down: [] });
  });
  
  test('adds a new attribute as addColumn op', () => {
    const oldIR = [
      { entity: 'users', attributes: [{ name: 'id', type: 'serial' }], relationships: [] }
    ];
    const newIR = [
      { entity: 'users', attributes: [
          { name: 'id', type: 'serial' },
          { name: 'name', type: 'text' }
        ], relationships: [] }
    ];
    const { up, down } = diffSchemas(oldIR, newIR);
    expect(up).toEqual([
      { name: 'addColumn', args: ['users', newIR[0].attributes[1]], reversible: true }
    ]);
    expect(down).toEqual([
      { name: 'removeColumn', args: ['users', 'name'], reversible: true }
    ]);
  });

  test('removes an attribute as removeColumn op', () => {
    const oldIR = [
      { entity: 'users', attributes: [
          { name: 'id', type: 'serial' },
          { name: 'age', type: 'integer' }
        ], relationships: [] }
    ];
    const newIR = [
      { entity: 'users', attributes: [
          { name: 'id', type: 'serial' }
        ], relationships: [] }
    ];
    const { up, down } = diffSchemas(oldIR, newIR);
    expect(up).toEqual([
      { name: 'removeColumn', args: ['users', 'age'], reversible: true }
    ]);
    expect(down).toEqual([
      { name: 'addColumn', args: ['users', oldIR[0].attributes[1]], reversible: true }
    ]);
  });
});