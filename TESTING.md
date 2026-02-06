# Testing Your Package Before Publishing

Follow these steps to test `dev-forge` locally before publishing to npm.

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git installed and configured

## Step 1: Prepare the Package

### 1.1 Update Package Metadata

Edit `package.json` and update:

```json
{
  "name": "@your-actual-scope/dev-forge",
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/dev-forge.git"
  }
}
```

### 1.2 Initialize Git Repository

```bash
cd dev-forge
git init
git add .
git commit -m "feat: initial package setup"
```

## Step 2: Link the Package Locally

### 2.1 Create Global Link

From the `dev-forge` directory:

```bash
npm link
```

This creates a global symlink to your package.

### 2.2 Verify Link

```bash
npm list -g --depth=0 | grep dev-forge
```

You should see your package listed.

## Step 3: Test in a Sample Project

### 3.1 Create Test Project

```bash
mkdir ~/test-dev-forge
cd ~/test-dev-forge
npm init -y
```

### 3.2 Link Your Package

```bash
npm link dev-forge
```

### 3.3 Initialize the Toolkit

```bash
npx forge init
```

**Expected Output**:
```
🔧 Initializing dev-forge...

   ✓ Created biome.json
   ✓ Created .stylelintrc.json
   ✓ Created .npmpackagejsonlintrc.json
   ✓ Created .commitlintrc.json
   ✓ Created lefthook.yml

🪝 Installing Git hooks...
   ✓ Lefthook installed successfully

📝 Updating package.json...
   ✓ Added "prepare" script to package.json

📦 Configuration files created:
   - biome.json
   - .stylelintrc.json
   - .npmpackagejsonlintrc.json
   - .commitlintrc.json
   - lefthook.yml

✅ dev-forge initialized successfully!
```

### 3.4 Verify Configuration Files

```bash
ls -la
```

You should see:
- `biome.json`
- `.stylelintrc.json`
- `.npmpackagejsonlintrc.json`
- `.commitlintrc.json`
- `lefthook.yml`

### 3.5 Check package.json

```bash
cat package.json
```

Verify it contains:
```json
{
  "scripts": {
    "prepare": "forge init"
  }
}
```

## Step 4: Test Check Command

### 4.1 Create Test Files

Create some test files with intentional issues:

```bash
# JavaScript file with linting issues
cat > test.js << 'EOF'
var x = 5;  // Should use const/let
console.log(x)  // Missing semicolon
EOF

# CSS file with issues
cat > style.css << 'EOF'
.test {
    color: red !important;  /* Should avoid !important */
}
EOF
```

### 4.2 Run Checks

```bash
npx forge check
```

**Expected**: Should report linting issues

### 4.3 Run Fix

```bash
npx forge fix
```

**Expected**: Should auto-fix the issues

### 4.4 Verify Fixes

```bash
cat test.js
cat style.css
```

Files should be formatted correctly.

## Step 5: Test Git Hooks

### 5.1 Initialize Git

```bash
git init
```

### 5.2 Stage Files

```bash
git add .
```

### 5.3 Test Pre-commit Hook

Try committing with poorly formatted code:

```bash
# Create file with issues
echo "var bad=1" > bad.js
git add bad.js
git commit -m "test: bad code"
```

**Expected**: Pre-commit hook should catch issues and prevent commit

### 5.4 Fix and Commit

```bash
npx forge fix
git add .
git commit -m "test: good code"
```

**Expected**: Commit should succeed

### 5.5 Test Commit Message Hook

Try an invalid commit message:

```bash
git commit --allow-empty -m "bad commit message"
```

**Expected**: Should fail with commitlint error

Try a valid commit message:

```bash
git commit --allow-empty -m "feat: add new feature"
```

**Expected**: Should succeed

## Step 6: Test CLI Commands

### 6.1 Test Help Command

```bash
npx forge --help
```

**Expected**: Should display help text with all commands

### 6.2 Test Version Command

```bash
npx forge --version
```

**Expected**: Should display version number

### 6.3 Test with Options

```bash
npx forge check --no-parallel
npx forge init --skip-hooks
```

**Expected**: Commands should respect options

