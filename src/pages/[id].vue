<script setup lang="ts">
import { getProject } from '~/content/projectQ'

const route = useRoute()

const project = ref()
async function getProjects() {
  if (route.params.id === null)
    return
  const projects = await getProject(route.params.id)
  project.value = projects
}

onMounted(async () => {
  await getProjects()
})
</script>

<template>
  <div w-full flex flex-col items-start justify-start>
    <div pl5 text-3xl lg:pl8>
      <RouterLink to="/">
        Home
      </RouterLink>
    </div>
    <TheProject :project="project" />
  </div>
</template>
