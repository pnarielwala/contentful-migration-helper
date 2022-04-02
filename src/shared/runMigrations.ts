import { Entry, Environment } from "contentful-management";
import { runMigration, RunMigrationConfig } from "contentful-migration";
import path from "path";
import { Config } from "./types";

export const runMigrations = async (args: {
  migrationsToRun: Array<{
    version: string;
    fileName: string;
  }>;
  versionEntry: Entry;
  defaultLocale?: string;
  options: Omit<RunMigrationConfig, "filePath">;
  config: Config;
}) => {
  const { migrationsToRun, defaultLocale, options, config } = args;

  let versionEntry = args.versionEntry;

  console.group("\nRunning migrations tasks...");
  for (let migrationToRun of migrationsToRun) {
    const fileName = migrationToRun.fileName;

    const filePath = path.resolve(
      process.cwd(),
      config.migrationDirectory,
      fileName
    );
    console.group(`Running migration script '${fileName}'...`);
    try {
      const successfulMigration = await runMigration({ ...options, filePath });
      if (successfulMigration) {
        versionEntry.fields.version[String(defaultLocale)] =
          migrationToRun.version;
        versionEntry = await versionEntry.update();
        versionEntry = await versionEntry.publish();

        console.log(`\nUpdated version entry to ${migrationToRun.version}!\n`);
      } else {
        console.groupEnd();
        console.log(`\nTerminating migration run...1`);
        console.groupEnd();
        process.exit(1);
      }
    } catch (e) {
      console.groupEnd();
      console.log(`\nTerminating migration run...`);
      console.groupEnd();
      process.exit(1);
    }
    console.groupEnd();
  }
};
