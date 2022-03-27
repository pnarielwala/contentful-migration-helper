import commander from "commander";
import { createClient } from "contentful-management";

import path from "path";

import {
  getMigrationsToRun,
  updateMainAlias,
  deleteEnvironment,
} from "./shared/scripts";
import { Environment } from "contentful-management/dist/typings/entities/environment";
import { Config } from "./shared/types";

const updateAliasCLI = (program: commander.Command, configuration: Config) => {
  program
    .command("update-alias")
    .description("Updates the main alias to point to the input environment")
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
      "--remove-unchanged",
      "remove input environment if it is identical to main (alias will remain unchanged)"
    )
    .action((options) => {
      const ENVIRONMENT_INPUT = options.environmentId;
      const removeEnv = options.removeUnchanged;

      const config: Config = {
        spaceId: options.spaceId,
        managementToken: options.managementToken,
        migrationDirectory: configuration.migrationDirectory,
      };

      if (ENVIRONMENT_INPUT.indexOf("main-") != 0) {
        console.error("error: environment id must begin with 'main-'");
        process.exit(1);
      }

      const client = createClient({
        accessToken: config.managementToken,
      });

      const changeMainAlias = async () => {
        const space = await client.getSpace(config.spaceId);

        try {
          const environment = await space.getEnvironment(ENVIRONMENT_INPUT);
          const mainEnv = await space.getEnvironment("master");

          console.log("\nEnvironment:", environment.sys.id);
          const { currentVersionString } = await getMigrationsToRun(
            environment,
            "en-US",
            config
          );

          console.log("\nEnvironment: master");
          const {
            currentVersionString: currentVersionStringOnMain,
          } = await getMigrationsToRun(mainEnv, "en-US", config);

          if (+currentVersionString > +currentVersionStringOnMain) {
            console.log(
              `\nEnvironment '${environment.sys.id}' contains new migrations`
            );
            await updateMainAlias(space, environment.sys.id);

            const environments = await space.getEnvironments();

            // Clean up older versions of the main environment to keep only 2 previous versions
            const sortedInactiveMainEnvs = environments.items
              .filter(
                (env) =>
                  env.sys.id.includes("main-", 0) && !env.sys.aliases?.length
              )
              .sort((envA, envB) =>
                new Date(envA.sys.updatedAt) > new Date(envB.sys.updatedAt)
                  ? 1
                  : -1
              );

            console.log("Main environments: ", sortedInactiveMainEnvs);

            if (sortedInactiveMainEnvs.length >= 3) {
              console.log(
                "\nThere are more than 3 previous environment versions of main. Deleting to hold only 2 of the most recent previous versions..."
              );
            }
            while (sortedInactiveMainEnvs.length >= 3) {
              const envToDelete = sortedInactiveMainEnvs.shift() as Environment;
              console.log(`\nDeleting '${envToDelete.sys.id}' environment...`);

              await deleteEnvironment(space, envToDelete.sys.id);
            }
          } else {
            console.log(
              `warning: Environment '${ENVIRONMENT_INPUT}' does not contain any new migrations. Alias will not be changed.`
            );
            if (removeEnv) {
              await deleteEnvironment(space, ENVIRONMENT_INPUT);
            }
            return;
          }
        } catch (e) {
          console.error(
            `error: Environment '${ENVIRONMENT_INPUT}' does not exist on space '${space.name}'`
          );
          process.exit(1);
        }
      };

      changeMainAlias();
    });
};

export default updateAliasCLI;
