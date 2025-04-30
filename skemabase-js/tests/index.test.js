const { parse } = require('../src/index');

test('parse returns an object', () => {
  const result = parse('');
  expect(typeof result).toBe('object');
});