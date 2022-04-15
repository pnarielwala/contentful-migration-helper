# Contentful Migration Helper

This tool helps developers use Contentful like a database when running migrations to add/edit content types and fields.

## Installation

#### npm

```bash
  npm install contentful-migration-helper
```

#### yarn

```bash
  yarn add contentful-migration-helper
```

## Setup

### Create configuration file

```js
// contentful-migration-tool.config.js

module.exports = {
  spaceId: '<CONTENTFUL_SPACE_ID>',
  managementToken: '<CONTENTFUL_MANAGEMENT_TOKEN>',
  migrationDirectory: '/path/to/migrations',
};
```

## Usage/Examples

Create a migrations directory and indicate the relative path to that directory in the configuration file.

In your migrations file, create a javascript file with file name beginning with a number, period, and then some text to describe the migration, i.e:
`1.create-test-type.js`

```javascript
// file: path/to/migrations/1.create-test-type.js

export = function (migration) {
  const testType = migration.createContentType('testType').name('Test Type');

  testType.createField('title').type('Symbol').name('Title').required(true);

  testType.displayField('title');
};
```

When the configuration and migration directory is all setup, then run the following to clone the environment and apply the migrations:

```bash
$ yarn contentful-migration-helper migrate -e your-sandbox-env
```

This will create a clone of your `master` environment in Contentful and apply the migration files to the newly created `your-sandbox-env` environment.

### Typescript

If the project uses Typescript for the migration files, `ts-node` can be utilized to run the command

```bash
$ yarn ts-node ./node_modules/.bin/contentful-migration-helper migrate -e your-sandbox-env
```

### More

See the examples folder for a better reference

## CLI Reference

### Overview

```bash
Usage: yarn contentful [command] [options]

Options:
  -h, --help              display help for command

Commands:
  migrate [options]       Runs migration scripts against an environment cloned from main
  delete [options]        Deletes environments from the specified workspace (will NOT delete the master environment)
  update-alias [options]  Updates the main alias to point to the input environment
  help [command]          display help for command
```

### Migrate

```bash
Usage: yarn contentful migrate [options]

Runs migration scripts against an environment cloned from main

Options:
  -e --environment-id <id>        environment id
  -mt --management-token <TOKEN>  contentful management token
  -s --space-id <SPACE_ID>        contentful space id
  -h, --help                      display help for command
```

### Delete

```bash
Usage: yarn contentful delete [options]

Deletes environments from the specified workspace (will NOT delete the main environment)

Options:
  -e --environment-id <id>        environment id
  -mt --management-token <TOKEN>  contentful management token
  -s --space-id <SPACE_ID>        contentful space id
  -f --force                      delete environment without confirmation prompt
  -h, --help                      display help for command
```

### Update Alias

```bash
Usage: yarn contentful update-alias [options]

Updates the main alias to point to the input environment

Options:
  -e --environment-id <id>        environment id
  -mt --management-token <TOKEN>  contentful management token
  -s --space-id <SPACE_ID>        contentful space id
  -rm --remove-unchanged          remove input environment if it is identical to main (alias will remain unchanged)
  -h, --help                      display help for command
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
