import commander from 'commander';
import { DotenvParseOutput } from 'dotenv';
import { createClient } from 'contentful-management';

import path from 'path';

import { Environment } from 'contentful-management/dist/typings/entities/environment';

import {
  runMigrations,
  cloneEnvironment,
  configureEnvironment,
  getMigrationsToRun,
} from './shared/scripts';

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'src/migrations');

const migrationCLI = (
  program: commander.Command,
  environmentVariables: DotenvParseOutput,
) => {
  program
    .command('migrate')
    .description(
      'Runs migration scripts against an environment cloned from main',
    )
    .requiredOption('-e --environment-id <id>', 'environment id')
    .requiredOption(
      '-mt --management-token <TOKEN>',
      'contentful management token',
      environmentVariables.CONTENTFUL_MANAGEMENT_TOKEN,
    )
    .requiredOption(
      '-s --space-id <SPACE_ID>',
      'contentful space id',
      environmentVariables.CONTENTFUL_SPACE_ID,
    )
    .option(
      '--skip',
      'skips confirmation prompts before executing the migration scripts',
      false,
    )
    .action((options) => {
      const ENVIRONMENT_INPUT = options.environmentId;
      const CMA_ACCESS_TOKEN = options.managementToken;
      const SPACE_ID = options.spaceId;
      const skipConfirmation = options.skip;

      const client = createClient({
        accessToken: CMA_ACCESS_TOKEN,
      });

      const migrate = async () => {
        let environment: Environment | undefined;

        const space = await client.getSpace(SPACE_ID);
        console.group('\nRunning with the following configuration:');
        console.log(`ENVIRONMENT_INPUT: ${ENVIRONMENT_INPUT}`);
        console.log(`CMA_ACCESS_TOKEN: ${CMA_ACCESS_TOKEN}`);
        console.log(`SPACE_ID: ${SPACE_ID}`);
        console.groupEnd();

        environment = await cloneEnvironment(space, ENVIRONMENT_INPUT);

        if (!environment) return;

        const { defaultLocale } = await configureEnvironment(
          space,
          environment,
        );

        const migrations = await getMigrationsToRun(
          environment,
          defaultLocale,
          MIGRATIONS_DIR,
          {
            SPACE_ID,
            CMA_ACCESS_TOKEN,
          },
        );
        const { migrationsToRun, migrationFiles } = migrations;
        let { storedVersionEntry } = migrations;

        if (migrationsToRun.length !== 0) {
          const migrationOptions = {
            spaceId: SPACE_ID,
            environmentId: environment.sys.id,
            accessToken: CMA_ACCESS_TOKEN,
            yes: skipConfirmation,
          };
          await runMigrations(
            environment,
            migrationsToRun,
            migrationFiles,
            storedVersionEntry,
            defaultLocale,
            migrationOptions,
          );

          console.log('All done!');
        } else {
          console.log('No migrations to run!');
        }
      };

      migrate();
    });
};

export default migrationCLI;
