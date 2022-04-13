import { EnvironmentAlias } from "contentful-management";

const baseAlias: EnvironmentAlias = {
  environment: {
    sys: {
      id: "master",
      type: "Link",
      linkType: "Environment",
    },
  },
  sys: {
    id: "master",
    type: "EnvironmentAlias",
    version: 1,
    createdAt: "2019-01-01T00:00:00.000Z",
    updatedAt: "2019-01-01T00:00:00.000Z",
    space: {
      sys: {
        id: "spaceId",
        type: "Link",
        linkType: "Space",
      },
    },
  },
  update: jest.fn(),
  delete: jest.fn(),
  toPlainObject: jest.fn(),
};

export const anAlias = (
  overrideProps: Partial<EnvironmentAlias> = {}
): EnvironmentAlias => ({
  ...baseAlias,
  ...overrideProps,
});
