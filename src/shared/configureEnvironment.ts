import { Environment, Space } from "contentful-management";

export const configureEnvironment = async (options: {
  space: Space;
  environment: Environment;
}): Promise<{ defaultLocale: string | undefined }> => {
  const { space, environment } = options;

  process.stdout.write("\nUpdating environment configuration...");
  const newEnv = {
    sys: {
      type: "Link",
      linkType: "Environment",
      id: environment.sys.id,
    },
  };

  const { items: keys } = await space.getApiKeys();
  await Promise.all(
    keys.map((key) => {
      key.environments.push(newEnv);
      return key.update();
    })
  );

  // ---------------------------------------------------------------------------
  const defaultLocale = (await environment?.getLocales())?.items?.find(
    (locale) => locale.default
  )?.code;

  process.stdout.write("done!\n");

  return {
    defaultLocale,
  };
};
