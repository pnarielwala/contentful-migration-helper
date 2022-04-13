import commander from "commander";
import { createClient } from "contentful-management";

import { Environment } from "contentful-management/dist/typings/entities/environment";
import { cloneEnvironment } from "./shared/cloneEnvironment";
import { configureEnvironment } from "./shared/configureEnvironment";
import { getMigrationsToRun } from "./shared/getMigrationsToRun";
import { runMigrations } from "./shared/runMigrations";

import { Config } from "./shared/types";

const migrationCLI = (program: commander.Command, configuration: Config) => {
  program
    .command("migrate")
    .description(
      "Runs migration scripts against an environment cloned from main"
    )
    .requiredOption("-e --environment-id <id>", "environment id")
    .requiredOption(
      "-mt --management-token <TOKEN>",
      "contentful management token",
      configuration.managementToken
    )
    .requiredOption(
      "-s --space-id <SPACE_ID>",
      "contentful space id",
      configuration.spaceId
    )
    .option(
      "--skip",
      "skips confirmation prompts before executing the migration scripts",
      false
    )
    .action((options) => {
      const ENVIRONMENT_INPUT = options.environmentId;
      const skipConfirmation = options.skip;

      const config: Config = {
        spaceId: options.spaceId,
        managementToken: options.managementToken,
        migrationDirectory: configuration.migrationDirectory,
      };

      const client = createClient({
        accessToken: config.managementToken,
      });

      const migrate = async () => {
        let environment: Environment | undefined;

        const space = await client.getSpace(config.spaceId);
        console.group("\nRunning with the following configuration:");
        console.log(`ENVIRONMENT_INPUT: ${ENVIRONMENT_INPUT}`);
        console.log(`CMA_ACCESS_TOKEN: ${config.managementToken}`);
        console.log(`SPACE_ID: ${config.spaceId}`);
        console.groupEnd();

        environment = await cloneEnvironment({
          space,
          environmentId: ENVIRONMENT_INPUT,
        });

        if (!environment) return;

        const { defaultLocale } = await configureEnvironment({
          space,
          environment,
        });

        const migrations = await getMigrationsToRun({
          environment,
          defaultLocale,
          config,
        });
        const { migrationsToRun, versionEntry } = migrations;

        if (migrationsToRun.length !== 0) {
          const migrationOptions = {
            spaceId: config.spaceId,
            environmentId: environment.sys.id,
            accessToken: config.managementToken,
            yes: skipConfirmation,
          };

          await runMigrations({
            migrationsToRun,
            versionEntry,
            defaultLocale,
            options: migrationOptions,
            config,
          });

          console.log("All done!");
        } else {
          console.log("No migrations to run!");
        }
      };

      migrate();
    });
};

export default migrationCLI;
