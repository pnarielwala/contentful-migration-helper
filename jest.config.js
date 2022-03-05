// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // The root directory that Jest should scan for tests and modules within
  rootDir: 'src',

  // The test environment that will be used for testing
  testEnvironment: 'node',

  // Allow for absolute paths
  moduleDirectories: ['node_modules', 'src'],

  // Match test files using the .spec/.test extension prefix
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],

  // TypeScript preprocessor
  preset: 'ts-jest',

  // Allow ts-jest to access local tsconfig
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
}
