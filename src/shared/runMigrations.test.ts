import { runMigrations } from "./runMigrations";
import path from "path";
import { runMigration } from "contentful-migration";
import { aVersionEntry } from "__test-utils__/factories/entryFactory";

jest.mock("path");
jest.mock("contentful-migration");

beforeAll(() => {
  jest
    .spyOn(process, "exit")
    .mockImplementation((code?: number) => ({} as never));
});

beforeEach(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "group").mockImplementation(() => {});
  jest.spyOn(process.stdout, "write").mockImplementation(() => true);
});

test("successfully run migrations", async () => {
  const mockUpdate = jest.fn().mockName("mockUpdate2");
  const mockPublish = jest.fn().mockName("mockPublish");
  const currentVersionEntry = aVersionEntry("3", {
    update: mockUpdate,
    publish: mockPublish,
  });
  mockUpdate.mockResolvedValue(currentVersionEntry);
  mockPublish.mockResolvedValue(currentVersionEntry);

  const migrationsToRun = [
    { version: "4", fileName: "4.four.ts" },
    { version: "5", fileName: "5.five.ts" },
  ];
  const options = {
    accessToken: "access-token",
  };

  (runMigration as jest.Mock).mockResolvedValue(true);

  jest.spyOn(path, "resolve").mockReturnValue("/path/to/migrations");

  await runMigrations({
    migrationsToRun,
    versionEntry: currentVersionEntry,
    options,
    config: {
      migrationDirectory: "__migrations__",
      spaceId: "space-id",
      managementToken: "management-token",
    },
    defaultLocale: "en-US",
  });

  expect(runMigration).toHaveBeenCalledWith({
    ...options,
    filePath: "/path/to/migrations",
  });
  expect(runMigration).toHaveBeenCalledTimes(2);

  expect(mockUpdate).toHaveBeenCalled();
  expect(mockPublish).toHaveBeenCalled();
});
