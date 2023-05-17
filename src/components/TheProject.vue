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
async function getVideo(n: string) {
  const v = await getVideoUrl(n)
  video.value = v
}
watch(() => project, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    if (project.vid === undefined || project.vid === null || project.vid === '')
      return
    getVideo(project.vid)
  }
})
</script>

<template>
  <div v-if="project" relative w-full flex flex-wrap items-start justify-start text-left>
    <div class="lg:top-1/4 lg:w-1/2" z-3 mb10 w-full flex flex-wrap items-start justify-start rounded-lg p4 lg:sticky lg:p8 lg:pr10>
      <div h-full>
        <h3 order-first w-full py8 text-4xl font-bold>
          {{ project.title }} <a v-if="project.url" :href="project.url" target="_blank" rel="noreferrer" class="flex-inline items-center justify-center text-blue">
            <div flex items-center justify-start gap-2 text-lg font-600>
              <div i-carbon-link />
            </div>
          </a>
        </h3>

        <p ref="target" pr3 text-left transition-all md:pr20 :class="!isOutside ? 'text-red' : ''">
          {{ project.text }}
        </p>
        <ul z-20 flex flex-wrap items-center justify-start gap-2 pt10 text-xs font-600 text-dark md:text-lg>
          <li v-for="lang in project.langs" :key="lang" rounded-2xl px4 py2 :style="`background:${lang.color.hex}`">
            {{ lang.title }}
          </li>
        </ul>
      </div>
    </div>
    <video v-if="video.length > 0" :src="video" class="z-1 lg:w-1/2" loop muted playsinline autoplay w-full p4 />
    <img v-else-if="project.mainImage" :src="project.mainImage" class="z-1 lg:w-1/2" w-full p4>
  </div>
</template>
