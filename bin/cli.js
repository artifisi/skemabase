#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
// Load the SDK directly from the local skemabase-js source to include latest changes
const { parse, generateSQL, generateMermaidDiagram } = require(path.join(__dirname, '..', 'skemabase-js', 'src', 'index.js'));

/**
 * Print usage help text (to stdout), without exiting.
 */
function usage() {
  console.log(
    'Usage:' +
    '\n  skemabase parse <input.sb> --output <output.json>' +
    '\n  skemabase generate sql <input.sb> --dialect <dialect> --output <output.sql>' +
    '\n\nOptions:' +
    '\n  --help, -h      Show help message' +
    '\n  --version, -v   Show version' +
    '\n  --output, -o    Output file path (defaults to stdout)' +
    '\n  --dialect, -d   SQL dialect (postgresql|sqlite)' 
  );
}

/**
 * Print help and exit with code 0.
 */
function printHelp() {
  usage();
  process.exit(0);
}

/**
 * Print error message, usage, and exit with code 1.
 * @param {string} msg - Error message to display.
 */
function printError(msg) {
  console.error(msg);
  usage();
  process.exit(1);
}

const args = process.argv.slice(2);
// Handle version flag
if (args.includes('--version') || args.includes('-v')) {
  try {
    const pkg = require(path.join(__dirname, '..', 'package.json'));
    console.log(pkg.version);
  } catch {
    console.log('Version not available');
  }
  process.exit(0);
}
if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  printHelp();
}

const cmd = args[0];
if (cmd === 'parse') {
  const input = args[1];
  if (!input) printError('Error: Missing input file for parse command.');
  let outIndex = args.indexOf('--output');
  if (outIndex === -1) outIndex = args.indexOf('-o');
  const output = outIndex !== -1 ? args[outIndex + 1] : null;
  let text;
  try {
    text = fs.readFileSync(input, 'utf-8');
  } catch (err) {
    printError(`Error reading file: ${err.message}`);
  }
  let ir;
  try {
    ir = parse(text);
  } catch (err) {
    printError(`Parse error: ${err.message}`);
  }
  const json = JSON.stringify(ir, null, 2);
  if (output) {
    fs.writeFileSync(output, json);
  } else {
    console.log(json);
  }
} else if (cmd === 'generate' && args[1] === 'sql') {
  const input = args[2];
  if (!input) printError('Error: Missing input file for generate sql command.');
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
    printError(`Error reading file: ${err.message}`);
  }
  let ir;
  try {
    ir = parse(text);
  } catch (err) {
    printError(`Parse error: ${err.message}`);
  }
  let sql;
  try {
    sql = generateSQL(ir, { dialect });
  } catch (err) {
    printError(`Error generating SQL: ${err.message}`);
  }
  if (output) {
    fs.writeFileSync(output, sql);
  } else {
    console.log(sql);
  }
} else if (cmd === 'generate' && args[1] === 'diagram') {
  const input = args[2];
  if (!input) printError('Error: Missing input file for generate diagram command.');
  // Only mermaid format supported
  let format = 'mermaid';
  let fIndex = args.indexOf('--format');
  if (fIndex === -1) fIndex = args.indexOf('-f');
  if (fIndex !== -1) format = args[fIndex + 1];
  if (format !== 'mermaid') printError(`Unsupported diagram format: ${format}`);
  let outIndex = args.indexOf('--output');
  if (outIndex === -1) outIndex = args.indexOf('-o');
  const output = outIndex !== -1 ? args[outIndex + 1] : null;
  // Read and parse schema
  let text;
  try { text = fs.readFileSync(input, 'utf-8'); } catch (err) { printError(`Error reading file: ${err.message}`); }
  let ir;
  try { ir = parse(text); } catch (err) { printError(`Parse error: ${err.message}`); }
  // Generate Mermaid diagram
  let diagram;
  try { diagram = generateMermaidDiagram(ir); } catch (err) { printError(`Error generating diagram: ${err.message}`); }
  if (output) {
    fs.writeFileSync(output, diagram);
  } else {
    console.log(diagram);
  }
} else {
  printError(`Error: Unrecognized command: ${args.join(' ')}`);
}