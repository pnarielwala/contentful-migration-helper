import { lilconfig } from 'lilconfig';

export const dynamicImport = (path: string) =>
  import(path).then((module) => module.default);

const jsonParse = (path: any, content: any) => JSON.parse(content);
const searchPlaces = [
  'package.json',
  '.contentfulmigrationtoolrc',
  '.contentfulmigrationtoolrc.json',
  '.contentfulmigrationtoolrc.js',
  'contentful-migration-tool.config.js',
];
const loaders = {
  '.js': dynamicImport,
  '.json': jsonParse,
};

export const loadConfig = async () => {
  const explorer = lilconfig('contentfulmigrationtool', {
    searchPlaces,
    loaders,
  });
  const result = await explorer.search(process.cwd());

  const config = await result?.config;
  const filepath = result?.filepath;

  return { config, filepath };
};

export default loadConfig;
