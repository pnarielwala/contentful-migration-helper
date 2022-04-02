import { Environment, Space } from "contentful-management";
import { deleteEnvironment } from "./deleteEnvironment";

export const cloneEnvironment = async (options: {
  space: Space;
  environmentId: string;
}) => {
  const { space, environmentId } = options;

  let environment: Environment | undefined;

  await deleteEnvironment({ space, environmentId, ignoreFailures: true });

  // Create environment
  if (environmentId != "master") {
    process.stdout.write(`\nCreating environment...`);
    let successful = true;
    try {
      environment = await space.createEnvironmentWithId(environmentId, {
        name: environmentId,
      });

      const DELAY = 3000;
      const MAX_NUMBER_OF_TRIES = 10;
      let count = 0;

      while (count < MAX_NUMBER_OF_TRIES) {
        const status = (await space.getEnvironment(environment.sys.id)).sys
          .status?.sys.id;

        if (status === "ready" || status === "failed") {
          if (status === "ready") {
            process.stdout.write(`done!\n`);
          } else {
            successful = false;
            process.stdout.write("failure! Unable to process environment.\n");
          }
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, DELAY));
        count++;
      }
    } catch (e) {
      successful = false;
      process.stdout.write(`failure!\n`);
    } finally {
      console.groupEnd();
      !successful && process.exit(1);
    }
  }

  return environment;
};
