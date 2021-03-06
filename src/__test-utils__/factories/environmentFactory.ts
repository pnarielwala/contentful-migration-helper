import { Environment } from "contentful-management";

const baseEnvironment: Environment = {
  sys: {
    type: "Environment",
    id: "environment-id",
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    space: { sys: { id: "space-id", linkType: "", type: "" } },
    status: {
      sys: {
        type: "Link",
        linkType: "EnvironmentStatus",
        id: "environment-status-id",
      },
    },
  },
  name: "environment-name",
  createAppActionCall: jest.fn(),
  createAppInstallation: jest.fn(),
  createAppSignedRequest: jest.fn(),
  createAsset: jest.fn(),
  createContentType: jest.fn(),
  createContentTypeWithId: jest.fn(),
  createAssetFromFiles: jest.fn(),
  createAssetKey: jest.fn(),
  createAssetWithId: jest.fn(),
  createEntry: jest.fn(),
  createEntryWithId: jest.fn(),
  createLocale: jest.fn(),
  createPublishBulkAction: jest.fn(),
  createRelease: jest.fn(),
  createTag: jest.fn(),
  createUiExtension: jest.fn(),
  createUiExtensionWithId: jest.fn(),
  createUnpublishBulkAction: jest.fn(),
  delete: jest.fn(),
  createUpload: jest.fn(),
  createValidateBulkAction: jest.fn(),
  deleteEntry: jest.fn(),
  deleteRelease: jest.fn(),
  getAppInstallation: jest.fn(),
  getAppInstallations: jest.fn(),
  getAsset: jest.fn(),
  getAssetFromData: jest.fn(),
  getAssets: jest.fn(),
  getBulkAction: jest.fn(),
  getContentType: jest.fn(),
  getContentTypeSnapshots: jest.fn(),
  getContentTypes: jest.fn(),
  getEditorInterfaceForContentType: jest.fn(),
  getEditorInterfaces: jest.fn(),
  getEntries: jest.fn(),
  getEntry: jest.fn(),
  getEntrySnapshots: jest.fn(),
  getLocale: jest.fn(),
  getLocales: jest.fn(),
  getEntryFromData: jest.fn(),
  getEntryReferences: jest.fn(),
  getRelease: jest.fn(),
  getReleases: jest.fn(),
  getReleaseAction: jest.fn(),
  getReleaseActions: jest.fn(),
  getTag: jest.fn(),
  getTags: jest.fn(),
  getUiExtension: jest.fn(),
  getUiExtensions: jest.fn(),
  getUpload: jest.fn(),
  publishRelease: jest.fn(),
  toPlainObject: jest.fn(),
  unpublishRelease: jest.fn(),
  update: jest.fn(),
  updateRelease: jest.fn(),
  validateRelease: jest.fn(),
};

export const anEnvironment = (
  overrideProps: Partial<Environment> = {}
): Environment => ({
  ...baseEnvironment,
  ...overrideProps,
});

export const anEnvironmentWithId = (
  environmentId?: string,
  overrideProps?: Partial<Environment>
): Environment => ({
  ...anEnvironment(overrideProps),
  sys: {
    ...anEnvironment(overrideProps).sys,
    id: environmentId || baseEnvironment.sys.id,
  },
});
