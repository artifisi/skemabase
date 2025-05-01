const { parse, generateSQL } = require('../src');

describe('generateSQL', () => {
  it('generates SQL for a single entity with attributes', () => {
    const text =
      'User has attributes: name, email unique, age:integer not null, created_at:timestamp default now()';
    const ir = parse(text);
    const sql = generateSQL(ir, { dialect: 'postgresql' });
    const expected = `CREATE TABLE user (\n` +
      `  id SERIAL PRIMARY KEY,\n` +
      `  name TEXT,\n` +
      `  email TEXT UNIQUE,\n` +
      `  age INTEGER NOT NULL,\n` +
      `  created_at TIMESTAMP DEFAULT now()\n` +
      `);`;
    expect(sql.trim()).toBe(expected);
  });

  it('generates SQL with foreign key for belongs_to', () => {
    const text = `
Post has attributes: title
Post belongs to User
`;
    const ir = parse(text);
    const sql = generateSQL(ir, { dialect: 'postgresql' });
    expect(sql).toContain('CREATE TABLE post');
    expect(sql).toContain('id SERIAL PRIMARY KEY');
    expect(sql).toContain('title TEXT');
    expect(sql).toContain('user_id INTEGER REFERENCES user(id)');
  });

  it('supports sqlite dialect', () => {
    const text = 'User has attributes: name';
    const ir = parse(text);
    const sql = generateSQL(ir, { dialect: 'sqlite' });
    expect(sql).toContain('id INTEGER PRIMARY KEY');
    expect(sql).toContain('name TEXT');
  });

  it('throws on unsupported dialect', () => {
    const text = 'User has attributes: name';
    const ir = parse(text);
    expect(() => generateSQL(ir, { dialect: 'mysql' })).toThrow(
      /Unsupported dialect/
    );
  });
});