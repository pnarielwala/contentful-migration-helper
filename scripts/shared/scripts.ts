import { Space } from 'contentful-management/dist/typings/entities/space';
import { Environment } from 'contentful-management/dist/typings/entities/environment';
import { Entry } from 'contentful-management/dist/typings/entities/entry';
import { readdirSync } from 'fs';
import path from 'path';
import { runMigration, RunMigrationConfig } from 'contentful-migration';
import { version } from 'commander';

export const getVersionOfFile = (file: string) =>
  file.replace(/(\d+)(.*)\.(ts|js)/, '$1');

const getFileOfVersion = (version: string, files: Array<string>) =>
  files.find((file) => file.includes(`${version}.`));

const getStringDate = () => {
  const pad = (n: number) => {
    return n < 10 ? '0' + n : n;
  };

  const d = new Date();

  return (
    d.toISOString().substring(0, 10) +
    '-' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes())
  );
};

export const deleteEnvironment = async (
  space: Space,
  environmentId: string,
) => {
  let environment = await space.getEnvironment(environmentId);
  if (environmentId != 'master') {
    await environment.delete();
    console.log('Environment deleted');
  }
};

export const cloneEnvironment = async (
  space: Space,
  environmentInput: string,
) => {
  let ENVIRONMENT_ID: string, environment: Environment | undefined;

  // Set/Create environment ID from input
  if (environmentInput == 'master') {
    ENVIRONMENT_ID = 'master-'.concat(getStringDate());
  } else {
    ENVIRONMENT_ID = environmentInput;
  }

  // Delete existing (non-master) enviroment with id matching ENVIRONMENT_ID
  console.group(
    `\nChecking for existing versions of environment: ${ENVIRONMENT_ID}...`,
  );
  try {
    await deleteEnvironment(space, ENVIRONMENT_ID);
  } catch (e) {
    console.log('Environment not found');
  }
  console.groupEnd();

  // Create environment
  if (ENVIRONMENT_ID != 'master') {
    console.group(`\n(Re)Creating environment ${ENVIRONMENT_ID}...`);
    try {
      environment = await space.createEnvironmentWithId(ENVIRONMENT_ID, {
        name: ENVIRONMENT_ID,
      });

      const DELAY = 3000;
      const MAX_NUMBER_OF_TRIES = 10;
      let count = 0;

      console.log('Waiting for environment processing...');

      while (count < MAX_NUMBER_OF_TRIES) {
        const status = (await space.getEnvironment(environment.sys.id)).sys
          .status?.sys.id;

        if (status === 'ready' || status === 'failed') {
          if (status === 'ready') {
            console.log(
              `Successfully processed new environment (${ENVIRONMENT_ID})`,
            );
          } else {
            console.log('Environment creation failed');
          }
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, DELAY));
        count++;
      }
    } catch (e) {
      throw new Error(`Environment ${ENVIRONMENT_ID} could not be created`);
    }
    console.groupEnd();
  }

  return environment;
};

export const configureEnvironment = async (
  space: Space,
  environment: Environment,
): Promise<{ defaultLocale: string | undefined }> => {
  console.group('\nUpdating new environment configuration');
  console.group('Update API keys to allow access to new environment');
  const newEnv = {
    sys: {
      type: 'Link',
      linkType: 'Environment',
      id: environment.sys.id,
    },
  };

  const { items: keys } = await space.getApiKeys();
  await Promise.all(
    keys.map((key) => {
      console.log(`Updating - ${key.sys.id}`);
      key.environments.push(newEnv);
      return key.update();
    }),
  ).finally(() => console.groupEnd());

  // ---------------------------------------------------------------------------
  console.log('Set default locale to new environment');
  const defaultLocale = (await environment?.getLocales())?.items?.find(
    (locale) => locale.default,
  )?.code;

  console.groupEnd();

  return {
    defaultLocale,
  };
};

