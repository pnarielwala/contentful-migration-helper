import { Environment, Space } from "contentful-management";

export const deleteEnvironment = async (options: {
  space: Space;
  environmentId: string;
  ignoreFailures?: boolean;
}) => {
  const { space, environmentId, ignoreFailures = false } = options;

  let environment: Environment | undefined = undefined;
  try {
    environment = await space.getEnvironment(environmentId);
  } catch (e) {
    if (!ignoreFailures) {
      console.log(`Environment could not be found`);
    }
  } finally {
    if (!environment) {
      return undefined;
    }
  }

  if (environmentId != "master") {
    let successful = true;
    process.stdout.write("\nDeleting existing environment...");
    try {
      await environment.delete();
      process.stdout.write("done!\n");
    } catch (e) {
      successful = false;
      process.stdout.write("failure! Environment not found\n");
    } finally {
      console.groupEnd();
      !successful && !ignoreFailures && process.exit(1);
    }
  } else {
    console.log("\nCannot delete master environment");
    !ignoreFailures && process.exit(1);
  }
};
