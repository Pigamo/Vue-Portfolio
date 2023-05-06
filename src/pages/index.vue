<script setup lang="ts">
import { getProjects } from '~/content/projectQ'

import { getVids } from '~/content/videos'
// import projects from '~/content/projects.json'
defineOptions({
  name: 'IndexPage',
})
const projects = ref([])
async function getProject() {
  const project = await getProjects()
  projects.value = project
}
onMounted(async () => {
  await getProject()
})

const user = useUserStore()

const vid = ref<String[]>([])

async function getVideo() {
  vid.value = await getVids()
}
onMounted(() => {
  getVideo()
})
const tab = ref(0)
const tabs = [
  'web', 'games', 'drone', '3D',
]
</script>

<template>
  <div relative h-full w-full>
    <nav absolute z-99 w-full flex justify-end>
      <ul w-200 flex justify-evenly text-xl>
        <li v-for="t, i in tabs" :key="t" @click.prevent="tab = i">
          {{ t }}
          <div :class="tab === i ? 'bg-blue' : ''" class="h-1 w-full" />
        </li>
      </ul>
    </nav>
    <div absolute left-0 right-0 h-full w-full>
      <MouseDraw h-full />
    </div>
    <div flex flex-wrap items-center justify-start text-left lg:p8>
      <div w-full flex flex-col items-start justify-center pb10 prose>
        <h1 text-5xl lg:text-6xl>
          Lucas Dawson
        </h1>
        <h2>
          Portfolio/<div flex-inline items-center justify-center capitalize text-blue>
            {{ tabs[tab] }}
          </div>
        </h2>
      </div>
      <TransitionGroup name="fade">
        <TheProject v-for="project, i in projects.filter(proj => proj.type === tabs[tab])" :key="project" class="holder" :project="project" :vid="vid[i]" />
      </TransitionGroup>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