export const getMigrationsToRun = async (
  environment: Environment,
  defaultLocale: string | undefined,
  dir: string,
  environmentVariables: {
    CMA_ACCESS_TOKEN: string;
    SPACE_ID: string;
  },
): Promise<{
  migrationFiles: Array<string>;
  migrationsToRun: Array<string>;
  storedVersionEntry: Entry;
  currentVersionString: string;
}> => {
  // ---------------------------------------------------------------------------
  console.group('\nGet migration version info');
  const migrationFiles = readdirSync(dir).filter((file) =>
    /^\d+?\..*\.(ts|js)$/.test(file),
  );
  const availableMigrations = migrationFiles
    .map((file) => getVersionOfFile(file))
    .sort((a, b) => (+a > +b ? 1 : -1));
  console.log(`Available migrations:`, availableMigrations);

  const duplicatesExist =
    Array.from(new Set(availableMigrations)).length !==
    availableMigrations.length;

  if (duplicatesExist) {
    console.groupEnd();
    console.error(
      '\nERROR: There are files with the same version numbers prefixed.\n',
    );
    process.exit(1);
  }

  // ---------------------------------------------------------------------------

  let versions: Entry[] = [];
  try {
    const { items } = await environment.getEntries({
      content_type: 'versionTracking',
    });
    versions = items;
  } catch (e) {
    const migrationOptions = {
      spaceId: environmentVariables.SPACE_ID,
      environmentId: environment.sys.id,
      accessToken: environmentVariables.CMA_ACCESS_TOKEN,
      yes: true,
    };

    const filePath = path.resolve(__dirname, './createVersionModel.ts');
    await runMigration({
      ...migrationOptions,
      filePath,
    });
    await environment
      .createEntry('versionTracking', {
        fields: {
          id: { 'en-US': 'version_tracking' },
          version: { 'en-US': '0' },
        },
      })
      .catch((e) => {
        console.log('Error when creating first version entry', e);
        throw e;
      });

    const { items } = await environment.getEntries({
      content_type: 'versionTracking',
    });
    versions = items;
  } finally {
    if (!versions.length || versions.length > 1) {
      throw new Error(
        "There should only be one entry of type 'versionTracking'",
      );
    }
  }

  let storedVersionEntry = versions[0];
  const currentVersionString =
    storedVersionEntry.fields.version[String(defaultLocale)];
  console.log('Latest stored migration version:', currentVersionString);

  // ---------------------------------------------------------------------------
  console.log('availableMigrations', availableMigrations);
  const currentMigrationIndex = availableMigrations.indexOf(
    currentVersionString,
  );

  if (currentMigrationIndex === -1) {
    throw new Error(
      `Version ${currentVersionString} is not matching with any known migration`,
    );
  }
  const migrationsToRun = availableMigrations.slice(currentMigrationIndex + 1);
  console.log('Migrations that will be evaluated to run:', migrationsToRun);

  console.groupEnd();

  return {
    migrationFiles,
    migrationsToRun,
    storedVersionEntry,
    currentVersionString,
  };
};

export const runMigrations = async (
  environment: Environment,
  migrationsToRun: Array<string>,
  migrationFiles: Array<string>,
  storedVersionEntry: Entry,
  defaultLocale: string | undefined,
  options: Omit<RunMigrationConfig, 'filePath'>,
) => {
  console.group('\nRunning migrations tasks...');
  for (let migrationToRun of migrationsToRun) {
    const fileName = getFileOfVersion(migrationToRun, migrationFiles);
    if (!fileName) return;
    const filePath = path.resolve(process.cwd(), 'src/migrations', fileName);
    console.group(`Running migration script '${fileName}'...`);
    try {
      const successfulMigration = await runMigration({ ...options, filePath });
      if (successfulMigration) {
        storedVersionEntry.fields.version[
          String(defaultLocale)
        ] = migrationToRun;
        storedVersionEntry = await storedVersionEntry.update();
        storedVersionEntry = await storedVersionEntry.publish();

        console.log(`\nUpdated version entry to ${migrationToRun}!\n`);
      } else {
        console.groupEnd();
        console.log(`\nTerminating migration run...`);
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

export const updateMainAlias = async (space: Space, environmentId: string) => {
  console.group(`\nUpdating main alias to point to ${environmentId}...`);
  await space
    .getEnvironmentAlias('master')
    .then((alias) => {
      //@ts-ignore
      alias.environment.sys.id = environmentId;
      //@ts-ignore
      return alias.update();
    })
    .catch(console.error);
  console.log(`Main alias updated.`);
  console.groupEnd();
};
