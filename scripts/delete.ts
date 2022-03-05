import commander from 'commander'
import { DotenvParseOutput } from 'dotenv'
import { createClient } from 'contentful-management'

import { Environment } from 'contentful-management/dist/typings/entities/environment'
import inquirer from 'inquirer'

import { deleteEnvironment } from './shared/scripts'

const deleteCLI = (
  program: commander.Command,
  environmentVariables: DotenvParseOutput,
) => {
  program
    .command('delete')
    .description(
      'Deletes environments from the specified workspace (will NOT delete the main environment)',
    )
    .option('-e --environment-id <id>', 'environment id')
    .requiredOption(
      '-mt --management-token <TOKEN>',
      'contentful management token',
      environmentVariables.CONTENTFUL_MANAGEMENT_TOKEN,
    )
    .requiredOption(
      '-s --space-id <SPACE_ID>',
      'contentful space id',
      environmentVariables.CONTENTFUL_SPACE_ID,
    )
    .action((options) => {
      const ENVIRONMENT_INPUT = options.environmentId
      const CMA_ACCESS_TOKEN = options.managementToken
      const SPACE_ID = options.spaceId

      if (ENVIRONMENT_INPUT == 'master') {
        console.error("forbidden: cannot delete environment 'master'")
        process.exit(1)
      }

      const client = createClient({
        accessToken: CMA_ACCESS_TOKEN,
      })
      const deleteEnv = async () => {
        let environment: Environment | undefined

        const space = await client.getSpace(SPACE_ID)
        if (ENVIRONMENT_INPUT) {
          try {
            space.getEnvironments()
            environment = await space.getEnvironment(ENVIRONMENT_INPUT)
          } catch (e) {
            console.error(
              `error: Environment '${ENVIRONMENT_INPUT}' does not exist on space '${space.name}'`,
            )
            process.exit(1)
          }

          console.log(`Deleting ${ENVIRONMENT_INPUT}...\n`)
          await deleteEnvironment(space, environment.sys.id)
          return
        } else {
          const environments = await space.getEnvironments()

          const environmentNames = environments.items
            .map((env) => env.name)
            .filter((envName) => !envName.includes('main-', 0))

          try {
            const { delEnvironment, confirmed } = await inquirer.prompt([
              {
                type: 'list',
                name: 'delEnvironment',
                message: `Which environment do you want to delete?`,
                choices: environmentNames,
              },
              {
                type: 'confirm',
                name: 'confirmed',
                message: `Are you sure?`,
              },
            ])

            if (confirmed) {
              await deleteEnvironment(space, delEnvironment)
              return
            } else {
              console.log('\nDeletion aborted!\n')
              process.exit(0)
            }
          } catch (e) {
            console.error(e)
          }
        }
      }

      deleteEnv()
    })
}

export default deleteCLI
