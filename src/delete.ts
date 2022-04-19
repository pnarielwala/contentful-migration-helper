import chalk from "chalk";
import commander from "commander";
import { createClient } from "contentful-management";

import { Environment } from "contentful-management/dist/typings/entities/environment";
import inquirer from "inquirer";
import { deleteEnvironment } from "./shared/deleteEnvironment";

import { Config } from "./shared/types";

const deleteCLI = (program: commander.Command, config: Config) => {
  program
    .command("delete")
    .description(
      "Deletes environments from the specified workspace (will NOT delete the main environment)"
    )
    .option("-e --environment-id <id>", "environment id")
    .option(
      "--skip",
      "skips confirmation prompts before deleting the environment",
      false
    )
    .action(async (options: { environmentId: string; skip: boolean }) => {
      const client = createClient({
        accessToken: config.managementToken,
      });

      const space = await client.getSpace(config.spaceId);
      const environments = await space.getEnvironments();

      let environmentExists = true;
      try {
        options.environmentId &&
          (await space.getEnvironment(options.environmentId));
      } catch (e) {
        console.log(
          chalk.red(`Environment ${options.environmentId} does not exist`)
        );
        environmentExists = false;
      }

      if (options.environmentId === "master") {
        console.log(
          chalk.red(
            `Environment "${options.environmentId}" is the main environment and cannot be deleted`
          )
        );
        environmentExists = false;
      }

      const masterEnvironment = environments.items.find(
        (env: Environment) => env.sys.id === "master"
      );
      const masterAliasId = masterEnvironment?.sys.aliasedEnvironment?.sys.id;
      const environmentsToSelect = environments.items
        .filter(
          (env: Environment) =>
            env.sys.id !== "master" && env.sys.id !== masterAliasId
        )
        .map((env: Environment) => env.sys.id);

      const { environmentId } =
        environmentExists && options.environmentId
          ? options
          : await inquirer.prompt<{
              environmentId: string;
            }>({
              type: "list",
              name: "environmentId",
              message: "Select the environment to delete",
              choices: environmentsToSelect,
            });

      const { confirmed } = options.skip
        ? { confirmed: options.skip }
        : await inquirer.prompt<{ confirmed: boolean }>({
            type: "confirm",
            name: "confirmed",
            message: `Are you sure you want to delete the environment ${environmentId}?`,
          });

      if (environmentId === "master") {
        console.error("forbidden: cannot delete environment 'master'");
        process.exit(1);
      }

      if (confirmed) {
        await deleteEnvironment({ space, environmentId });
        return;
      } else {
        console.log("\nDeletion aborted!\n");
        process.exit(0);
      }
    });
};

export default deleteCLI;
