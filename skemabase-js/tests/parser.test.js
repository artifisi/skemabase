const { tokenize } = require('../src/tokenizer');
const { parseTokensToAST } = require('../src/parser');
const { astToIR } = require('../src/astToIR');

describe('parser and astToIR', () => {
  test('attribute declaration AST and IR', () => {
    const line = "User has attributes: username, email unique";
    const tokens = tokenize(line);
    const stmt = parseTokensToAST(tokens);
    expect(stmt).toEqual({
      type: 'AttrDecl',
      entity: 'User',
      attributes: [
        { name: 'username', type: null, unique: false, nullable: true, default: null },
        { name: 'email',    type: null, unique: true,  nullable: true, default: null }
      ]
    });
    const ir = astToIR([stmt]);
    expect(ir).toEqual([
      {
        entity: 'User',
        attributes: [
          { name: 'username', type: null, unique: false, nullable: true, default: null },
          { name: 'email',    type: null, unique: true,  nullable: true, default: null }
        ],
        relationships: []
      }
    ]);
  });

  test('relationship declaration AST and IR', () => {
    const line = 'Post belongs to User';
    const stmt = parseTokensToAST(tokenize(line));
    expect(stmt).toEqual({
      type: 'RelDecl',
      entity: 'Post',
      relType: 'belongs_to',
      targets: ['User']
    });
    const ir = astToIR([stmt]);
    expect(ir).toEqual([
      {
        entity: 'Post',
        attributes: [],
        relationships: [{ type: 'belongs_to', target: 'User' }]
      }
    ]);
  });

  test('has many and habtm with multiple targets', () => {
    const line = 'User has and belongs to many roles, posts';
    const stmt = parseTokensToAST(tokenize(line));
    expect(stmt).toEqual({
      type: 'RelDecl',
      entity: 'User',
      relType: 'habtm',
      targets: ['Role', 'Post']
    });
    const ir = astToIR([stmt]);
    expect(ir[0].relationships).toEqual([
      { type: 'habtm', target: 'Role' },
      { type: 'habtm', target: 'Post' }
    ]);
  });

  test('attribute with type and not null and default', () => {
    const line = "Post has attributes: title:string not null, status default 'draft'";
    const stmt = parseTokensToAST(tokenize(line));
    expect(stmt).toEqual({
      type: 'AttrDecl',
      entity: 'Post',
      attributes: [
        { name: 'title', type: 'string', unique: false, nullable: false, default: null },
        { name: 'status', type: null,   unique: false, nullable: true,  default: "'draft'" }
      ]
    });
  });
});