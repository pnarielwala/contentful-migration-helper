import { Entry, Environment } from "contentful-management";
import { readdirSync } from "fs";
import { getVersionOfFile } from "./helpers";
import { Config } from "./types";

import { initializeVersionEntry } from "./initializeVersionEntry";

const FILENAME_PATTERN = /^\d+?\..*\.(ts|js)$/;

export const getMigrationsToRun = async (options: {
  environment: Environment;
  config: Config;
  defaultLocale?: string;
}): Promise<{
  migrationsToRun: Array<{
    version: string;
    fileName: string;
  }>;
  versionEntry: Entry;
  currentVersion: string;
}> => {
  const { environment, config, defaultLocale } = options;

  const migrationFiles = readdirSync(config.migrationDirectory).filter((file) =>
    FILENAME_PATTERN.test(file)
  );

  const migrations = migrationFiles
    .map((fileName) => ({
      version: getVersionOfFile(fileName),
      fileName,
    }))
    .sort((a, b) => (+a.version > +b.version ? 1 : -1));

  const duplicatesExist =
    Array.from(new Set(migrations.map((migration) => migration.version)))
      .length !== migrations.length;

  if (duplicatesExist) {
    console.log(
      "\nError: There are migration files with the same version numbers prefixed."
    );
    process.exit(1);
  }

  // ---------------------------------------------------------------------------

  let versionEntry: Entry;
  try {
    const { items } = await environment.getEntries({
      content_type: "versionTracking",
    });
    versionEntry = items[0];
  } catch (e) {
    const versions = await initializeVersionEntry({ environment, config });
    versionEntry = versions[0];
  }

  const currentVersion: string =
    versionEntry.fields.version[String(defaultLocale)];
  console.log("\nCurrent migration version:", currentVersion);

  const migrationsToRun = migrations.filter(
    (migration) => +migration.version > +currentVersion
  );

  return {
    migrationsToRun,
    versionEntry,
    currentVersion,
  };
};
