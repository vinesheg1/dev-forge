# 🛠️ dev-forge

**The Zero-Config Meta-Toolkit for High-Performance Frontend Engineering.**

`dev-forge` is a unified CLI that consolidates industry-standard tooling into a single package. Stop managing 20+ `devDependencies` and complex configuration files. With one command, bake professional-grade linting, formatting, and git-hooks into any project.

---

## 🚀 Features

- **⚡ Biome-Powered:** Lightning-fast linting and formatting that replaces ESLint and Prettier.
- **🔍 Knip Audit:** Automatically finds unused files, dependencies, and exports to keep your bundle lean.
- **🛡️ High-Performance Hooks:** Uses **Lefthook** (Go-based) for near-instant git-hook execution.
- **📝 Commit Standards:** Enforces **Conventional Commits** out of the box with Commitlint.
- **🎯 Zero-Config:** Intelligent defaults that work for Next.js, React, and Node.js without manual setup.

---

## 📦 Installation

Install the toolkit as a development dependency using your preferred package manager:

```bash
# npm
npm install -D dev-forge

# pnpm
pnpm add -D dev-forge

# bun
bun add -D dev-forge
