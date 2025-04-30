const fs = require('fs');
const path = require('path');
const { parse } = require('../src/index');

function loadExample(name) {
  const base = path.resolve(__dirname, '..', '..', 'examples', name);
  const schemaText = fs.readFileSync(path.join(base, `${name}.sb`), 'utf8');
  const expectedIR = JSON.parse(
    fs.readFileSync(path.join(base, `${name}.ir.json`), 'utf8')
  );
  return { schemaText, expectedIR };
}

describe('parse examples', () => {
  ['basic', 'full'].forEach(exampleName => {
    test(`parse ${exampleName} example produces correct IR`, () => {
      const { schemaText, expectedIR } = loadExample(exampleName);
      const result = parse(schemaText);
      expect(result).toEqual(expectedIR);
    });
  });
});