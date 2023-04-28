<script setup lang="ts">
import { getProjects } from '~/content/projectQ'
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
const name = $ref(user.savedName)

const router = useRouter()

const { t } = useI18n()
</script>

<template>
  <div relative h-full w-full>
    <div absolute left-0 right-0 h-full w-full>
      <MouseDraw h-full />
    </div>
    <div flex flex-wrap items-center justify-start text-left lg:p8>
      <div w-full flex flex-col items-start justify-center pb10 prose>
        <h1 text-5xl lg:text-6xl>
          Lucas Dawson
        </h1>
        <h2>Portfolio.</h2>
      </div>

      <TheProject v-for="project in projects" :key="project" class="holder" :project="project" />
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