## Step 7: Test Idempotency

### 7.1 Run Init Multiple Times

```bash
npx forge init
npx forge init
npx forge init
```

**Expected**: Should handle gracefully, show "already exists (skipped)" messages

### 7.2 Verify No Duplicates

```bash
cat package.json
```

**Expected**: Should not have duplicate prepare scripts

## Step 8: Test Error Scenarios

### 8.1 Test Without Git

```bash
mkdir ~/test-no-git
cd ~/test-no-git
npm init -y
npm link dev-forge
npx forge init
```

**Expected**: Should warn about missing .git directory but continue

### 8.2 Test with Empty Project

```bash
mkdir ~/test-empty
cd ~/test-empty
npm link dev-forge
npx forge check
```

**Expected**: Should handle gracefully, skip checks for missing files

## Step 9: Test Package Contents

### 9.1 Create Tarball

```bash
cd ~/dev-forge
npm pack
```

This creates a `.tgz` file.

### 9.2 Inspect Tarball

```bash
tar -tzf your-scope-dev-forge-1.0.0.tgz
```

**Verify it includes**:
- `package/bin/`
- `package/lib/`
- `package/configs/`
- `package/README.md`
- `package/index.js`
- `package/index.d.ts`

**Verify it excludes**:
- Test files
- `.git` directory
- `node_modules`
- Development files

### 9.3 Test Installation from Tarball

```bash
mkdir ~/test-tarball
cd ~/test-tarball
npm init -y
npm install ~/dev-forge/your-scope-dev-forge-1.0.0.tgz
npx forge init
```

**Expected**: Should work exactly like linked version

## Step 10: Cross-Platform Testing

### 10.1 Test on Windows (if available)

Use WSL or a Windows machine:
```bash
npm link dev-forge
npx forge init
npx forge check
```

### 10.2 Test on macOS (if available)

```bash
npm link dev-forge
npx forge init
npx forge check
```

### 10.3 Test Path Handling

Verify configuration files have correct paths (forward slashes in extends).

## Step 11: Performance Testing

### 11.1 Test on Large Project

Clone a large open-source project:
```bash
git clone https://github.com/facebook/react.git
cd react
npm link dev-forge
npx forge init
time npx forge check
```

### 11.2 Test Parallel vs Sequential

```bash
time npx forge check
time npx forge check --no-parallel
```

**Expected**: Parallel should be faster

## Step 12: Clean Up

### 12.1 Unlink Package

From test projects:
```bash
npm unlink dev-forge
```

From package directory:
```bash
npm unlink
```

### 12.2 Remove Test Projects

```bash
rm -rf ~/test-dev-forge ~/test-no-git ~/test-empty ~/test-tarball
```

## Common Issues and Solutions

### Issue: "Command not found: forge"

**Solution**: 
```bash
npm link
# or
npm install -g .
```

### Issue: "Cannot find module"

**Solution**: 
```bash
npm install
npm link
```

### Issue: Git hooks not running

**Solution**:
```bash
npx forge init
# Ensure you're in a git repository
git init
```

### Issue: "Permission denied" on CLI

**Solution**:
```bash
chmod +x bin/cli.js
```

## Checklist Before Publishing

- [ ] All tests pass
- [ ] Package installs correctly from tarball
- [ ] CLI commands work as expected
- [ ] Git hooks function properly
- [ ] Configuration files generate correctly
- [ ] Idempotency verified
- [ ] Error scenarios handled gracefully
- [ ] Documentation is accurate
- [ ] Version number is correct
- [ ] CHANGELOG.md is updated
- [ ] No sensitive data in package
- [ ] Cross-platform compatibility verified

## Next Steps

Once all tests pass:

1. **Review** the package one more time
2. **Update** version if needed
3. **Commit** all changes
4. **Tag** the release
5. **Publish** to npm (see PUBLISHING.md)

## Getting Help

If you encounter issues:

1. Check the ARCHITECTURE.md for implementation details
2. Review error messages carefully
3. Test in a clean environment
4. Check npm logs: `npm --verbose install`
5. Open an issue on GitHub with details

---

**Happy Testing!** 🚀
