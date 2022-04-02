import { Space } from "contentful-management";
import { anEnvironment } from "__test-utils__/factories/environmentFactory";
import { aSpace } from "__test-utils__/factories/spaceFactory";
import { deleteEnvironment } from "./deleteEnvironment";

beforeAll(() => {
  jest
    .spyOn(process, "exit")
    .mockImplementation((code?: number) => ({} as never));
});

beforeEach(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(process.stdout, "write").mockImplementation(() => true);
});

test("error when deleting a non-existent environment", async () => {
  const environmentId = "not-existing-environment";
  const mockGetEnvironment = jest.fn(() => Promise.reject());
  const space: Space = aSpace({
    getEnvironment: mockGetEnvironment,
  });
  const options = {
    environmentId,
    space,
  };

  const result = await deleteEnvironment(options);

  expect(result).toBeUndefined();
  expect(mockGetEnvironment).toHaveBeenCalledWith(environmentId);
  expect(console.log).toHaveBeenCalledWith(`Environment could not be found`);
});

test("logging error when deleting a non-existent environment", async () => {
  const environmentId = "not-existing-environment";
  const mockGetEnvironment = jest.fn(() => Promise.reject());
  const space: Space = aSpace({
    getEnvironment: mockGetEnvironment,
  });
  const options = {
    environmentId,
    space,
    ignoreFailures: true,
  };

  const result = await deleteEnvironment(options);

  expect(console.log).not.toHaveBeenCalledWith(
    `Environment could not be found`
  );
});

test("successfully deleting environment", async () => {
  const environmentId = "non-master";
  const mockDelete = jest.fn(() => Promise.resolve());
  const environment = anEnvironment({ delete: mockDelete });

  const mockGetEnvironment = jest.fn(() => Promise.resolve(environment));
  const space: Space = aSpace({
    getEnvironment: mockGetEnvironment,
  });

  const options = {
    environmentId,
    space,
  };

  const result = await deleteEnvironment(options);

  expect(result).toBeUndefined();
  expect(mockGetEnvironment).toHaveBeenCalledWith(environmentId);
  expect(mockDelete).toHaveBeenCalled();
});

test("error when deleting non master environment", async () => {
  const environmentId = "non-master";
  const mockDelete = jest.fn(() => Promise.reject());
  const environment = anEnvironment({ delete: mockDelete });

  const mockGetEnvironment = jest.fn(() => Promise.resolve(environment));
  const space: Space = aSpace({
    getEnvironment: mockGetEnvironment,
  });

  const options = {
    environmentId,
    space,
  };

  const result = await deleteEnvironment(options);

  expect(result).toBeUndefined();
  expect(mockGetEnvironment).toHaveBeenCalledWith(environmentId);
  expect(mockDelete).toHaveBeenCalled();
  expect(process.stdout.write).toHaveBeenCalledWith(
    `\nDeleting existing environment...`
  );
  expect(process.stdout.write).toHaveBeenCalledWith(
    `failure! Environment not found\n`
  );
  expect(process.exit).toHaveBeenCalledWith(1);
});

test("error when deleting master environment", async () => {
  const environmentId = "master";
  const mockDelete = jest.fn(() => Promise.reject());
  const environment = anEnvironment({ delete: mockDelete });

  const mockGetEnvironment = jest.fn(() => Promise.resolve(environment));
  const space: Space = aSpace({
    getEnvironment: mockGetEnvironment,
  });

  const options = {
    environmentId,
    space,
  };

  const result = await deleteEnvironment(options);

  expect(result).toBeUndefined();
  expect(mockGetEnvironment).toHaveBeenCalledWith(environmentId);
  expect(mockDelete).not.toHaveBeenCalled();
  expect(console.log).toHaveBeenCalledWith(
    `\nCannot delete master environment`
  );
  expect(process.exit).toHaveBeenCalledWith(1);
});
