const { spawnSync } = require('child_process');
const path = require('path');
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
});