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

```bash
Usage: yarn contentful migrate [options]

Runs migration scripts against an environment cloned from main

Options:
  -e --environment-id <id>        environment id
  -mt --management-token <TOKEN>  contentful management token
  -s --space-id <SPACE_ID>        contentful space id
  -h, --help                      display help for command
```

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
