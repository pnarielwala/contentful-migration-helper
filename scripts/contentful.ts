import { createCommand } from 'commander'
import { config } from 'dotenv'

import addMigrationCLI from './migrate'
import addUpdateAliasCLI from './updateAlias'
import addDeleteCLI from './delete'
import addExportCLI from './export'
import addImportCLI from './import'
import addTemplateCLI from './create-template'

const ENV = config().parsed ?? {}

const program = createCommand()

program.name('yarn contentful').usage('[command] [options]')

addTemplateCLI(program)
addMigrationCLI(program, ENV)
addUpdateAliasCLI(program, ENV)
addDeleteCLI(program, ENV)
addExportCLI(program, ENV)
addImportCLI(program, ENV)

program.parse(process.argv)
