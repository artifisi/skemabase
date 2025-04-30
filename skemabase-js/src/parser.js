// Parser: transforms token arrays into AST nodes

// Normalize entity names: singularize and TitleCase lowercase words
function normalizeEntityName(raw) {
  let s = raw.trim();
  if (s.toLowerCase() === s) {
    if (s.endsWith('ies')) {
      s = s.slice(0, -3) + 'y';
    } else if (s.endsWith('s')) {
      s = s.slice(0, -1);
    }
    s = s.charAt(0).toUpperCase() + s.slice(1);
  }
  return s;
}

// Parse an array of tokens into an AST statement
function parseTokensToAST(tokens) {
  if (tokens.length >= 4 && tokens[1] === 'has' && tokens[2] === 'attributes' && tokens[3] === ':') {
    const entity = normalizeEntityName(tokens[0]);
    const attributes = [];
    let i = 4;
    while (i < tokens.length) {
      const itemTokens = [];
      while (i < tokens.length && tokens[i] !== ',') {
        itemTokens.push(tokens[i]);
        i++;
      }
      if (tokens[i] === ',') {
        i++;
      }
      let name;
      let type = null;
      const mods = [];
      if (itemTokens[1] === ':') {
        name = itemTokens[0];
        type = itemTokens[2];
        mods.push(...itemTokens.slice(3));
      } else {
        name = itemTokens[0];
        mods.push(...itemTokens.slice(1));
      }
      const unique = mods.includes('unique');
      const notNullIndex = mods.indexOf('not');
      const nullable = !(notNullIndex !== -1 && mods[notNullIndex + 1] === 'null');
      const defaultIndex = mods.indexOf('default');
      let defaultVal = null;
      if (defaultIndex !== -1 && mods.length > defaultIndex + 1) {
        defaultVal = mods[defaultIndex + 1];
      }
      attributes.push({ name, type, unique, nullable, default: defaultVal });
    }
    return { type: 'AttrDecl', entity, attributes };
  }

  // Relationship parsing
  const entity = normalizeEntityName(tokens[0]);
  let relType;
  let idx;
  if (tokens[1] === 'has' && tokens[2] === 'and' && tokens[3] === 'belongs' && tokens[4] === 'to' && tokens[5] === 'many') {
    relType = 'habtm';
    idx = 6;
  } else if (tokens[1] === 'has' && tokens[2] === 'many') {
    relType = 'has_many';
    idx = 3;
  } else if (tokens[1] === 'has' && tokens[2] === 'one') {
    relType = 'has_one';
    idx = 3;
  } else if (tokens[1] === 'belongs' && tokens[2] === 'to') {
    relType = 'belongs_to';
    idx = 3;
  } else {
    // Provide detailed guidance on expected syntax
    const text = tokens.join(' ');
    throw new Error(
      `Unrecognized statement: "${text}". ` +
      `Expected: "<Entity> has attributes: ...", ` +
      `"<Entity> has one/many or belongs to ...", or ` +
      `"<Entity> has and belongs to many ...".`
    );
  }
  const rawTargets = tokens.slice(idx);
  const targets = rawTargets.filter(t => t !== ',').map(normalizeEntityName);
  return { type: 'RelDecl', entity, relType, targets };
}

module.exports = { normalizeEntityName, parseTokensToAST };