/** @type {import('jest').Config} */
const config = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'html', 'text-summary', 'lcov'],
  testEnvironment: 'node',
  verbose: true,
};

export default config;
