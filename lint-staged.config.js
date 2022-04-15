module.exports = {
  '{example,src}/**/*': 'prettier --write',
  'src/**/*': 'jest',
  'src/**/*.ts': [() => 'yarn tsc'],
};
