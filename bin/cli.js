#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
// Load the SDK directly from the local skemabase-js source to include latest changes
const { parse, generateSQL } = require(path.join(__dirname, '..', 'skemabase-js', 'src', 'index.js'));

function printUsage() {
  console.log(
    'Usage:' +
    '\n  skemabase parse <input.sb> --output <output.json>' +
    '\n  skemabase generate sql <input.sb> --dialect <dialect> --output <output.sql>' +
    '\nOptions:' +
    '\n  --output, -o   Output file path (defaults to stdout)' +
    '\n  --dialect, -d  SQL dialect (postgresql|sqlite)' 
  );
  process.exit(1);
}

const args = process.argv.slice(2);
if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  printUsage();
}

const cmd = args[0];
if (cmd === 'parse') {
  const input = args[1];
  if (!input) printUsage();
  let outIndex = args.indexOf('--output');
  if (outIndex === -1) outIndex = args.indexOf('-o');
  const output = outIndex !== -1 ? args[outIndex + 1] : null;
  let text;
  try {
    text = fs.readFileSync(input, 'utf-8');
  } catch (err) {
    console.error('Error reading file:', err.message);
    process.exit(1);
  }
  let ir;
  try {
    ir = parse(text);
  } catch (err) {
    console.error('Parse error:', err.message);
    process.exit(1);
  }
  const json = JSON.stringify(ir, null, 2);
  if (output) {
    fs.writeFileSync(output, json);
  } else {
    console.log(json);
  }
} else if (cmd === 'generate' && args[1] === 'sql') {
  const input = args[2];
  if (!input) printUsage();
  let dialect = 'postgresql';
  let dIndex = args.indexOf('--dialect');
  if (dIndex === -1) dIndex = args.indexOf('-d');
  if (dIndex !== -1) dialect = args[dIndex + 1];
  let outIndex = args.indexOf('--output');
  if (outIndex === -1) outIndex = args.indexOf('-o');
  const output = outIndex !== -1 ? args[outIndex + 1] : null;
  let text;
  try {
    text = fs.readFileSync(input, 'utf-8');
  } catch (err) {
    console.error('Error reading file:', err.message);
    process.exit(1);
  }
  let ir;
  try {
    ir = parse(text);
  } catch (err) {
    console.error('Parse error:', err.message);
    process.exit(1);
  }
  let sql;
  try {
    sql = generateSQL(ir, { dialect });
  } catch (err) {
    console.error('Error generating SQL:', err.message);
    process.exit(1);
  }
  if (output) {
    fs.writeFileSync(output, sql);
  } else {
    console.log(sql);
  }
} else {
  printUsage();
}