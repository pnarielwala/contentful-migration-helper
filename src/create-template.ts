import commander from "commander";

import { readdirSync, writeFileSync } from "fs";
import inquirer from "inquirer";
import path from "path";

import { format, resolveConfig } from "prettier";

import { paramCase } from "param-case";
import { getVersionOfFile } from "./shared/scripts";

const MIGRATIONS_DIR = path.resolve(process.cwd(), "src/migrations");

const TEMPLATE = `
import { MigrationFunction } from 'contentful-migration'

export = function (migration) {
  /*
  * Write your migration code here
  */
} as MigrationFunction
`;

const templateCLI = (program: commander.Command) => {
  program
    .command("create-template")
    .description("Creates migration template")
    .action(async () => {
      const { description } = await inquirer.prompt([
        {
          type: "input",
          name: "description",
          message: `Describe the migration`,
        },
      ]);

      const migrationFiles = readdirSync(MIGRATIONS_DIR).filter((file) =>
        /^\d+?\..*\.(ts|js)$/.test(file)
      );

      const versions = migrationFiles
        .map((filename) => +getVersionOfFile(filename))
        .sort((versionA, versionB) => {
          if (versionA > versionB) {
            return 1;
          } else {
            return -1;
          }
        });

      const nextVersion = versions[versions.length - 1] + 1;

      const prettierConfig = await resolveConfig(process.cwd());
      writeFileSync(
        `./src/migrations/${nextVersion}.${paramCase(description)}.ts`,
        format(TEMPLATE, { ...prettierConfig, parser: "typescript" })
      );

      console.log(
        "\n",
        "File created!",
        `./src/migrations/${nextVersion}.${paramCase(description)}.ts`
      );
    });
};

export default templateCLI;
