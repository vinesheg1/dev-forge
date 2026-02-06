# Sample Project with dev-forge

This is an example project demonstrating how to use `dev-forge`.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Initialize dev-forge (this runs automatically via the `prepare` script):
```bash
npm run prepare
# or manually: npx forge init
```

## Usage

### Run all checks
```bash
npm run lint
```

### Auto-fix issues
```bash
npm run lint:fix
```

## Generated Configuration Files

After running `forge init`, you'll see:

- `biome.json` - Extends toolkit's Biome configuration
- `.stylelintrc.json` - Extends toolkit's Stylelint configuration
- `.npmpackagejsonlintrc.json` - Extends toolkit's package.json linting rules
- `.commitlintrc.json` - Conventional commits configuration
- `lefthook.yml` - Git hooks configuration

## Git Hooks

Git hooks are automatically installed and will run:

- **Pre-commit**: Lint staged files with Biome and Stylelint
- **Commit-msg**: Validate commit message format

## Customization

You can override any configuration by modifying the generated files. For example:

**biome.json**:
```json
{
  "extends": ["./node_modules/dev-forge/configs/biome.json"],
  "linter": {
    "rules": {
      "suspicious": {
        "noExplicitAny": "off"
      }
    }
  }
}
```
