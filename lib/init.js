const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');

const CWD = process.cwd();
const TOOLKIT_ROOT = path.join(__dirname, '..');

/**
 * Initialize the toolkit in the user's project
 * This function is idempotent - safe to run multiple times
 */
async function initToolkit(options = {}) {
  console.log('🔧 Initializing dev-forge...\n');

  // Step 1: Generate local config files that extend the toolkit's configs
  await generateConfigFiles();

  // Step 2: Initialize Lefthook (Git hooks)
  if (!options.skipHooks) {
    await initializeLefthook();
  }

  // Step 3: Update package.json with prepare script
  await updatePackageJson();

  console.log('\n📦 Configuration files created:');
  console.log('   - biome.json');
  console.log('   - .stylelintrc.json');
  console.log('   - .npmpackagejsonlintrc.json');
  console.log('   - .commitlintrc.json');
  console.log('   - lefthook.yml');
}

/**
 * Generate config files that extend the toolkit's internal configs
 */
async function generateConfigFiles() {
  const configs = [
    {
      name: 'biome.json',
      content: {
        $schema: 'https://biomejs.dev/schemas/1.9.4/schema.json',
        extends: [path.relative(CWD, path.join(TOOLKIT_ROOT, 'configs/biome.json')).replace(/\\/g, '/')],
      },
    },
    {
      name: '.stylelintrc.json',
      content: {
        extends: [path.relative(CWD, path.join(TOOLKIT_ROOT, 'configs/stylelint.json')).replace(/\\/g, '/')],
      },
    },
    {
      name: '.npmpackagejsonlintrc.json',
      content: {
        extends: path.relative(CWD, path.join(TOOLKIT_ROOT, 'configs/pkg-lint.json')).replace(/\\/g, '/'),
      },
    },
    {
      name: '.commitlintrc.json',
      content: {
        extends: ['@commitlint/config-conventional'],
      },
    },
  ];

  for (const config of configs) {
    const configPath = path.join(CWD, config.name);
    
    // Only create if doesn't exist (idempotent)
    if (!await fs.pathExists(configPath)) {
      await fs.writeJson(configPath, config.content, { spaces: 2 });
      console.log(`   ✓ Created ${config.name}`);
    } else {
      console.log(`   ⊙ ${config.name} already exists (skipped)`);
    }
  }

  // Copy lefthook.yml directly (it doesn't support extends)
  const lefthookSrc = path.join(TOOLKIT_ROOT, 'configs/lefthook.yml');
  const lefthookDest = path.join(CWD, 'lefthook.yml');
  
  if (!await fs.pathExists(lefthookDest)) {
    await fs.copy(lefthookSrc, lefthookDest);
    console.log('   ✓ Created lefthook.yml');
  } else {
    console.log('   ⊙ lefthook.yml already exists (skipped)');
  }
}

/**
 * Initialize Lefthook Git hooks
 */
async function initializeLefthook() {
  console.log('\n🪝 Installing Git hooks...');
  
  try {
    const lefthookBin = path.join(TOOLKIT_ROOT, 'node_modules/.bin/lefthook');
    
    // Check if .git directory exists
    const gitDir = path.join(CWD, '.git');
    if (!await fs.pathExists(gitDir)) {
      console.log('   ⚠ No .git directory found. Skipping Git hooks installation.');
      console.log('   Run "git init" first, then run "forge init" again.');
      return;
    }
    
    await execa(lefthookBin, ['install'], { 
      cwd: CWD,
      stdio: 'inherit'
    });
    
    console.log('   ✓ Lefthook installed successfully');
  } catch (error) {
    console.error('   ⚠ Lefthook installation failed:', error.message);
    console.error('   You may need to run "lefthook install" manually.');
  }
}

/**
 * Update user's package.json to include the prepare script
 */
async function updatePackageJson() {
  console.log('\n📝 Updating package.json...');
  
  const pkgPath = path.join(CWD, 'package.json');
  
  if (!await fs.pathExists(pkgPath)) {
    console.log('   ⚠ No package.json found in current directory');
    return;
  }
  
  const pkg = await fs.readJson(pkgPath);
  
  // Initialize scripts if it doesn't exist
  if (!pkg.scripts) {
    pkg.scripts = {};
  }
  
  // Add prepare script if it doesn't exist or doesn't include forge init
  const prepareScript = 'forge init';
  
  if (!pkg.scripts.prepare) {
    pkg.scripts.prepare = prepareScript;
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
    console.log('   ✓ Added "prepare" script to package.json');
  } else if (!pkg.scripts.prepare.includes('forge init')) {
    // Append to existing prepare script
    pkg.scripts.prepare = `${pkg.scripts.prepare} && ${prepareScript}`;
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
    console.log('   ✓ Updated "prepare" script in package.json');
  } else {
    console.log('   ⊙ "prepare" script already includes forge init (skipped)');
  }
}

module.exports = {
  initToolkit,
};
