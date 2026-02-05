# Quick Start Guide

Get up and running with `@your-scope/dev-forge` in 5 minutes.

## Installation

```bash
npm install --save-dev @your-scope/dev-forge
```

## Initialize

Run the init command to set up configuration and Git hooks:

```bash
npx forge init
```

This creates:
- `biome.json` - JS/TS/JSON linting and formatting
- `.stylelintrc.json` - CSS/SCSS linting
- `.npmpackagejsonlintrc.json` - package.json validation
- `.commitlintrc.json` - Commit message validation
- `lefthook.yml` - Git hooks configuration

## Add Scripts

Add these to your `package.json`:

```json
{
  "scripts": {
    "lint": "forge check",
    "lint:fix": "forge fix"
  }
}
```

## Usage

### Run all checks
```bash
npm run lint
```

This runs:
- ✓ Biome (JS/TS/JSON linting & formatting)
- ✓ Stylelint (CSS/SCSS linting)
- ✓ Knip (unused code detection)
- ✓ npm-package-json-lint (package.json validation)

### Auto-fix issues
```bash
npm run lint:fix
```

This fixes:
- ✓ Code formatting with Biome
- ✓ CSS/SCSS issues with Stylelint

## Git Hooks

Git hooks run automatically:

### Pre-commit
Runs when you commit code:
```bash
git commit -m "feat: add new feature"
```

Checks:
- Biome on staged JS/TS/JSON files
- Stylelint on staged CSS/SCSS files
- package-json-lint if package.json changed

### Commit Message Validation
Your commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/):

✅ Valid:
```
feat: add user authentication
fix: resolve memory leak
docs: update README
chore: upgrade dependencies
```

❌ Invalid:
```
Added user authentication
fixing bug
WIP
```

## Example Workflow

1. **Make changes** to your code
2. **Stage changes**: `git add .`
3. **Commit**: `git commit -m "feat: add new feature"`
   - Pre-commit hook runs automatically
   - Commit message is validated
4. **Fix issues** if hooks fail: `npm run lint:fix`
5. **Try commit again**

## Common Commands

| Command | Description |
|---------|-------------|
| `npx forge init` | Initialize dev-forge |
| `npx forge check` | Run all checks |
| `npx forge fix` | Auto-fix issues |
| `npm run lint` | Run checks (if script added) |
| `npm run lint:fix` | Auto-fix (if script added) |

## Customization

All tools come pre-configured, but you can customize by editing the generated config files.

Example - Disable a Biome rule:

**biome.json**:
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

## CI/CD Integration

Add to your GitHub Actions workflow:

```yaml
- name: Lint
  run: npx forge check
```

## Troubleshooting

### Git hooks not running?
```bash
npx forge init
```

### Want to skip hooks temporarily?
```bash
git commit --no-verify -m "message"
```

### Need help?
```bash
npx forge --help
```

## Next Steps

- Read the full [README](./README.md)
- Check out [examples](./examples)
- See [configuration options](./README.md#configuration)
- Learn about [contributing](./CONTRIBUTING.md)

## Support

- 📖 [Documentation](./README.md)
- 🐛 [Report Issues](https://github.com/your-org/dev-forge/issues)
- 💬 [Discussions](https://github.com/your-org/dev-forge/discussions)
