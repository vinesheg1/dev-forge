# Contributing to dev-forge

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community

## How to Contribute

### Reporting Bugs

Before creating a bug report, please check existing issues. When creating a bug report, include:

- **Description**: Clear description of the issue
- **Steps to Reproduce**: Detailed steps to reproduce the behavior
- **Expected Behavior**: What you expected to happen
- **Actual Behavior**: What actually happened
- **Environment**: OS, Node version, npm version
- **Logs**: Any relevant error messages or logs

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case**: Why this enhancement would be useful
- **Examples**: How it would work with examples
- **Alternatives**: Any alternative solutions you've considered

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Install dependencies**: `npm install`
3. **Make your changes**
4. **Test your changes**: Ensure all checks pass
5. **Commit your changes**: Use [Conventional Commits](https://www.conventionalcommits.org/)
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `chore:` for maintenance tasks
   - `refactor:` for code refactoring
6. **Push to your fork** and submit a pull request

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/your-org/dev-forge.git
cd dev-forge
```

2. Install dependencies:
```bash
npm install
```

3. Link the package locally for testing:
```bash
npm link
```

4. Create a test project:
```bash
mkdir test-project
cd test-project
npm init -y
npm link @your-scope/dev-forge
npx forge init
```

## Project Structure

```
dev-forge/
├── bin/
│   └── cli.js          # CLI entry point
├── lib/
│   ├── init.js         # Initialization logic
│   └── runner.js       # Tool execution logic
├── configs/
│   ├── biome.json      # Biome configuration
│   ├── stylelint.json  # Stylelint configuration
│   ├── pkg-lint.json   # Package.json lint rules
│   └── lefthook.yml    # Git hooks configuration
├── examples/           # Example projects
└── package.json        # Package manifest
```

## Testing Changes

### Manual Testing

1. Link the package:
```bash
npm link
```

2. Test in a sample project:
```bash
cd examples/sample-project
npm link @your-scope/dev-forge
npx forge init
npx forge check
```

### Test Scenarios

Before submitting a PR, test:

1. **Fresh installation**: `forge init` in a new project
2. **Re-run idempotency**: `forge init` multiple times
3. **Git hooks**: Make commits to test pre-commit and commit-msg hooks
4. **All commands**: Test `check` and `fix` commands
5. **Cross-platform**: Test on Windows, macOS, and Linux if possible

## Code Style

This project uses its own tooling:

- Run checks: `npx forge check`
- Auto-fix: `npx forge fix`

Follow these guidelines:
- Use CommonJS for CLI scripts
- Use `const` and `let`, not `var`
- Use async/await instead of callbacks
- Add JSDoc comments for functions
- Handle errors gracefully
- Use `path.join()` for cross-platform paths

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope?): subject

body?

footer?
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvement
- `test`: Adding missing tests
- `chore`: Maintenance tasks

Examples:
```
feat(cli): add --verbose flag to check command

fix(init): handle missing .git directory gracefully

docs: update installation instructions

chore: upgrade dependencies
```

## Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create a git tag: `git tag v1.0.0`
4. Push tag: `git push origin v1.0.0`
5. Publish to npm: `npm publish`

## Questions?

Feel free to open an issue for discussion or ask questions!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
