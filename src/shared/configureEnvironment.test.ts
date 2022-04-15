import {
  anApiKey,
  anApiKeysCollection,
} from "__test-utils__/factories/apiKeyFactory";
import { anEnvironmentWithId } from "__test-utils__/factories/environmentFactory";
import {
  aLocale,
  aLocaleCollection,
} from "__test-utils__/factories/localeFactory";
import { aSpace } from "__test-utils__/factories/spaceFactory";
import { configureEnvironment } from "./configureEnvironment";

beforeAll(() => {
  jest.spyOn(process, "exit").mockImplementation(() => ({} as never));
});

beforeEach(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(process.stdout, "write").mockImplementation(() => true);
});

test("configure environment api keys and return default locale", async () => {
  const environmentsOne = [];
  const apiKeyOne = anApiKey({ environments: environmentsOne });
  const environmentsTwo = [];
  const apiKeyTwo = anApiKey({ environments: environmentsTwo });
  const mockGetApiKeys = jest.fn(() =>
    Promise.resolve(anApiKeysCollection({ items: [apiKeyOne, apiKeyTwo] }))
  );

  const space = aSpace({
    getApiKeys: mockGetApiKeys,
  });

  const environmentId = "some-environment";
  const mockGetLocales = jest.fn(() =>
    Promise.resolve(
      aLocaleCollection({
        items: [
          aLocale({ code: "en-US", default: false }),
          aLocale({ code: "de-DE", default: true }),
        ],
      })
    )
  );
  const environment = anEnvironmentWithId(environmentId, {
    getLocales: mockGetLocales,
  });

  const { defaultLocale } = await configureEnvironment({ space, environment });

  expect(defaultLocale).toBe("de-DE");
  expect(mockGetApiKeys).toHaveBeenCalled();
  expect(environmentsOne).toEqual([
    expect.objectContaining({
      sys: {
        type: "Link",
        linkType: "Environment",
        id: environmentId,
      },
    }),
  ]);
  expect(environmentsTwo).toEqual([
    expect.objectContaining({
      sys: {
        type: "Link",
        linkType: "Environment",
        id: environmentId,
      },
    }),
  ]);
});
