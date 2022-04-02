import { Space } from "contentful-management";
import { anEnvironment } from "__test-utils__/factories/environmentFactory";
import { aSpace } from "__test-utils__/factories/spaceFactory";
import { deleteEnvironment } from "./deleteEnvironment";

import { cloneEnvironment } from "./cloneEnvironment";

jest.mock("./deleteEnvironment");

beforeAll(() => {
  jest
    .spyOn(process, "exit")
    .mockImplementation((code?: number) => ({} as never));
});

beforeEach(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(process.stdout, "write").mockImplementation(() => true);
});

test("error when creating environment", async () => {
  const environmentId = "some-environment";

  const mockCreateEnvironmentWithId = jest.fn(() => Promise.reject());
  const space: Space = aSpace({
    createEnvironmentWithId: mockCreateEnvironmentWithId,
  });

  const options = {
    environmentId,
    space,
  };

  const result = await cloneEnvironment(options);

  expect(result).toBeUndefined();

  expect(deleteEnvironment).toHaveBeenCalledWith({
    space,
    environmentId,
    ignoreFailures: true,
  });

  expect(mockCreateEnvironmentWithId).toHaveBeenCalledWith(environmentId, {
    name: environmentId,
  });
  expect(process.stdout.write).toHaveBeenCalledWith(
    `\nCreating environment...`
  );
  expect(process.stdout.write).toHaveBeenCalledWith(`failure!\n`);
  expect(process.exit).toHaveBeenCalledWith(1);
});

test("successfully creating environment", async () => {
  const environmentId = "some-environment";
  const environment = anEnvironment();
  const mockCreateEnvironmentWithId = jest.fn(() =>
    Promise.resolve(environment)
  );

  const mockGetEnvironment = jest.fn(() =>
    Promise.resolve(
      anEnvironment({
        ...environment,
        sys: {
          ...environment.sys,
          status: {
            ...environment.sys.status,
            sys: {
              ...environment.sys.status.sys,
              id: "ready",
            },
          },
        },
      })
    )
  );
  const space: Space = aSpace({
    getEnvironment: mockGetEnvironment,
    createEnvironmentWithId: mockCreateEnvironmentWithId,
  });

  const options = {
    environmentId,
    space,
  };

  const result = await cloneEnvironment(options);

  expect(result).toBe(environment);

  expect(deleteEnvironment).toHaveBeenCalledWith({
    space,
    environmentId,
    ignoreFailures: true,
  });

  expect(mockCreateEnvironmentWithId).toHaveBeenCalledWith(environmentId, {
    name: environmentId,
  });
  expect(process.stdout.write).toHaveBeenCalledWith(
    `\nCreating environment...`
  );
  expect(process.stdout.write).toHaveBeenCalledWith(`done!\n`);
  expect(process.exit).not.toHaveBeenCalled();
});

test("delay in new environment being ready", async () => {
  const environmentId = "some-environment";
  const environment = anEnvironment();
  const mockCreateEnvironmentWithId = jest.fn(() =>
    Promise.resolve(environment)
  );

  const mockGetEnvironment = jest.fn();

  mockGetEnvironment
    .mockResolvedValueOnce(environment)
    .mockResolvedValueOnce(environment)
    .mockResolvedValue(
      anEnvironment({
        ...environment,
        sys: {
          ...environment.sys,
          status: {
            ...environment.sys.status,
            sys: {
              ...environment.sys.status.sys,
              id: "ready",
            },
          },
        },
      })
    );
  const space: Space = aSpace({
    getEnvironment: mockGetEnvironment,
    createEnvironmentWithId: mockCreateEnvironmentWithId,
  });

  const options = {
    environmentId,
    space,
  };

  const result = await cloneEnvironment(options);

  expect(result).toBe(environment);

  expect(deleteEnvironment).toHaveBeenCalledWith({
    space,
    environmentId,
    ignoreFailures: true,
  });

  expect(mockCreateEnvironmentWithId).toHaveBeenCalledWith(environmentId, {
    name: environmentId,
  });

  expect(mockGetEnvironment).toHaveBeenCalledTimes(3);
  expect(process.stdout.write).toHaveBeenCalledWith(
    `\nCreating environment...`
  );
  expect(process.stdout.write).toHaveBeenCalledWith(`done!\n`);
  expect(process.exit).not.toHaveBeenCalled();
}, 20000);

test("error when processing new environment", async () => {
  const environmentId = "some-environment";
  const environment = anEnvironment();
  const mockCreateEnvironmentWithId = jest.fn(() =>
    Promise.resolve(environment)
  );

  const mockGetEnvironment = jest.fn();

  mockGetEnvironment
    .mockResolvedValueOnce(environment)
    .mockResolvedValueOnce(environment)
    .mockResolvedValue(
      anEnvironment({
        ...environment,
        sys: {
          ...environment.sys,
          status: {
            ...environment.sys.status,
            sys: {
              ...environment.sys.status.sys,
              id: "failed",
            },
          },
        },
      })
    );
  const space: Space = aSpace({
    getEnvironment: mockGetEnvironment,
    createEnvironmentWithId: mockCreateEnvironmentWithId,
  });

  const options = {
    environmentId,
    space,
  };

  const result = await cloneEnvironment(options);

  expect(result).toBe(environment);

  expect(deleteEnvironment).toHaveBeenCalledWith({
    space,
    environmentId,
    ignoreFailures: true,
  });

  expect(mockCreateEnvironmentWithId).toHaveBeenCalledWith(environmentId, {
    name: environmentId,
  });

  expect(mockGetEnvironment).toHaveBeenCalledTimes(3);
  expect(process.stdout.write).toHaveBeenCalledWith(
    `\nCreating environment...`
  );
  expect(process.stdout.write).toHaveBeenCalledWith(
    `failure! Unable to process environment.\n`
  );
  expect(process.stdout.write).not.toHaveBeenCalledWith(`failure!\n`);
  expect(process.exit).toHaveBeenCalled();
}, 20000);
