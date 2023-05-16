<script setup lang="ts">
interface Project {
  title: string
  text: string
  langs: { name: string; color: string }[]
  vid: string
  mainImage: string
  url: string

}
const { projects } = defineProps<{ projects: Project[] }>()
</script>

<template>
  <div grid grid-flow-row-dense grid-cols-12 w-full gap-10>
    <MiniProject v-for="project in projects" :key="project" class="holder" :project="project" />
  </div>
</template>
