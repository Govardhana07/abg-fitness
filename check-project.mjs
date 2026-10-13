
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const read = (p) => readFileSync(path.join(root, p), 'utf8');

const requiredFiles = [
  'index.html',
  'manifest.webmanifest',
  'sw.js',
  'capacitor.config.json',
  'package.json',
  'cloud-sync.js',
  'supabase-config.js',
  'schema.sql',
];

for (const file of requiredFiles) {
  if (!existsSync(path.join(root, file))) {
    throw new Error(`Required file not found: ${file}`);
  }
}

const html = read('index.html');

if (
  !html.includes('All About Gym') &&
  !html.includes('id="home"')
) {
  throw new Error('Core ABG UI not found in index.html');
}

const js = [
  ...html.matchAll(
    /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi
  ),
]
  .map((m) => m[1])
  .filter((s) => s.trim());

for (const [i, source] of js.entries()) {
  try {
    new Function(source);
  } catch (error) {
    throw new Error(
      `Inline script ${i + 1} has a syntax error: ${error.message}`
    );
  }
}

JSON.parse(read('manifest.webmanifest'));
JSON.parse(read('capacitor.config.json'));
JSON.parse(read('package.json'));

console.log('ABG project checks passed.');
console.log(`Checked ${requiredFiles.length} required files.`);
console.log('Note: This is static validation, not a live backend or device test.');
