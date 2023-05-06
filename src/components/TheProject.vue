<script setup lang="ts">
import { getVid } from '~/content/videos'

interface Project {
  title: string
  text: string
  langs: { name: string; color: string }[]
  vid: string
  mainImage: string

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
onMounted(async () => {
  if (project.vid === null || project.vid === undefined || project.vid === '')
    return

  video.value = await getVideoUrl(project.vid)
})
</script>

<template>
  <div w-full flex flex-wrap items-center justify-start>
    <div class="lg:w-1/2" z-3 mb10 w-full flex flex-wrap skew-y-181 items-start justify-start rounded-lg bg-white p4 shadow-2xl lg:p8 lg:pr10>
      <div h-full>
        <h3 order-first w-full py5 text-4xl font-bold>
          {{ project.title }}
        </h3>
        <p ref="target" px3 text-left transition-all md:pl10 md:pr20 :class="!isOutside ? 'text-red' : ''">
          {{ project.text }}
        </p>
        <ul z-20 flex flex-wrap items-center justify-start gap-2 pt10 text-xs font-600 text-dark md:text-lg>
          <li v-for="lang in project.langs" :key="lang" rounded-2xl px4 py2 :style="`background:${lang.color.hex}`">
            {{ lang.title }}
          </li>
        </ul>
      </div>
    </div>
    <video v-if="video.length > 0" :src="video" class="z-1 lg:w-1/2" autoplay loop muted playsinline w-full p4 />
    <img v-else-if="project.mainImage" :src="project.mainImage" class="z-1 lg:w-1/2" w-full p4>
  </div>
</template>
