import { getContentful } from '__test-utils__/contentful'

test('environment should contain version type with 1 field', async () => {
  const { environment } = await getContentful()

  const contentType = await environment.getContentType('versionTracking')

  expect(contentType.fields).toContainEqual(
    expect.objectContaining({ id: 'version' }),
  )
})
