const { generateMigrationSQL } = require('../src/migration');

describe('generateMigrationSQL', () => {
  test('generates SQL for createTable and dropTable ops', () => {
    const migration = {
      up: [
        { name: 'createTable', args: ['users', [{ name: 'name', type: 'text', nullable: true }]], reversible: true }
      ],
      down: [
        { name: 'dropTable', args: ['users'], reversible: true }
      ]
    };
    const { upSQL, downSQL } = generateMigrationSQL(migration, { dialect: 'postgresql' });
    const expectedCreate =
      'CREATE TABLE users (\n' +
      '  id SERIAL PRIMARY KEY,\n' +
      '  name TEXT\n' +
      ');';
    expect(upSQL).toBe(expectedCreate);
    expect(downSQL).toBe('DROP TABLE users;');
  });

  test('generates SQL for addColumn and removeColumn ops', () => {
    const migration = {
      up: [
        { name: 'addColumn', args: ['users', { name: 'age', type: 'integer', nullable: true }], reversible: true }
      ],
      down: [
        { name: 'removeColumn', args: ['users', 'age'], reversible: true }
      ]
    };
    const { upSQL, downSQL } = generateMigrationSQL(migration, { dialect: 'postgresql' });
    expect(upSQL).toBe('ALTER TABLE users ADD COLUMN age INTEGER;');
    expect(downSQL).toBe('ALTER TABLE users DROP COLUMN age;');
  });
});