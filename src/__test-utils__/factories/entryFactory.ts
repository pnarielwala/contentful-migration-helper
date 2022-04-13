import { Entry } from "contentful-management";

const baseVersionEntry: Entry = {
  sys: {
    id: "versionTracking",
    type: "Entry",
    contentType: {
      sys: {
        id: "versionTracking",
        type: "Link",
        linkType: "ContentType",
      },
    },
    space: {
      sys: {
        id: "space",
        type: "Link",
        linkType: "Space",
      },
    },
    environment: {
      sys: {
        id: "master",
        type: "Link",
        linkType: "Environment",
      },
    },
    createdAt: "2019-12-17T14:54:37.879Z",
    updatedAt: "2019-12-17T14:54:37.879Z",
    version: 1,
  },
  fields: {
    version: {
      "en-US": "0",
    },
  },
  archive: jest.fn(),
  publish: jest.fn(),
  unpublish: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  createComment: jest.fn(),
  getComments: jest.fn(),
  createTask: jest.fn(),
  getTasks: jest.fn(),
  getComment: jest.fn(),
  getSnapshot: jest.fn(),
  getSnapshots: jest.fn(),
  getTask: jest.fn(),
  isArchived: jest.fn(),
  isPublished: jest.fn(),
  isDraft: jest.fn(),
  isUpdated: jest.fn(),
  patch: jest.fn(),
  references: jest.fn(),
  toPlainObject: jest.fn(),
  unarchive: jest.fn(),
  metadata: undefined,
};

export const aVersionEntry = (
  version: string,
  overrideProps: Partial<Entry> = {}
): Entry => ({
  ...baseVersionEntry,
  ...overrideProps,
  fields: {
    version: {
      "en-US": version,
    },
  },
});
