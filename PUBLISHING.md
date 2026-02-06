# Publishing Guide

This guide walks you through publishing `dev-forge` to npm.

## Pre-requisites

1. **npm account**: Create one at https://www.npmjs.com/signup
2. **npm CLI login**: Run `npm login` and enter your credentials
3. **npm organization** (for scoped packages): Create at https://www.npmjs.com/org/create

## First-Time Setup

### 1. Update Package Scope

Replace `@your-scope` with your actual npm organization or username:

```bash
# In package.json, change:
"name": "dev-forge"
# To:
"name": "dev-forge"
```

### 2. Update Repository URLs

In `package.json`, update:
```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/vinesheg1/dev-forge.git"
  },
  "bugs": {
    "url": "https://github.com/vinesheg1/dev-forge/issues"
  },
  "homepage": "https://github.com/vinesheg1/dev-forge#readme"
}
```

### 3. Update Author Information

```json
{
  "author": "Your Name <your.email@example.com>"
}
```

## Pre-publish Checklist

- [ ] All tests pass locally
- [ ] Version number updated in `package.json`
- [ ] `CHANGELOG.md` updated with changes
- [ ] `README.md` is up to date
- [ ] All files are included in `package.json` `files` array
- [ ] `.npmignore` excludes development files
- [ ] No sensitive data in the package
- [ ] License file is present

## Testing the Package Locally

Before publishing, test the package locally:

### 1. Create a tarball
```bash
npm pack
```

This creates a `.tgz` file like `your-scope-dev-forge-1.0.0.tgz`

### 2. Test installation
```bash
# In a test directory
mkdir test-install
cd test-install
npm init -y
npm install /path/to/your-scope-dev-forge-1.0.0.tgz
npx forge init
npx forge check
```

### 3. Test with npm link
```bash
# In the dev-forge directory
npm link

# In a test project
npm link dev-forge
npx forge init
```

## Publishing to npm

### Option 1: Manual Publishing

1. **Dry run** to see what will be published:
```bash
npm publish --dry-run
```

2. **Publish** the package:
```bash
# For scoped packages (public)
npm publish --access public

# For unscoped packages
npm publish
```

### Option 2: Using npm version

This automatically updates version, creates a git tag, and publishes:

```bash
# Patch release (1.0.0 -> 1.0.1)
npm version patch

# Minor release (1.0.0 -> 1.1.0)
npm version minor

# Major release (1.0.0 -> 2.0.0)
npm version major

# Then publish
npm publish --access public
```

### Option 3: CI/CD Publishing (GitHub Actions)

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Post-publish Steps

1. **Verify publication**:
```bash
npm view dev-forge
```

2. **Test installation from npm**:
```bash
npm install -g dev-forge
forge --version
```

3. **Create GitHub release**:
   - Go to your repository's releases page
   - Create a new release with the version tag
   - Include changelog notes

4. **Update documentation**:
   - Announce the release
   - Update any integration guides
   - Share on social media if applicable

## Version Numbering (Semver)

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0 -> 2.0.0): Breaking changes
- **MINOR** (1.0.0 -> 1.1.0): New features, backwards-compatible
- **PATCH** (1.0.0 -> 1.0.1): Bug fixes, backwards-compatible

Examples:
```bash
npm version patch  # Bug fixes
npm version minor  # New features
npm version major  # Breaking changes
```

## npm Package Access

### Public Package (Recommended)
```bash
npm publish --access public
```

### Private Package (Requires paid npm account)
```bash
npm publish --access restricted
```

## Troubleshooting

### Error: "You must be logged in to publish packages"
```bash
npm login
```

### Error: "Package name too similar to existing package"
Choose a more unique name or use a scoped package.

### Error: "You do not have permission to publish"
Ensure you're a member of the organization or own the package name.

### Package not appearing on npm
Wait a few minutes for npm's CDN to update, then check again.

## Updating a Published Package

1. Make changes
2. Update version: `npm version patch/minor/major`
3. Update CHANGELOG.md
4. Commit changes: `git commit -am "chore: release v1.0.1"`
5. Push to repository: `git push && git push --tags`
6. Publish: `npm publish --access public`

## Deprecating a Version

If you need to deprecate a version:

```bash
npm deprecate dev-forge@1.0.0 "This version has a critical bug, please upgrade"
```

## Unpublishing (Use with Caution)

You can only unpublish within 72 hours of publishing:

```bash
npm unpublish dev-forge@1.0.0
```

**Note**: Unpublishing is discouraged as it breaks dependent projects.

## Resources

- [npm Documentation](https://docs.npmjs.com/)
- [Semantic Versioning](https://semver.org/)
- [npm Scoped Packages](https://docs.npmjs.com/about-scopes)
- [Creating and Publishing Packages](https://docs.npmjs.com/packages-and-modules)
