# Architecture Documentation

This document explains the internal architecture of `dev-forge`.

## Design Philosophy

### Zero-Config
Users get a working setup with a single command (`forge init`). No manual configuration of individual tools required.

### Single Dependency
Only one package to install instead of 6+ separate linter/formatter packages and their plugins.

### Extensibility
Users can override any default configuration while still benefiting from toolkit updates.

### Idempotency
Running `forge init` multiple times is safe and won't break existing configurations.

## Project Structure

```
dev-forge/
├── bin/
│   └── cli.js              # CLI entry point (commander)
├── lib/
│   ├── init.js             # Initialization and scaffolding logic
│   └── runner.js           # Tool execution and orchestration
├── configs/
│   ├── biome.json          # Default Biome rules
│   ├── stylelint.json      # Default Stylelint rules
│   ├── pkg-lint.json       # Default package.json lint rules
│   └── lefthook.yml        # Git hooks configuration
├── examples/
│   └── sample-project/     # Example usage
├── index.js                # Programmatic API exports
├── index.d.ts              # TypeScript type definitions
└── package.json            # Package manifest
```

## Components

### 1. CLI (`bin/cli.js`)

**Technology**: Commander.js

**Responsibilities**:
- Parse command-line arguments
- Route commands to appropriate handlers
- Display help and version information

**Commands**:
- `forge init` → Calls `initToolkit()`
- `forge check` → Calls `runCheck()`
- `forge fix` → Calls `runFix()`

### 2. Initialization (`lib/init.js`)

**Responsibilities**:
- Generate local configuration files
- Initialize Git hooks via Lefthook
- Update user's package.json with prepare script

**Key Functions**:

#### `initToolkit(options)`
Main initialization function. Orchestrates the setup process.

#### `generateConfigFiles()`
Creates configuration files that extend toolkit's internal configs using relative paths.

