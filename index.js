/**
 * @your-scope/dev-forge
 * Zero-config developer toolkit with unified CLI
 */

const { initToolkit } = require('./lib/init');
const {
  runCheck,
  runFix,
  runBiomeStaged,
  runStylelintStaged,
  getToolBin,
  runCommand,
} = require('./lib/runner');

module.exports = {
  // Initialization
  initToolkit,

  // Runners
  runCheck,
  runFix,
  runBiomeStaged,
  runStylelintStaged,

  // Utilities
  getToolBin,
  runCommand,
};
