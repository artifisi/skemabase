const { tokenize } = require('./tokenizer');
const { parseTokensToAST } = require('./parser');
const { astToIR } = require('./astToIR');

// Parse a schema text into the JSON intermediate representation (IR)
function parse(text) {
  const lines = text.split(/\r?\n/);
  const statements = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const tokens = tokenize(line);
    const stmt = parseTokensToAST(tokens);
    statements.push(stmt);
  }
  return astToIR(statements);
}

module.exports = { parse };