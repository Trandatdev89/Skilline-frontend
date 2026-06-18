<template>
  <el-dialog
      v-model="visibility"
      @closed="onDialogClosed"
      :destroy-on-close="true"
      :show-close="false"
      width="820px"
      top="3vh"
      class="lecture-dialog"
  >
    <template #header>
      <div class="dialog-header">
        <div class="header-left">
          <div class="header-icon">
            <el-icon>
              <VideoPlay />
            </el-icon>
          </div>
          <div class="header-info">
            <span class="header-title">{{ props.title }}</span>
            <span class="header-sub">Video bài giảng</span>
          </div>
        </div>
        <button class="close-btn" @click="hide">
          <el-icon>
            <Close />
          </el-icon>
        </button>
      </div>
    </template>

    <div class="video-wrapper">
      <div ref="containerRef"></div>
    </div>

    <div class="dialog-footer">
      <span class="footer-hint">
        <el-icon><Clock /></el-icon>
        Nhấn ESC hoặc nút X để đóng
      </span>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
  import {Close,VideoPlay} from '@element-plus/icons-vue'
  import { onBeforeUnmount, ref, watch } from 'vue'
  import videojs from 'video.js'
  import type Player from 'video.js/dist/types/player'

  const containerRef = ref<HTMLDivElement>()
  const player = ref<Player | null>(null)
  const visibility = ref<boolean>(false)
  let videoElement: HTMLVideoElement | null = null

  const props = defineProps<{
    videoId: string | undefined,
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

    if (videoElement && videoElement.parentNode) {
      videoElement.parentNode.removeChild(videoElement)
    }
    videoElement = null

    if (containerRef.value) {
      containerRef.value.innerHTML = ''
    }
  }

  const initPlayer = () => {
    disposePlayer()

    if (!containerRef.value || !props.videoId) {
      console.log('No container or videoId')
      return
    }

    try {
      videoElement = document.createElement('video')
      videoElement.className = 'video-js vjs-default-skin'
      videoElement.style.width = '100%'
      videoElement.setAttribute('playsinline', '')

      containerRef.value.appendChild(videoElement)

      player.value = videojs(videoElement, {
        controls: true,
        autoplay: false,
        preload: 'auto',
        fluid: false,
        responsive: true,
        height: 500,
        sources: [{
          src: `http://localhost:8080/api/file/stream/${props.videoId}/master.m3u8`,
          type: 'application/x-mpegURL'
        }]
      })

    } catch (e) {
      console.error('Error initializing player:', e)
    }
  }

  watch(visibility, (newVal) => {
    if (newVal) {
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
    disposePlayer()
  }

  onBeforeUnmount(() => {
    disposePlayer()
  })

  defineExpose({ show, hide })
</script>

<style>
  @import 'video.js/dist/video-js.css';

  :deep(.lecture-dialog) {
    border-radius: 14px !important;
    overflow: hidden;

    .el-dialog__header {
      padding: 0;
      margin: 0;
    }

    .el-dialog__body {
      padding: 0;
    }
  }

  .dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px;
    border-bottom: 1px solid #f0f0f0;

    .header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .header-icon {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      background: #ecf5ff;
      display: flex;
      align-items: center;
      justify-content: center;

      .el-icon {
        font-size: 16px;
        color: #409eff;
      }
    }

    .header-title {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: #1a2e5a;
      max-width: 620px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .header-sub {
      display: block;
      font-size: 12px;
      color: #909399;
      margin-top: 2px;
    }

    .close-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 6px;
      border-radius: 6px;
      color: #909399;
      display: flex;
      align-items: center;
      transition: background 0.15s, color 0.15s;

      &:hover {
        background: #f5f5f5;
        color: #303133;
      }

      .el-icon {
        font-size: 18px;
      }
    }
  }

  .video-wrapper {
    background: #0a0a0a;
    width: 100%;

    :deep(.video-js) {
      width: 100% !important;
      height: 460px !important;
    }
  }

  .dialog-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 10px 18px;
    border-top: 1px solid #f0f0f0;

    .footer-hint {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 12px;
      color: #c0c4cc;

      .el-icon {
        font-size: 13px;
      }
    }
  }
</style>