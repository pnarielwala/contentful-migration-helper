import { MigrationFunction } from 'contentful-migration';

export = function (migration) {
  const testType = migration.createContentType('testType').name('Test Type');

  testType.createField('title').type('Symbol').name('Title').required(true);

  testType.displayField('title');
} as MigrationFunction;
