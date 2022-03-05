import { createClient } from 'contentful-management'

const client = createClient({
  accessToken: String(process.env.CONTENTFUL_MANAGEMENT_TOKEN),
})

export const getContentful = async () => {
  const space = await client.getSpace(String(process.env.CONTENTFUL_SPACE_ID))
  const environment = await space.getEnvironment(
    String(process.env.CONTENTFUL_ENVIRONMENT_ID),
  )

  return { environment, space }
}
