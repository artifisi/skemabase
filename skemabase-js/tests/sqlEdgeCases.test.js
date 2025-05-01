const { parse, generateSQL } = require('../src');

describe('SQL Edge Cases', () => {
  it('handles string default values', () => {
    const text = "User has attributes: status default 'active'";
    const ir = parse(text);
    const sql = generateSQL(ir, { dialect: 'postgresql' });
    expect(sql).toContain("status TEXT DEFAULT 'active'");
  });

  it('handles numeric default values', () => {
    const text = 'User has attributes: retries default 3';
    const ir = parse(text);
    const sql = generateSQL(ir, { dialect: 'postgresql' });
    expect(sql).toContain('retries TEXT DEFAULT 3');
  });

  it('handles function default values', () => {
    const text = 'User has attributes: created_at:timestamp default now()';
    const ir = parse(text);
    const sql = generateSQL(ir, { dialect: 'postgresql' });
    expect(sql).toContain('created_at TIMESTAMP DEFAULT now()');
  });

  it('supports not null and unique in any order', () => {
    const text1 = 'User has attributes: name unique not null';
    const text2 = 'User has attributes: name not null unique';
    const ir1 = parse(text1);
    const ir2 = parse(text2);
    const sql1 = generateSQL(ir1, { dialect: 'postgresql' });
    const sql2 = generateSQL(ir2, { dialect: 'postgresql' });
    expect(sql1).toContain('name TEXT NOT NULL UNIQUE');
    expect(sql2).toContain('name TEXT NOT NULL UNIQUE');
  });

  it('honors explicit types with defaults and nullability', () => {
    const text = 'User has attributes: age:integer not null default 21';
    const ir = parse(text);
    const sql = generateSQL(ir, { dialect: 'postgresql' });
    expect(sql).toContain('age INTEGER NOT NULL DEFAULT 21');
  });

  it('converts TitleCase to snake_case correctly', () => {
    const text = 'OrderItem has attributes: OrderID';
    const ir = parse(text);
    const sql = generateSQL(ir, { dialect: 'postgresql' });
    expect(sql).toContain('order_item');
    expect(sql).toContain('order_id TEXT');
  });
});