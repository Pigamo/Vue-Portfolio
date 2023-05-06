import { defineDirective } from 'vue'
import { getVid } from '~/content/videos'

const videoSrc = defineDirective({
  async mounted(el, binding) {
    const videoName = binding.value
    const url = await getVid(videoName)
    el.src = url
  },
})
