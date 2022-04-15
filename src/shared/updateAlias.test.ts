import { anAlias } from "__test-utils__/factories/aliasFactory";
import { aSpace } from "__test-utils__/factories/spaceFactory";
import { updateAlias } from "./updateAlias";

beforeAll(() => {
  jest.spyOn(process, "exit").mockImplementation(() => ({} as never));
});

beforeEach(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "group").mockImplementation(() => {});
  jest.spyOn(process.stdout, "write").mockImplementation(() => true);
});

test("successfully update alias", async () => {
  const mockUpdate = jest.fn();
  const alias = anAlias({
    update: mockUpdate,
  });
  const mockGetEnvironmentAlias = jest.fn().mockResolvedValue(alias);
  const space = aSpace({
    getEnvironmentAlias: mockGetEnvironmentAlias,
  });

  await updateAlias(space, "environment-id");

  expect(mockGetEnvironmentAlias).toHaveBeenCalledWith("master");
  expect(mockUpdate).toHaveBeenCalled();
});
