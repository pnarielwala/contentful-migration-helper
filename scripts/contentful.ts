import { createCommand } from 'commander';

import loadConfig from './shared/loadConfig';
import validateConfig from './shared/validateConfig';

import addMigrationCLI from './migrate';
import addUpdateAliasCLI from './updateAlias';
import addDeleteCLI from './delete';
import addExportCLI from './export';
import addImportCLI from './import';
// import addTemplateCLI from './create-template';
import { Config } from './shared/types';

const program = createCommand();

program.name('yarn contentful').usage('[command] [options]');

loadConfig().then(({ config }) => {
  const valid = validateConfig(config);

  if (!valid) {
    process.exit(1);
  }

  const parsedConfig = config as Config;

  // addTemplateCLI(program);
  addMigrationCLI(program, parsedConfig);
  addUpdateAliasCLI(program, parsedConfig);
  addDeleteCLI(program, parsedConfig);
  addExportCLI(program, parsedConfig);
  addImportCLI(program, parsedConfig);

  program.parse(process.argv);
});
