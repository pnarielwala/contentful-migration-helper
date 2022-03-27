import commander from "commander";
import { DotenvParseOutput } from "dotenv";

import fs, { readdirSync, readFile, statSync } from "fs";
import inquirer from "inquirer";
import path from "path";

import contentfulImport from "contentful-import";
import { createClient } from "contentful-management";
import { Config } from "./shared/types";

const importCLI = (program: commander.Command, configuration: Config) => {
  program
    .command("import")
    .description("Imports data into a specified Contentful environment")
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
    .action(async (options) => {
      const CMA_ACCESS_TOKEN = options.managementToken;
      const SPACE_ID = options.spaceId;

      const client = createClient({
        accessToken: CMA_ACCESS_TOKEN,
      });

      const space = await client.getSpace(SPACE_ID);

      const environments = await space.getEnvironments();
      const environmentIds = environments.items
        .map((env) => env.sys.id)
        .filter((envId) => !/^(main|master)/.test(envId));

      const { environmentId } = await inquirer.prompt([
        {
          type: "list",
          name: "environmentId",
          message: `Which environment would you like to import into?`,
          choices: environmentIds,
        },
      ]);

      const directoryPath = path.resolve(process.cwd(), "exportedContent");
      const exportedFiles = readdirSync(directoryPath)
        .filter((file) => /^.*\.(json)$/.test(file))
        .sort((fileA, fileB) =>
          statSync(path.resolve(directoryPath, fileA)).mtimeMs >
          statSync(path.resolve(directoryPath, fileB)).mtimeMs
            ? -1
            : 1
        );

      const { filename } = await inquirer.prompt([
        {
          type: "list",
          name: "filename",
          message: `Which file would you like to import into '${environmentId}'`,
          choices: exportedFiles,
        },
      ]);

      const { confirm } = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirm",
          message: `Are you sure?`,
        },
      ]);

      if (!confirm) {
        console.log("Import aborted!");
        process.exit(0);
      }

      const config = {
        spaceId: SPACE_ID,
        managementToken: CMA_ACCESS_TOKEN,
        environmentId: environmentId,
        contentFile: path.resolve(directoryPath, filename),
      };

      contentfulImport(config)
        .then(() => {
          console.log("Import successful!");
        })
        .catch((err) => {
          console.log("Oh no! Some errors occurred!", err);
        });
    });
};

export default importCLI;
