const { tokenize } = require('./tokenizer');
const { parseTokensToAST } = require('./parser');
const { astToIR } = require('./astToIR');
const { generateSQL } = require('./sql');

/**
 * Parse a SkemaBase schema (plain English) into JSON IR.
 * @param {string} text - Schema text, one statement per line.
 * @returns {Array<Object>} IR: array of entities with attributes and relationships.
 * @throws {Error} If any statement fails to parse.
 */
function parse(text) {
  const lines = text.split(/\r?\n/);
  const statements = [];
  lines.forEach((raw, idx) => {
    const line = raw.trim();
    if (!line) return;
    const tokens = tokenize(line);
    let stmt;
    try {
      stmt = parseTokensToAST(tokens);
    } catch (err) {
      throw new Error(
        `Error parsing line ${idx + 1}: "${line}" -> ${err.message}`
      );
    }
    statements.push(stmt);
  });
  return astToIR(statements);
}

module.exports = { parse, generateSQL };