const { tokenize } = require('../src/tokenizer');

describe('tokenizer', () => {
  test('splits words and punctuation', () => {
    const line = "User has attributes: username, email unique";
    expect(tokenize(line)).toEqual([
      'User', 'has', 'attributes', ':', 'username', ',', 'email', 'unique'
    ]);
  });

  test('captures default literals and functions', () => {
    expect(tokenize("created_at default now()")).toEqual([
      'created_at', 'default', 'now()'
    ]);
    expect(tokenize("status default 'draft'"))
      .toEqual(['status', 'default', "'draft'"]);
  });

  test('tokenizes relationship statements', () => {
    expect(tokenize('Post belongs to User'))
      .toEqual(['Post', 'belongs', 'to', 'User']);
    expect(tokenize('User has and belongs to many roles, posts'))
      .toEqual([
        'User', 'has', 'and', 'belongs', 'to', 'many', 'roles', ',', 'posts'
      ]);
  });
});