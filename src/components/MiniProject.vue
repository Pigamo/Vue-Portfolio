<script setup lang="ts">
import { getVid } from '~/content/videos'

interface Project {
  title: string
  text: string
  langs: { name: string; color: string }[]
  vid: string
  mainImage: string
  url: string

}
const { project, vid } = defineProps<{ project: Project; vid: string }>()

const target = ref(null)

const { x, y, isOutside } = useMouseInElement(target)
const video = ref<string>('')

async function getVideo(n: string) {
  const v = await getVid(n)
  video.value = v
}

const videoUrls = ref<Map<string, string>>(new Map())

async function getVideoUrl(videoName: string) {
  if (videoUrls.value.has(videoName)) {
    return videoUrls.value.get(videoName)
  }
  else {
    const videoUrl = await getVid(videoName)
    videoUrls.value.set(videoName, videoUrl)
    return videoUrl
  }
}
const vidControls = ref(null)
onMounted(async () => {
  if (project.vid === null || project.vid === undefined || project.vid === '')
    return

  video.value = await getVideoUrl(project.vid)
})
const vis = useMouseInElement(target)
watchEffect(() => {
  if (vidControls.value === null)
    return
  if (!vis.isOutside.value)
    vidControls.value.play()
  else if (vis.isOutside.value)
    vidControls.value.pause()
})
const router = useRouter()
</script>

<template>
  <div

    relative col-span-12 min-h-80 w-full flex cursor-pointer items-center justify-center @click.prevent="() => router.push(project.slug.current)" overflow-hidden shadow-md :class="video.length > 0 ? '  md:col-span-5' : 'md:col-span-5'"
  >
    <div ref="target" relative z-2 h-full w-full>
      <div h-full w-full flex items-center justify-start p5 text-4xl font-bold text-light transition-opacity duration-500 ease-in-out md:text-6xl hover:opacity-0 class="bg-dark/50">
        {{ project.title }}
      </div>
    </div>
    <video
      v-if="video.length > 0"
      ref="vidControls" :src="`${video}#t=12`"
      :autoplay="!vis.isOutside" class="-z-1" loop muted object-fit playsinline absolute left-0 top-0 h-full w-full object-cover
    />
    <img
      v-else-if="project.mainImage"
      :src="project.mainImage"
      object-fit absolute left-0 class="-z-1" top-0 h-full w-full object-cover
    >
  </div>
</template>
