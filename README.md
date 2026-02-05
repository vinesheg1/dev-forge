# @your-scope/dev-forge

> Zero-config developer toolkit with unified CLI for modern projects

A single-dependency meta-package that provides comprehensive tooling for linting, formatting, Git hooks, and code quality checks.

## Features

✨ **Zero Configuration** - Works out of the box with sensible defaults  
🔧 **Single Dependency** - Install once, get everything you need  
⚡ **High Performance** - Powered by Biome and Lefthook  
🎯 **Comprehensive Checks** - Linting, formatting, dead code detection, and more  
🪝 **Git Hooks** - Automatic pre-commit and commit-msg validation  
📦 **Package Standards** - Validates package.json structure and content

## Tools Included

- **[Biome](https://biomejs.dev/)** - Fast linting and formatting for JS/TS/JSON
- **[Knip](https://knip.dev/)** - Find unused files, dependencies, and exports
- **[Lefthook](https://github.com/evilmartians/lefthook)** - Fast and powerful Git hooks manager
- **[Commitlint](https://commitlint.js.org/)** - Enforce conventional commit messages
- **[Stylelint](https://stylelint.io/)** - Modern CSS/SCSS linter
- **[npm-package-json-lint](https://npmpackagejsonlint.org/)** - Package.json validator

## Installation

```bash
npm install --save-dev @your-scope/dev-forge
```

Or with yarn:

```bash
yarn add --dev @your-scope/dev-forge
```

## Quick Start

1. **Initialize the toolkit** in your project:

```bash
npx forge init
```

This will:
- Generate configuration files (biome.json, .stylelintrc.json, etc.)
- Set up Git hooks via Lefthook
- Add a `prepare` script to your package.json

2. **Run checks** on your codebase:

```bash
npx forge check
```

3. **Auto-fix** issues where possible:

```bash
npx forge fix
```

## CLI Commands

### `forge init`

Initialize dev-forge in your project. Creates configuration files and sets up Git hooks.

```bash
npx forge init [options]
```

**Options:**
- `--skip-hooks` - Skip Lefthook installation

**What it does:**
- Creates `biome.json` that extends toolkit defaults
- Creates `.stylelintrc.json` for CSS/SCSS linting
- Creates `.npmpackagejsonlintrc.json` for package.json validation
- Creates `.commitlintrc.json` for commit message validation
- Copies `lefthook.yml` for Git hook configuration
- Installs Git hooks via Lefthook
- Adds `prepare` script to package.json (runs on `npm install`)

### `forge check`

Run all quality checks on your codebase in parallel.

```bash
npx forge check [options]
```

**Options:**
- `--no-parallel` - Run checks sequentially instead of in parallel

**What it checks:**
- **Biome**: Lints and checks formatting of JS/TS/JSON files
- **Stylelint**: Validates CSS/SCSS/Sass files
- **Knip**: Finds unused files, dependencies, and exports
- **npm-package-json-lint**: Validates package.json structure

### `forge fix`

Auto-fix issues where possible.

```bash
npx forge fix
```

**What it fixes:**
- **Biome**: Applies automatic fixes and formatting
- **Stylelint**: Fixes auto-fixable CSS/SCSS issues

## Git Hooks

After running `forge init`, the following Git hooks are automatically installed:

### Pre-commit Hook

Runs before each commit and checks:
- **Biome** on staged JS/TS/JSON files
- **Stylelint** on staged CSS/SCSS files
- **npm-package-json-lint** if package.json is staged

### Commit-msg Hook

Runs after entering a commit message and validates:
- **Commitlint** enforces [Conventional Commits](https://www.conventionalcommits.org/)

Example valid commit messages:
```
feat: add user authentication
fix: resolve memory leak in worker
docs: update installation instructions
chore: upgrade dependencies
```

## Configuration

All tools come pre-configured with sensible defaults, but you can customize them by editing the generated config files:

### Biome (`biome.json`)

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "extends": ["./node_modules/@your-scope/dev-forge/configs/biome.json"]
}
```

Add your own rules or override defaults:

```json
{
  "extends": ["./node_modules/@your-scope/dev-forge/configs/biome.json"],
  "linter": {
    "rules": {
      "suspicious": {
        "noExplicitAny": "off"
      }
    }
  }
}
```

### Stylelint (`.stylelintrc.json`)

```json
{
  "extends": ["./node_modules/@your-scope/dev-forge/configs/stylelint.json"]
}
```

### npm-package-json-lint (`.npmpackagejsonlintrc.json`)

```json
{
  "extends": "./node_modules/@your-scope/dev-forge/configs/pkg-lint.json"
}
```

### Lefthook (`lefthook.yml`)

The default configuration runs checks on staged files. You can add custom commands:

```yaml
pre-commit:
  parallel: true
  commands:
    biome:
      glob: "*.{js,jsx,ts,tsx,json,jsonc}"
      run: npx biome check --staged {staged_files}
    
    custom-script:
      run: npm run my-custom-check
```

## Package.json Scripts

Add these to your `package.json` for convenience:

```json
{
  "scripts": {
    "prepare": "forge init",
    "lint": "forge check",
    "lint:fix": "forge fix"
  }
}
```

Then use:
```bash
npm run lint      # Run all checks
npm run lint:fix  # Auto-fix issues
```

## CI/CD Integration

Add dev-forge checks to your CI pipeline:

### GitHub Actions

```yaml
name: Quality Checks

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npx forge check
```

### GitLab CI

```yaml
lint:
  image: node:18
  script:
    - npm ci
    - npx forge check
```

## Knip Configuration

Knip automatically detects unused files and dependencies. To customize, create a `knip.json`:

```json
{
  "entry": ["src/index.ts"],
  "project": ["src/**/*.ts"],
  "ignore": ["**/*.test.ts", "scripts/**"]
}
```

## Troubleshooting

### Git hooks not running

If hooks aren't running, try:

```bash
npx forge init
```

This will reinstall Lefthook hooks.

### Lefthook installation fails

Make sure you have a `.git` directory:

```bash
git init
npx forge init
```

### Configuration not found

Run the init command to generate config files:

```bash
npx forge init
```

## Requirements

- Node.js >= 18.0.0
- Git (for Git hooks)

## Philosophy

`@your-scope/dev-forge` follows the principle of **convention over configuration**. It provides:

1. **Sensible defaults** that work for most projects
2. **Easy customization** when you need it
3. **Minimal setup** - one command to get started
4. **Fast feedback** - catch issues before they reach CI/CD

## License

MIT

## Contributing

Issues and pull requests are welcome! Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

## Acknowledgments

Built with these excellent tools:
- [Biome](https://biomejs.dev/)
- [Knip](https://knip.dev/)
- [Lefthook](https://github.com/evilmartians/lefthook)
- [Commitlint](https://commitlint.js.org/)
- [Stylelint](https://stylelint.io/)
- [npm-package-json-lint](https://npmpackagejsonlint.org/)
