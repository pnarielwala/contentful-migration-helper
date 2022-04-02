import { ApiKey, ApiKeyProps, Collection } from "contentful-management";

const baseApiKey: ApiKey = {
  sys: {
    id: "space-id",
    type: "Space",
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  name: "some-api-key",
  accessToken: "some-access-token",
  environments: [],
  preview_api_key: {
    sys: {
      type: "Link",
      linkType: "ApiKey",
      id: "some-preview-api-key-id",
    },
  },
  update: jest.fn(),
  delete: jest.fn(),
  toPlainObject: jest.fn(),
};

export const anApiKey = (overrideProps: Partial<ApiKey> = {}): ApiKey => ({
  ...baseApiKey,
  ...overrideProps,
});

const baseApiKeysCollection: Collection<ApiKey, ApiKeyProps> = {
  items: [anApiKey()],
  sys: {
    type: "Array",
  },
  total: 1,
  skip: 0,
  limit: 10,
  toPlainObject: jest.fn(),
};

export const anApiKeysCollection = (
  overrideProps: Partial<Collection<ApiKey, ApiKeyProps>> = {}
): Collection<ApiKey, ApiKeyProps> => ({
  ...baseApiKeysCollection,
  ...overrideProps,
});
