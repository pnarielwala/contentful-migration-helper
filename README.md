# Contentful Migration Tool

https://github.com/contentful/contentful-migration

## Installation

### Install dependencies

```shell
$ yarn install
```

### Local .env file

First, we'll can add an `.env` file containing the Contentful space and token we would like the scripts to run on if we do not want to enter it every time running the CLI commands.

We'll also have to add an environment id to run tests against the new environment the script creates otherwise set the variable to "master".

```shell
$ touch .env
```

```bash
# .env
CONTENTFUL_SPACE_ID=<space-id>
CONTENTFUL_MANAGEMENT_TOKEN=<access-token>
CONTENTFUL_ENVIRONMENT_ID=<dev-test-environment-name>
```

## Run unit tests

```
yarn test
```

## CLI interface

```
Usage: yarn contentful [command] [options]

Options:
  -h, --help              display help for command

Commands:
  migrate [options]       Runs migration scripts against an environment cloned from main
  delete [options]        Deletes environments from the specified workspace (will NOT delete the main environment)
  update-alias [options]  Updates the main alias to point to the input environment
  help [command]          display help for command
```

```
Usage: yarn contentful migrate [options]

Runs migration scripts against an environment cloned from main

Options:
  -e --environment-id <id>        environment id
  -mt --management-token <TOKEN>  contentful management token
  -s --space-id <SPACE_ID>        contentful space id
  -h, --help                      display help for command
```

```
Usage: yarn contentful delete [options]

Deletes environments from the specified workspace (will NOT delete the main environment)

Options:
  -e --environment-id <id>        environment id
  -mt --management-token <TOKEN>  contentful management token
  -s --space-id <SPACE_ID>        contentful space id
  -f --force                      delete environment without confirmation prompt
  -h, --help                      display help for command
```

```
Usage: yarn contentful update-alias [options]

Updates the main alias to point to the input environment

Options:
  -e --environment-id <id>        environment id
  -mt --management-token <TOKEN>  contentful management token
  -s --space-id <SPACE_ID>        contentful space id
  -rm --remove-unchanged          remove input environment if it is identical to main (alias will remain unchanged)
  -h, --help                      display help for command
```

ℹ️ Note: the `management-token` and `space-id` can be inferred by the program from an `.env` file

## Importing and exporting content entries

Sometimes when testing migrations, entries created get deleted when the migration is re-ran. The export script will allow you to export content from that environment to save it locally.

Then the import script will allow you to upload content from a file (previously exported json file) in any non-master environment. The safe guard for master is set so that users do not accidentally upload content to master, affecting the production environment.

### Exporting

```sh
yarn contentful export
```

```sh
Usage: yarn contentful export [options]

Exports data from Contentful environment

Options:
  -mt --management-token <TOKEN>  contentful management token
  -s --space-id <SPACE_ID>        contentful space id
  -h, --help                      display help for command
```

### Importing

```sh
yarn contentful import
```

```sh
Usage: yarn contentful import [options]

Imports data into a specified Contentful environment

Options:
  -mt --management-token <TOKEN>  contentful management token
  -s --space-id <SPACE_ID>        contentful space id
  -h, --help                      display help for command
```

ℹ️ Note: the `management-token` and `space-id` can be inferred by the program from an `.env` file