**Strategy**:
- Uses `extends` property for configs that support it (Biome, Stylelint, pkg-lint)
- Copies `lefthook.yml` directly (doesn't support extends)
- Uses `path.relative()` for cross-platform compatibility

#### `initializeLefthook()`
Runs `lefthook install` to set up Git hooks.

**Error Handling**:
- Checks for `.git` directory existence
- Gracefully handles missing Git repository
- Provides helpful error messages

#### `updatePackageJson()`
Adds `prepare` script to user's package.json.

**Idempotency**:
- Only adds script if missing
- Appends to existing prepare script if present
- Won't duplicate if already includes `forge init`

### 3. Runner (`lib/runner.js`)

**Technology**: execa (for subprocess execution)

**Responsibilities**:
- Execute tools from toolkit's node_modules
- Handle parallel/sequential execution
- Provide consistent error handling and output

**Key Functions**:

#### `getToolBin(toolName)`
Returns path to a tool's binary in toolkit's node_modules.

**Why**: Ensures user doesn't need tools installed globally or in their own node_modules.

#### `runCommand(command, args, options)`
Wrapper around execa with consistent error handling and logging.

#### `runCheck(options)`
Orchestrates all quality checks.

**Execution**:
- **Parallel** (default): Uses `Promise.allSettled()` for speed
- **Sequential** (--no-parallel): Runs checks one by one

**Tools Run**:
1. Biome - Lints and checks formatting
2. Stylelint - Validates CSS/SCSS (skips if no style files)
3. Knip - Finds unused code and dependencies
4. npm-package-json-lint - Validates package.json (skips if missing)

#### `runFix()`
Runs auto-fix operations sequentially.

**Tools**:
1. Biome - Applies fixes with `--write` flag
2. Stylelint - Fixes with `--fix` flag

### 4. Configuration Files (`configs/`)

#### `biome.json`
Comprehensive Biome configuration with strict rules for:
- Linting (complexity, correctness, security, style, suspicious)
- Formatting (indentation, quotes, semicolons, line width)
- Both JavaScript and JSON

#### `stylelint.json`
Extends `stylelint-config-standard` with additional rules for:
- Color formats
- Selector specificity
- Nesting depth
- SCSS/Sass support

#### `pkg-lint.json`
Validates package.json structure:
- Required fields (author, license, description)
- Alphabetical dependency sorting
- Property ordering
- Valid license values

#### `lefthook.yml`
Defines Git hooks:

**Pre-commit**:
- Runs Biome on staged JS/TS/JSON files
- Runs Stylelint on staged CSS/SCSS files
- Runs pkg-lint if package.json changed
- Uses `stage_fixed: true` to auto-stage fixes

**Commit-msg**:
- Validates commit message with Commitlint
- Enforces Conventional Commits format

## Technical Decisions

### Why CommonJS?
Maximum compatibility with older Node versions and simpler require/resolve logic.

### Why execa?
- Better than child_process for spawning tools
- Proper promise support
- Better error handling
- Cross-platform compatibility

### Why Biome over ESLint/Prettier?
- Significantly faster
- Single tool for linting and formatting
- Zero config needed
- Written in Rust for performance

### Why Lefthook over Husky?
- Faster (written in Go)
- No npm install overhead in hooks
- Better parallel execution
- Native YAML configuration

### Why Commander?
- Industry standard for Node CLIs
- Clean API
- Automatic help generation
- Subcommand support

## Data Flow

### Initialization Flow

```
User runs: npx forge init
        ↓
    CLI parses command
        ↓
    Calls initToolkit()
        ↓
    ┌─────────────────────────┐
    │ generateConfigFiles()   │
    │ - Create biome.json     │
    │ - Create .stylelintrc   │
    │ - Create pkg-lint config│
    │ - Copy lefthook.yml     │
    └─────────────────────────┘
        ↓
    ┌─────────────────────────┐
    │ initializeLefthook()    │
    │ - Check for .git        │
    │ - Run lefthook install  │
    └─────────────────────────┘
        ↓
    ┌─────────────────────────┐
    │ updatePackageJson()     │
    │ - Read package.json     │
    │ - Add prepare script    │
    │ - Write back            │
    └─────────────────────────┘
        ↓
    Success message displayed
```

### Check Flow

```
User runs: npx forge check
        ↓
    CLI parses command
        ↓
    Calls runCheck()
        ↓
    Parallel execution (default):
        ┌────────────┐
        │   Biome    │────┐
        └────────────┘    │
        ┌────────────┐    │
        │ Stylelint  │────┤→ Promise.allSettled()
        └────────────┘    │
        ┌────────────┐    │
        │    Knip    │────┤
        └────────────┘    │
        ┌────────────┐    │
        │  pkg-lint  │────┘
        └────────────┘
        ↓
    Collect results
        ↓
    Report failures if any
```

### Git Hook Flow

```
User commits: git commit -m "message"
        ↓
    Lefthook pre-commit hook triggered
        ↓
    Parallel execution:
        ┌──────────────────────────┐
        │ Biome on staged files    │
        └──────────────────────────┘
        ┌──────────────────────────┐
        │ Stylelint on staged CSS  │
        └──────────────────────────┘
        ┌──────────────────────────┐
        │ pkg-lint if pkg.json     │
        └──────────────────────────┘
        ↓
    If all pass → continue
    If any fail → abort commit
        ↓
    Lefthook commit-msg hook triggered
        ↓
    Commitlint validates message format
        ↓
    If valid → commit succeeds
    If invalid → abort with error
```

## Cross-Platform Compatibility

### Path Handling
- Always use `path.join()` and `path.resolve()`
- Use `path.relative()` for config extends
- Replace backslashes with forward slashes in JSON configs

### Shell Commands
- Use execa instead of shell commands
- Avoid shell-specific syntax
- Test on Windows, macOS, and Linux

### File System
- Use fs-extra for consistent async/sync APIs
- Handle ENOENT errors gracefully
- Check file existence before operations

## Performance Considerations

### Parallel Execution
- `forge check` runs tools in parallel by default
- Uses `Promise.allSettled()` to not fail fast
- Can be disabled with `--no-parallel` for debugging

### Lefthook Performance
- Lefthook runs commands in parallel
- Only processes staged files (not entire codebase)
- Uses glob patterns for efficient file matching

### Biome Performance
- Much faster than ESLint (10-100x)
- Native Rust implementation
- Incremental checking

## Error Handling Strategy

### User-Friendly Messages
- Clear indication of what failed
- Helpful suggestions for fixing issues
- Exit codes for CI/CD integration

### Graceful Degradation
- Missing .git? Skip hooks, continue init
- No style files? Skip Stylelint
- No package.json? Skip pkg-lint

### Idempotent Operations
- All operations can be run multiple times safely
- Existing files are skipped or updated intelligently
- No destructive operations without user consent

## Security Considerations

### No Arbitrary Code Execution
- All tool paths are validated
- No shell injection vulnerabilities
- Sandboxed subprocess execution

### Dependency Security
- Minimal dependency tree
- Well-known, maintained packages
- Regular security audits

## Testing Strategy

### Manual Testing
- Link package locally with `npm link`
- Test in sample projects
- Verify idempotency by running commands multiple times

### Cross-Platform Testing
- Test on Windows, macOS, Linux
- Verify path handling works correctly
- Check Git hooks function properly

### Integration Testing
- Test with various project types
- Verify tool integrations work
- Check error scenarios

## Future Enhancements

### Potential Features
- Plugin system for custom tools
- Interactive configuration wizard
- Performance reporting
- Auto-fix on save (IDE integration)
- Custom rule presets
- Team-wide configuration syncing

### Optimization Opportunities
- Cache tool results
- Incremental checking
- Workspace support for monorepos
- Distributed checking for large codebases

## Maintenance

### Dependency Updates
- Regular updates to tool versions
- Backward compatibility checks
- Changelog documentation

### Configuration Updates
- Keep default configs up-to-date with best practices
- Document breaking changes
- Provide migration guides

## Support and Resources

### Documentation
- README.md - Main documentation
- QUICKSTART.md - Getting started guide
- ARCHITECTURE.md - This file
- CONTRIBUTING.md - Contribution guidelines
- PUBLISHING.md - Publishing guide

### External Resources
- Biome documentation: https://biomejs.dev/
- Lefthook documentation: https://github.com/evilmartians/lefthook
- Commitlint documentation: https://commitlint.js.org/
- Stylelint documentation: https://stylelint.io/
- Knip documentation: https://knip.dev/
