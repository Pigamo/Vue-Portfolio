import { getDownloadURL, getStorage, listAll, ref } from 'firebase/storage'

import app from '../firebase'

// Assuming Firebase is already initialized

// Get a reference to the storage service
const storage = getStorage(app)

// Create a storage reference for the video
const videoRef = ref(storage)
export async function getVid(name: string) {
  const vidStore = ref(storage, name)
  const url = await getDownloadURL(vidStore)
  return url
}

export async function getVids() {
  const list = await listAll(videoRef)

  const vList: String[] = []
  list.items.forEach((itemRef) => {
    getDownloadURL(itemRef).then((url) => {
      vList.push(url)
    })
  })
  return vList
}
