// Tokenizer: splits a schema line into meaningful tokens
function tokenize(text) {
  // Matches quoted strings, function calls like now(), words, or ':' or ','
  const regex = /'[^']*'|\w+\(\)|\w+|:|,/g;
  const matches = text.match(regex);
  return matches || [];
}

module.exports = { tokenize };