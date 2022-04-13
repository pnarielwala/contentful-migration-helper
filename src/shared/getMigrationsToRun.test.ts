import { aVersionEntry } from "__test-utils__/factories/entryFactory";
import { readdirSync } from "fs";
import { getMigrationsToRun } from "./getMigrationsToRun";
import { anEnvironment } from "__test-utils__/factories/environmentFactory";

import { initializeVersionEntry } from "./initializeVersionEntry";

jest.mock("fs");
jest.mock("./initializeVersionEntry");

beforeAll(() => {
  jest
    .spyOn(process, "exit")
    .mockImplementation((code?: number) => ({} as never));
});

beforeEach(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(process.stdout, "write").mockImplementation(() => true);
});

test("returns migrations to run after existing current version", async () => {
  const expectedCurrentVersion = "3";
  const expectedVerionEntry = aVersionEntry(expectedCurrentVersion);
  const migrationDirectory = "__migrations__";

  const mockGetEntries = jest
    .fn()
    .mockResolvedValue({ items: [expectedVerionEntry] });
  const mockEnvironment = anEnvironment({
    getEntries: mockGetEntries,
  });

  (readdirSync as jest.Mock).mockReturnValue([
    "1.one.ts",
    "2.two.ts",
    "3.three.ts",
    "4.four.ts",
    "5.five.ts",
  ]);

  const {
    migrationsToRun,
    versionEntry,
    currentVersion,
  } = await getMigrationsToRun({
    environment: mockEnvironment,
    config: {
      migrationDirectory,
      spaceId: "space-id",
      managementToken: "management-token",
    },
    defaultLocale: "en-US",
  });

  expect(migrationsToRun).toEqual([
    { version: "4", fileName: "4.four.ts" },
    { version: "5", fileName: "5.five.ts" },
  ]);
  expect(mockGetEntries).toHaveBeenCalledWith({
    content_type: "versionTracking",
  });
  expect(readdirSync).toHaveBeenCalledWith(migrationDirectory);
  expect(currentVersion).toEqual(expectedCurrentVersion);
  expect(versionEntry).toEqual(expectedVerionEntry);
});

test("initalizes version tracking entry", async () => {
  const expectedCurrentVersion = "3";
  const expectedVerionEntry = aVersionEntry(expectedCurrentVersion);
  const migrationDirectory = "__migrations__";

  const mockGetEntries = jest.fn().mockRejectedValue({});
  const mockEnvironment = anEnvironment({
    getEntries: mockGetEntries,
  });

  (initializeVersionEntry as jest.Mock).mockResolvedValue([
    expectedVerionEntry,
  ]);

  (readdirSync as jest.Mock).mockReturnValue([
    "1.one.ts",
    "2.two.ts",
    "3.three.ts",
    "4.four.ts",
    "5.five.ts",
  ]);

  const {
    migrationsToRun,
    versionEntry,
    currentVersion,
  } = await getMigrationsToRun({
    environment: mockEnvironment,
    config: {
      migrationDirectory,
      spaceId: "space-id",
      managementToken: "management-token",
    },
    defaultLocale: "en-US",
  });

  expect(migrationsToRun).toEqual([
    { version: "4", fileName: "4.four.ts" },
    { version: "5", fileName: "5.five.ts" },
  ]);
  expect(mockGetEntries).toHaveBeenCalledWith({
    content_type: "versionTracking",
  });
  expect(readdirSync).toHaveBeenCalledWith(migrationDirectory);
  expect(currentVersion).toEqual(expectedCurrentVersion);
  expect(versionEntry).toEqual(expectedVerionEntry);
});
