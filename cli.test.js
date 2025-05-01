const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');
// Load package.json to check version
const pkg = require(path.join(__dirname, 'package.json'));

describe('skemabase CLI', () => {
  const node = process.execPath;
  const cli = path.join(__dirname, 'bin', 'cli.js');

  it('should display help with --help', () => {
    const result = spawnSync(node, [cli, '--help'], { encoding: 'utf-8' });
    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/Usage:/);
    expect(result.stderr).toBe('');
  });

  it('should display help with -h', () => {
    const result = spawnSync(node, [cli, '-h'], { encoding: 'utf-8' });
    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/Usage:/);
    expect(result.stderr).toBe('');
  });

  it('should display version with --version', () => {
    const result = spawnSync(node, [cli, '--version'], { encoding: 'utf-8' });
    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe(pkg.version);
    expect(result.stderr).toBe('');
  });

  it('should display version with -v', () => {
    const result = spawnSync(node, [cli, '-v'], { encoding: 'utf-8' });
    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe(pkg.version);
    expect(result.stderr).toBe('');
  });

  it('should error when missing input for parse', () => {
    const result = spawnSync(node, [cli, 'parse'], { encoding: 'utf-8' });
    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/Error: Missing input file for parse command\./);
    expect(result.stdout).toMatch(/Usage:/);
  });

  it('should error when missing input for generate sql', () => {
    const result = spawnSync(node, [cli, 'generate', 'sql'], { encoding: 'utf-8' });
    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/Error: Missing input file for generate sql command\./);
    expect(result.stdout).toMatch(/Usage:/);
  });

  it('should error on unrecognized commands', () => {
    const result = spawnSync(node, [cli, 'foo'], { encoding: 'utf-8' });
    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/Error: Unrecognized command: foo/);
    expect(result.stdout).toMatch(/Usage:/);
  });
  
  it('should error on unsupported dialect', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'skemabase-'));
    const file = path.join(tmp, 'schema.sb');
    fs.writeFileSync(file, 'User has attributes: name');
    const result = spawnSync(node, [cli, 'generate', 'sql', file, '--dialect', 'mysql'], { encoding: 'utf-8' });
    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/Error generating SQL: Unsupported dialect: mysql/);
    expect(result.stdout).toMatch(/Usage:/);
  });

  it('should parse empty file to empty JSON array', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'skemabase-'));
    const file = path.join(tmp, 'empty.sb');
    fs.writeFileSync(file, '');
    const result = spawnSync(node, [cli, 'parse', file], { encoding: 'utf-8' });
    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe('[]');
    expect(result.stderr).toBe('');
  });

  it('should parse whitespace-only file to empty JSON array', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'skemabase-'));
    const file = path.join(tmp, 'ws.sb');
    fs.writeFileSync(file, '   \n  \n');
    const result = spawnSync(node, [cli, 'parse', file], { encoding: 'utf-8' });
    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe('[]');
    expect(result.stderr).toBe('');
  });

  it('should handle combined flags -h -v by printing version', () => {
    const result = spawnSync(node, [cli, '-h', '-v'], { encoding: 'utf-8' });
    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe(pkg.version);
    expect(result.stderr).toBe('');
  });
});