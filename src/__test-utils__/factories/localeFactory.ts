import { Collection, Locale, LocaleProps } from "contentful-management";

const baseLocale: Locale = {
  sys: {
    id: "locale-id",
    type: "Locale",
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    space: { sys: { id: "space-id", linkType: "", type: "" } },
    environment: {
      sys: {
        id: "environment-id",
        linkType: "Environment",
        type: "Link",
      },
    },
  },
  name: "locale-name",
  code: "en-US",
  contentDeliveryApi: true,
  contentManagementApi: true,
  optional: false,
  default: true,
  delete: jest.fn(),
  update: jest.fn(),
  toPlainObject: jest.fn(),
  internal_code: "en-US",
  fallbackCode: "en-US",
};

const baseLocaleCollection: Collection<Locale, LocaleProps> = {
  items: [baseLocale],
  limit: 10,
  skip: 0,
  sys: {
    type: "Array",
  },
  total: 1,
  toPlainObject: jest.fn(),
};

export const aLocale = (overrideProps: Partial<Locale> = {}): Locale => ({
  ...baseLocale,
  ...overrideProps,
});

export const aLocaleCollection = (
  overrideProps: Partial<Collection<Locale, LocaleProps>> = {}
): Collection<Locale, LocaleProps> => ({
  ...baseLocaleCollection,
  ...overrideProps,
});
