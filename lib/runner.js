const execa = require('execa');
const path = require('path');
const fs = require('fs-extra');

const CWD = process.cwd();
const TOOLKIT_ROOT = path.join(__dirname, '..');

/**
 * Get the path to a tool's binary in the toolkit's node_modules
 */
function getToolBin(toolName) {
  return path.join(TOOLKIT_ROOT, 'node_modules/.bin', toolName);
}

/**
 * Run a command and handle output
 */
async function runCommand(command, args, options = {}) {
  const toolName = path.basename(command);
  console.log(`\n🔍 Running ${toolName}...`);
  
  try {
    const result = await execa(command, args, {
      cwd: CWD,
      stdio: 'inherit',
      ...options,
    });
    
    console.log(`✅ ${toolName} completed successfully`);
    return result;
  } catch (error) {
    console.error(`❌ ${toolName} failed`);
    throw error;
  }
}

/**
 * Run all checks in parallel or sequentially
 */
async function runCheck(options = {}) {
  console.log('🔎 Running comprehensive checks...\n');
  
  const checks = [
    async () => {
      // Biome check
      const biomeBin = getToolBin('biome');
      return runCommand(biomeBin, ['check', '.']);
    },
    async () => {
      // Stylelint check
      const stylelintBin = getToolBin('stylelint');
      const patterns = ['**/*.css', '**/*.scss', '**/*.sass'];
      
      // Check if any style files exist
      let hasStyleFiles = false;
      for (const pattern of patterns) {
        const files = await fs.pathExists(path.join(CWD, pattern.split('/')[0]));
        if (files) {
          hasStyleFiles = true;
          break;
        }
      }
      
      if (!hasStyleFiles) {
        console.log('\n⊙ Stylelint skipped (no style files found)');
        return;
      }
      
      return runCommand(stylelintBin, patterns);
    },
    async () => {
      // Knip check
      const knipBin = getToolBin('knip');
      return runCommand(knipBin, []);
    },
    async () => {
      // npm-package-json-lint
      const pkgLintBin = getToolBin('npmPkgJsonLint');
      const pkgPath = path.join(CWD, 'package.json');
      
      if (!await fs.pathExists(pkgPath)) {
        console.log('\n⊙ package-json-lint skipped (no package.json found)');
        return;
      }
      
      return runCommand(pkgLintBin, ['.']);
    },
  ];
  
  if (options.parallel !== false) {
    // Run in parallel
    const results = await Promise.allSettled(checks.map(check => check()));
    
    const failures = results.filter(r => r.status === 'rejected');
    if (failures.length > 0) {
      throw new Error(`${failures.length} check(s) failed`);
    }
  } else {
    // Run sequentially
    for (const check of checks) {
      await check();
    }
  }
}

/**
 * Run auto-fix operations
 */
async function runFix() {
  console.log('🔧 Running auto-fix operations...\n');
  
  // Biome fix
  const biomeBin = getToolBin('biome');
  await runCommand(biomeBin, ['check', '--write', '.']);
  
  // Stylelint fix
  const stylelintBin = getToolBin('stylelint');
  const patterns = ['**/*.css', '**/*.scss', '**/*.sass'];
  
  try {
    await runCommand(stylelintBin, [...patterns, '--fix'], { reject: false });
  } catch (error) {
    // Stylelint might fail if no files found, which is okay
    console.log('   ⊙ Stylelint fix completed (some files may not have been fixable)');
  }
}

/**
 * Run Biome on staged files (for Git hooks)
 */
async function runBiomeStaged(files) {
  if (!files || files.length === 0) {
    console.log('⊙ No staged files to check');
    return;
  }
  
  const biomeBin = getToolBin('biome');
  const jsFiles = files.filter(f => /\.(js|jsx|ts|tsx|json|jsonc)$/.test(f));
  
  if (jsFiles.length === 0) {
    return;
  }
  
  console.log(`🔍 Checking ${jsFiles.length} file(s) with Biome...`);
  await execa(biomeBin, ['check', ...jsFiles], {
    cwd: CWD,
    stdio: 'inherit',
  });
}

/**
 * Run Stylelint on staged files (for Git hooks)
 */
async function runStylelintStaged(files) {
  if (!files || files.length === 0) {
    console.log('⊙ No staged style files to check');
    return;
  }
  
  const stylelintBin = getToolBin('stylelint');
  const styleFiles = files.filter(f => /\.(css|scss|sass)$/.test(f));
  
  if (styleFiles.length === 0) {
    return;
  }
  
  console.log(`🎨 Checking ${styleFiles.length} style file(s) with Stylelint...`);
  await execa(stylelintBin, styleFiles, {
    cwd: CWD,
    stdio: 'inherit',
  });
}

module.exports = {
  runCheck,
  runFix,
  runBiomeStaged,
  runStylelintStaged,
  getToolBin,
  runCommand,
};
