# Contentful Migration Helper

[![CI/CD](https://github.com/pnarielwala/contentful_scripts/actions/workflows/main.workflow.yml/badge.svg)](https://github.com/pnarielwala/contentful_scripts/actions/workflows/main.workflow.yml)[![npm version](https://badge.fury.io/js/contentful-migration-helper.svg)](https://badge.fury.io/js/contentful-migration-helper)

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
  spaceId: "<CONTENTFUL_SPACE_ID>",
  managementToken: "<CONTENTFUL_MANAGEMENT_TOKEN>",
  migrationDirectory: "/path/to/migrations",
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
  migrate                 Runs migration scripts against an environment cloned from main
  delete [options]        Deletes environments from the specified workspace (will NOT delete the master environment)
  update-alias [options]  Updates the main alias to point to the input environment
  help [command]          display help for command
```

### Migrate

Runs migration scripts against an environment cloned from main.

#### Prompts

```shell
$ yarn contentful migrate
? Enter the environment id: demo
? Do you want to skip migration confirmation prompts? Yes
```

#### CLI Arguments

```shell
$ yarn contentful migrate -e demo --skip
```

#### API Reference

```shell
$ yarn contentful migrate --help

Usage: yarn contentful migrate [options]

Runs migration scripts against an environment cloned from master

Options:
  -e --environment-id <id>  environment id
  --skip                    skips confirmation prompts before executing the migration scripts
                            (default: false)
  -h, --help                display help for command
```

### Delete

Deletes any environments (except for master) from the specified workspace

#### Prompts

```shell
$ yarn contentful delete
? Select the environment to delete: demo
? Are you sure you want to delete the environment demo? Yes
```

#### CLI Arguments

```shell
$ yarn contentful delete -e demo --skip
```

```bash
Usage: yarn contentful delete [options]

Deletes environments from the specified workspace (will NOT delete the main environment)

Options:
  -e --environment-id <id>  environment id
  --skip                    skips confirmation prompts before deleting the environment (default: false)
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
