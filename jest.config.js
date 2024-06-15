module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', { sourceMaps: true }],
  },
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
  ],
};
