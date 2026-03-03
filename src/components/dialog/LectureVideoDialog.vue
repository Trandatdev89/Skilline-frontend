<template>
  <el-dialog
    v-model="visibility"
    @closed="onDialogClosed"
    :destroy-on-close="true"
  >
    <template #header>
      <div>{{ props.title }}</div>
    </template>
    <div style="width: 100%; padding-top: 15px">
      <div ref="containerRef"></div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, ref, watch } from 'vue'
  import videojs from 'video.js'
  import type Player from 'video.js/dist/types/player'

  const containerRef = ref<HTMLDivElement>()
const player = ref<Player | null>(null)
const visibility = ref<boolean>(false)
let videoElement: HTMLVideoElement | null = null

const props = defineProps<{
  videoId: string,
  title: string
}>()

const disposePlayer = () => {
  if (player.value) {
    try {
      if (!player.value.isDisposed()) {
        player.value.pause()
        player.value.dispose()
      }
    } catch (e) {
      console.error('Error disposing player:', e)
    }
    player.value = null
  }

  // Xóa video element
  if (videoElement && videoElement.parentNode) {
    videoElement.parentNode.removeChild(videoElement)
  }
  videoElement = null

  // Clear container
  if (containerRef.value) {
    containerRef.value.innerHTML = ''
  }
}

const initPlayer = () => {
  // Dispose player cũ hoàn toàn trước
  disposePlayer()

  if (!containerRef.value || !props.videoId) {
    console.log('No container or videoId')
    return
  }

  try {
    // Tạo video element mới hoàn toàn
    videoElement = document.createElement('video')
    videoElement.className = 'video-js vjs-default-skin'
    videoElement.style.width = '100%'
    videoElement.setAttribute('playsinline', '')

    // Append vào container
    containerRef.value.appendChild(videoElement)

    // Init Video.js với element mới
    player.value = videojs(videoElement, {
      controls: true,
      autoplay: false,
      preload: 'auto',
      fluid: false,
      responsive: true,
      height: 500, // cố định height
      sources: [{
        src: `http://localhost:8080/api/file/stream/${props.videoId}/master.m3u8`,
        type: 'application/x-mpegURL'
      }]
    })

  } catch (e) {
    console.error('Error initializing player:', e)
  }
}

// Watch visibility để init player
watch(visibility, (newVal) => {
  if (newVal) {
    // Delay để đảm bảo dialog đã render
    setTimeout(() => {
      initPlayer()
    }, 150)
  }
})

const show = () => {
  console.log('Opening video:', props.videoId)
  visibility.value = true
}

const hide = () => {
  visibility.value = false
}

const onDialogClosed = () => {
  // Dispose khi dialog đóng
  disposePlayer()
}

onBeforeUnmount(() => {
  disposePlayer()
})

defineExpose({ show, hide })
</script>

<style scoped>
@import 'video.js/dist/video-js.css';
</style>