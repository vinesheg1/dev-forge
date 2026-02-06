// Type definitions for dev-forge

export interface InitOptions {
  skipHooks?: boolean;
}

export interface CheckOptions {
  parallel?: boolean;
}

/**
 * Initialize the toolkit in the user's project
 * This function is idempotent - safe to run multiple times
 */
export function initToolkit(options?: InitOptions): Promise<void>;

/**
 * Run all checks (Biome, Stylelint, Knip, package-json-lint)
 */
export function runCheck(options?: CheckOptions): Promise<void>;

/**
 * Run auto-fix operations (Biome and Stylelint)
 */
export function runFix(): Promise<void>;

/**
 * Get the path to a tool's binary in the toolkit's node_modules
 */
export function getToolBin(toolName: string): string;

/**
 * Run a command and handle output
 */
export function runCommand(
  command: string,
  args: string[],
  options?: Record<string, any>
): Promise<any>;

/**
 * Run Biome on staged files (for Git hooks)
 */
export function runBiomeStaged(files: string[]): Promise<void>;

/**
 * Run Stylelint on staged files (for Git hooks)
 */
export function runStylelintStaged(files: string[]): Promise<void>;
