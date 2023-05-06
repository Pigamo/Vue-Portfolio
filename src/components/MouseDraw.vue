<script setup lang="ts">
import { onMounted, ref } from 'vue'
// onUnmounted(() => {
//     if (animationFrameId) {
//         cancelAnimationFrame(animationFrameId);
//     }
// });
import { isDark } from '~/composables/dark'

const target = ref(null)
const el = ref(null)
const { width, height } = useElementBounding(el)
const { x, y, isOutside } = useMouseInElement(target)
const canvas = ref<HTMLCanvasElement | null>(null)
const context = ref<CanvasRenderingContext2D | null>(null)
const drawing = ref(false)

const animationFrameId: number | null = null
const points: { x: number; y: number }[] = []
const trailLength = 200
const secondPoint = { x: 150, y: 150 }
const collisionRadius = 20
// watch(isOutside, (isOutside) => {
//     if (isOutside) startDrawing();
//     else stopDrawing();
// });
watch(isDark, (isDark) => {
  if (context.value) {
    context.value.strokeStyle = isDark.value ? '#fff' : '#000'
    context.value.shadowColor = isDark.value ? '#fff' : '#000'
  }
})

onMounted(() => {
  initializeCanvas()
  startDrawing()
  //  animationFrameId = requestAnimationFrame(fadeTrail);
})
function initializeCanvas() {
  if (!canvas.value)
    return

  canvas.value.width = width.value
  canvas.value.height = height.value

  context.value = canvas.value.getContext('2d')
  if (context.value) {
    context.value.lineWidth = 3
    context.value.strokeStyle = isDark.value ? '#fff' : '#000' // Neon green color
    context.value.lineCap = 'round' // Gives a brush style effect
    context.value.shadowBlur = 10
    context.value.shadowColor = isDark.value ? '#fff' : '#000'
  }
}

function startDrawing() {
  if (!context.value)
    return
  drawing.value = true
  context.value.beginPath()
  context.value.moveTo(x.value, y.value)
}
function midpoint(p1, p2) {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  }
}
function draw(event: MouseEvent) {
  if (!drawing.value || !context.value)
    return

  points.push({ x: x.value - 14, y: y.value - 40 })

  if (points.length > trailLength)
    points.shift()

  context.value.clearRect(0, 0, canvas.value.width, canvas.value.height)

  context.value.beginPath()
  context.value.moveTo(points[0].x, points[0].y)

  for (let i = 1; i < points.length - 1; i++) {
    const midPoint = midpoint(points[i], points[i + 1])
    context.value.quadraticCurveTo(points[i].x, points[i].y, midPoint.x, midPoint.y)
  }

  context.value.lineTo(points[points.length - 1].x, points[points.length - 1].y)
  context.value.stroke()
}
function stopDrawing() {
  if (!drawing.value || !context.value)
    return
  drawing.value = false
  context.value.closePath()
}
function checkCollision(point1: { x: number; y: number }, point2: { x: number; y: number }): boolean {
  const distance = Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2)
  return distance <= collisionRadius
}

function drawRainbowRing(center: { x: number; y: number }) {
  if (!context.value)
    return

  const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet']
  const ringWidth = 3

  for (let i = 0; i < colors.length; i++) {
    context.value.beginPath()
    context.value.arc(center.x, center.y, collisionRadius + i * ringWidth, 0, 2 * Math.PI)
    context.value.strokeStyle = colors[i]
    context.value.lineWidth = ringWidth
    context.value.stroke()
  }
}
function checkPreviousPoints(point: { x: number; y: number }, points: { x: number; y: number }[], collisionRadius: number): boolean {
  return points.some((prevPoint) => {
    const distance = Math.sqrt((point.x - prevPoint.x) ** 2 + (point.y - prevPoint.y) ** 2)
    return distance <= collisionRadius
  })
}
</script>

<template>
  <div ref="el" absolute left-0 top-0 class="z-3 h-full w-full" @mousedown="drawing ? stopDrawing() : startDrawing()">
    <canvas ref="canvas" @mousemove="draw" />
  </div>
</template>

<style scoped>
canvas {
  display: block;
  //background-color: #ffffff;
}
</style>
