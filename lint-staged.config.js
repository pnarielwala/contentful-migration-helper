module.exports = {
  '{example,src}/**/*': 'prettier --write',
  'src/**/*': [() => 'yarn jest'],
  'src/**/*.ts': [() => 'yarn tsc'],
};
