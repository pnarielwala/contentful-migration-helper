import commander from "commander";
import { DotenvParseOutput } from "dotenv";

import contentfulExport from "contentful-export";
import path from "path";
import { createClient } from "contentful-management";
import inquirer from "inquirer";
import { Config } from "./shared/types";

const exportCLI = (program: commander.Command, configuration: Config) => {
  program
    .command("export")
    .description("Exports data from Contentful environment")
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
      const environmentIds = environments.items.map((env) => env.sys.id);

      const { environmentId } = await inquirer.prompt([
        {
          type: "list",
          name: "environmentId",
          message: `Which environment would you like to export data from?`,
          choices: environmentIds,
        },
      ]);

      const { filename } = await inquirer.prompt([
        {
          type: "input",
          name: "filename",
          message: `Output file name?`,
          suffix: ` (optional, default: "contentful-export-${SPACE_ID}-${environmentId}-XXXX-XX-XX")`,
        },
      ]);

      const config = {
        spaceId: SPACE_ID,
        managementToken: CMA_ACCESS_TOKEN,
        environmentId: environmentId,
        includeDrafts: true,
        contentOnly: true,
        exportDir: path.resolve(process.cwd(), "exportedContent"),
        contentFile: filename,
      };

      contentfulExport(config)
        .then(() => {
          console.log("Export successful!");
        })
        .catch((err) => {
          console.log("Oh no! Some errors occurred!", err);
        });
    });
};

export default exportCLI;
