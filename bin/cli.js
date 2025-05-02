#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
// Load the SDK directly from the local skemabase-js source to include latest changes
const { parse, generateSQL } = require(path.join(__dirname, '..', 'skemabase-js', 'src', 'index.js'));

/**
 * Print usage help text (to stdout), without exiting.
 */
function usage() {
  console.log(
    'Usage:' +
    '\n  skemabase parse <input.sb> --output <output.json>' +
    '\n  skemabase generate sql <input.sb> --dialect <dialect> --output <output.sql>' +
    '\n  skemabase migrate init' +
    '\n  skemabase migrate create <name> [--from <oldIR.json> --to <newIR.json>]' +
    '\n  skemabase migrate up|down [<n>] [--dry-run] [--dialect <dialect>]' +
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
} else if (cmd === 'migrate') {
  const sub = args[1];
  if (!sub) printError('Error: Missing migrate subcommand (init, create, up, down).');
  // migrate init
  if (sub === 'init') {
    const migrationsDir = path.join(process.cwd(), 'migrations');
    if (fs.existsSync(migrationsDir)) {
      console.log('Migrations directory already exists at ./migrations');
    } else {
      fs.mkdirSync(migrationsDir);
      console.log('Created migrations directory at ./migrations');
    }
    process.exit(0);
  }
  // migrate create
  if (sub === 'create') {
    const name = args[2];
    if (!name) printError('Error: Missing migration name for create.');
    const fromIdx = args.indexOf('--from');
    const toIdx = args.indexOf('--to');
    const { diffSchemas } = require(path.join(__dirname, '..', 'skemabase-js', 'src', 'migration'));
    let migration;
    // Load IR from files: support .sb (schema) or .json (IR)
    let oldIR = [];
    let newIR = [];
    try {
      if (fromIdx !== -1) {
        const fromPath = args[fromIdx + 1];
        const data = fs.readFileSync(fromPath, 'utf-8');
        if (path.extname(fromPath) === '.sb') {
          oldIR = parse(data);
        } else {
          oldIR = JSON.parse(data);
        }
      }
      if (toIdx !== -1) {
        const toPath = args[toIdx + 1];
        const data = fs.readFileSync(toPath, 'utf-8');
        if (path.extname(toPath) === '.sb') {
          newIR = parse(data);
        } else {
          newIR = JSON.parse(data);
        }
      }
    } catch (err) {
      printError(`Error reading IR files: ${err.message}`);
    }
    migration = diffSchemas(oldIR, newIR);
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '');
    const safe = name.replace(/\s+/g, '_').replace(/[^\w\-]/g, '').toLowerCase();
    const filename = `${timestamp}_${safe}.js`;
    const migrationsDir = path.join(process.cwd(), 'migrations');
    if (!fs.existsSync(migrationsDir)) printError('Error: migrations directory not found. Run `skemabase migrate init` first.');
    const filePath = path.join(migrationsDir, filename);
    const content = `module.exports = ${JSON.stringify(migration, null, 2)};\n`;
    fs.writeFileSync(filePath, content);
    console.log(`Created migration: ${filePath}`);
    process.exit(0);
  }
  // migrate up/down
  if (sub === 'up' || sub === 'down') {
    const migrationsDir = path.join(process.cwd(), 'migrations');
    if (!fs.existsSync(migrationsDir)) printError('Error: migrations directory not found. Run `skemabase migrate init` first.');
    let count = null;
    const maybeN = args[2];
    if (maybeN && !maybeN.startsWith('-')) {
      const v = parseInt(maybeN, 10);
      if (Number.isNaN(v)) printError(`Error: Invalid migration count: ${maybeN}`);
      count = v;
    }
    const dryRun = args.includes('--dry-run');
    let dialect = 'postgresql';
    let dIdx = args.indexOf('--dialect');
    if (dIdx === -1) dIdx = args.indexOf('-d');
    if (dIdx !== -1) dialect = args[dIdx + 1];
    let files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.js')).sort();
    if (sub === 'down') files = files.reverse();
    if (count != null) files = files.slice(0, count);
    if (files.length === 0) {
      console.log('No migrations to process.');
      process.exit(0);
    }
    const { generateMigrationSQL } = require(path.join(__dirname, '..', 'skemabase-js', 'src', 'migration'));
    for (const file of files) {
      const migration = require(path.join(process.cwd(), 'migrations', file));
      const { upSQL, downSQL } = generateMigrationSQL(migration, { dialect });
      console.log(`-- Migration: ${file}`);
      console.log(sub === 'up' ? upSQL : downSQL);
      console.log();
    }
    if (!dryRun) console.log('Note: live execution not yet implemented.');
    process.exit(0);
  }
  printError(`Error: Unrecognized migrate subcommand: ${sub}`);
} else {
  printError(`Error: Unrecognized command: ${args.join(' ')}`);
}