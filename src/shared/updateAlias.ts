import { Space } from "contentful-management";

export const updateMainAlias = async (space: Space, environmentId: string) => {
  console.group(`\nUpdating main alias to point to ${environmentId}...`);
  await space
    .getEnvironmentAlias("master")
    .then((alias) => {
      alias.environment.sys.id = environmentId;
      return alias.update();
    })
    .catch(console.error);
  console.log(`Main alias updated.`);
  console.groupEnd();
};
