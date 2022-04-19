import commander from "commander";
import { createClient } from "contentful-management";

import inquirer from "inquirer";
import { cloneEnvironment } from "./shared/cloneEnvironment";
import { configureEnvironment } from "./shared/configureEnvironment";
import { getMigrationsToRun } from "./shared/getMigrationsToRun";
import { runMigrations } from "./shared/runMigrations";

import { Config } from "./shared/types";

const migrationCLI = (program: commander.Command, config: Config) => {
  program
    .command("migrate")
    .description(
      "Runs migration scripts against an environment cloned from main"
    )
    .option("-e --environment-id <id>", "environment id")
    .option(
      "--skip",
      "skips confirmation prompts before executing the migration scripts",
      false
    )
    .action((options: { environmentId: string; skip: boolean }) => {
      const client = createClient({
        accessToken: config.managementToken,
      });

      const migrate = async () => {
        const space = await client.getSpace(config.spaceId);

        const { environmentId } = options.environmentId
          ? options
          : await inquirer.prompt<{
              environmentId: string;
            }>({
              type: "input",
              name: "environmentId",
              message: "Enter the environment id",
              validate: (input: string) => {
                if (input.length === 0) {
                  return "Environment id is required";
                }
                return true;
              },
            });

        const { skip: skipConfirmation } = options.skip
          ? options
          : await inquirer.prompt<{
              skip: boolean;
            }>({
              type: "confirm",
              name: "skip",
              message: "Do you want to skip migration confirmation prompts?",
            });

        const environment = await cloneEnvironment({
          space,
          environmentId: environmentId,
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
