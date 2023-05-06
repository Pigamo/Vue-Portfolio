import imageUrlBuilder from '@sanity/image-url'
import { type ClientConfig, createClient } from '@sanity/client'
import useSanityCache from '../composables/useSanityCache'

const config: ClientConfig = {
  projectId: 'iz0rdcef',
  dataset: 'production',
  useCdn: true, // set to `true` to fetch from edge cache
  apiVersion: '2022-01-12', // use current date (YYYY-MM-DD) to target the latest API version
}
const client = createClient(config)
const builder = imageUrlBuilder(
  client.config(),
)

// Function to get the image URL from an image reference
function urlFor(source: any) {
  return builder.image(source)
}
const { fetch } = useSanityCache()

interface Project {
  name: string
  langs: Object
  body: Object
  mainImage: Object
  text: string
}

export async function getProjects(): Promise<Project[]> {
  try {
    const query = `*[_type == "post"]{
      title,
      langs[]->{title, color},
      body,
      text,
      mainImage,
      vid,
      type,
    }`
    const data = await fetch<Project[]>(query, {}, 'proj')

    const list = data.map((project: any) => {
      if (!project.mainImage)
        return project
      return {
        ...project,
        mainImage: urlFor(project.mainImage),
      }
    })

    return list
  }
  catch (error) {
    // console.log(error)
    return []
  }
}
