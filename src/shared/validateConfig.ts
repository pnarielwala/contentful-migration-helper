import Schema from "validate";
import path from "path";
import { existsSync } from "fs";

const validFilePath = (value: string) =>
  existsSync(path.resolve(process.cwd(), path.normalize(value)));

const validateConfig = (config?: object) => {
  const configSchema = new Schema({
    spaceId: {
      type: String,
      required: true,
    },
    environmentId: {
      type: String,
    },
    managementToken: {
      type: String,
      required: true,
    },
    migrationDirectory: {
      type: String,
      required: true,
      use: { validFilePath },
    },
    skipMigrationConfirmation: {
      type: Boolean,
    },
  });

  configSchema.message({
    validFilePath: (path, ctx) =>
      `Unable to locate "${ctx[path]}". Please check '${path}' to be a valid path.`,
  });

  if (!config) {
    console.error("Unable to find a configuration file");
    return false;
  }
  const errors = configSchema.validate(config);

  if (errors.length > 0) {
    console.group("Configuration errors:");
    errors.forEach((error) => {
      console.error(String(error));
    });
    console.groupEnd();
    return false;
  }
  return true;
};

export default validateConfig;
