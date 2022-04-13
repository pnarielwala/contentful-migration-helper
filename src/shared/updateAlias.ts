import { Space } from "contentful-management";

export const updateAlias = async (space: Space, environmentId: string) => {
  console.group(`\nUpdating main alias to point to ${environmentId}...`);
  try {
    const alias = await space.getEnvironmentAlias("master");
    alias.environment.sys.id = environmentId;
    alias.update();
  } catch (e) {
    console.error(e);
  }
  console.log(`Main alias updated.`);
  console.groupEnd();
};
