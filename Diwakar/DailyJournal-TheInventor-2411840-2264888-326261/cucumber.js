// cucumber.js
// Cucumber configuration for Playwright + Cucumber integration

module.exports = {
  default: `--require-module ts-node/register --require ./tests/steps/**/*.js --publish-quiet`
};
