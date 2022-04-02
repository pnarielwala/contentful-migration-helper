import { Environment } from "contentful-management";
import { runMigration } from "contentful-migration";
import { Config } from "./types";

import versionMigration from "./createVersionModel";

export const initializeVersionEntry = async (options: {
  environment: Environment;
  config: Config;
}) => {
  const { environment, config } = options;

  const migrationOptions = {
    spaceId: config.spaceId,
    environmentId: environment.sys.id,
    accessToken: config.managementToken,
    yes: true,
  };

  await runMigration({
    ...migrationOptions,
    migrationFunction: versionMigration,
  });

  await environment
    .createEntry("versionTracking", {
      fields: {
        id: { "en-US": "version_tracking" },
        version: { "en-US": "0" },
      },
    })
    .catch((e) => {
      console.log("Error when creating first version entry", e);
      throw e;
    });

  const { items } = await environment.getEntries({
    content_type: "versionTracking",
  });

  return items;
};
