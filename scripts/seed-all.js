/**
 * Runs all seed scripts in the correct order (after a DB reset).
 * Usage: node scripts/seed-all.js
 * Or: npm run seed (if wired in package.json)
 */
const { execSync } = require('child_process');
const path = require('path');

const scriptsDir = __dirname;
const run = (script) => {
  console.log(`\n>>> Running ${script}...\n`);
  execSync(`node "${path.join(scriptsDir, script)}"`, { stdio: 'inherit', cwd: path.dirname(scriptsDir) });
};

run('seed-base.js');
run('seed-service-pages.js');
run('seed-icons.js');

console.log('\n>>> All seeds finished.\n');
