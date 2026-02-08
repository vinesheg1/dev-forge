#!/usr/bin/env node

const { Command } = require("commander");
const path = require("path");
const { initToolkit } = require("../lib/init");
const { runCheck, runFix } = require("../lib/runner");

const program = new Command();

program
	.name("forge")
	.description("Zero-config developer toolkit for modern projects")
	.version(require("../package.json").version);

program
	.command("init")
	.description(
		"Initialize dev-forge in your project (generates configs and sets up Git hooks)",
	)
	.option("--skip-hooks", "Skip Lefthook installation")
	.action(async (options) => {
		try {
			await initToolkit(options);
			console.log("✅ dev-forge initialized successfully!");
		} catch (error) {
			console.error("❌ Initialization failed:", error.message);
			process.exit(1);
		}
	});

program
	.command("check")
	.description("Run all checks (Biome, Stylelint, Knip, package-json-lint)")
	.option("--no-parallel", "Run checks sequentially instead of in parallel")
	.action(async (options) => {
		try {
			await runCheck(options);
			console.log("✅ All checks passed!");
		} catch (error) {
			console.error("❌ Checks failed:", error.message);
			process.exit(1);
		}
	});

program
	.command("fix")
	.description("Auto-fix issues (Biome and Stylelint)")
	.action(async () => {
		try {
			await runFix();
			console.log("✅ Auto-fix completed!");
		} catch (error) {
			console.error("❌ Auto-fix failed:", error.message);
			process.exit(1);
		}
	});

program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
	program.outputHelp();
}
