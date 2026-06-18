<template>
  <el-form ref="formRef" :model="modelValue" :rules="rules" label-position="top">
    <el-form-item label="Tiêu đề" prop="title">
      <el-input v-model="modelValue.title" />
    </el-form-item>

    <el-form-item label="Trạng thái xuất bản" prop="publishStatus">
      <el-select v-model="modelValue.publishStatus" style="width: 100%">
        <el-option value="DRAFT" label="Bản nháp" />
        <el-option value="PUBLISHER" label="Đã xuất bản" />
        <el-option value="ARCHIVED" label="Lưu trữ" />
      </el-select>
    </el-form-item>

    <el-form-item label="Cho phép xem thử">
      <el-switch v-model="modelValue.previewable" active-text="Có" inactive-text="Không" />
    </el-form-item>

    <!-- Upload video -->
    <el-form-item label="Upload video">
      <el-upload
          :auto-upload="false"
          :show-file-list="false"
          accept="video/*"
          :limit="1"
          drag
          ref="inputUpload"
          @change="handleProcessVideoFile">
        <el-icon class="el-icon--upload">
          <upload-filled />
        </el-icon>
        <div class="el-upload__text">
          Kéo thả video vào đây hoặc <em>click để chọn</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">Chỉ hỗ trợ video mp4/avi/mov</div>
        </template>
      </el-upload>
    </el-form-item>
  </el-form>

  <!-- Preview video -->
  <el-card v-if="previewVideo" class="video-preview-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <span>Video Preview</span>
        <el-button type="danger" :icon="Delete" circle size="small" @click="handleRemoveVideo" />
      </div>
    </template>
    <div class="video-container">
      <video
          ref="videoRef"
          :src="previewVideo"
          controls
          preload="metadata"
          class="video-player"
          @loadedmetadata="handleVideoLoaded">
        Trình duyệt của bạn không hỗ trợ video.
      </video>
    </div>
    <div class="video-details">
      <el-descriptions :column="1" size="small" border>
        <el-descriptions-item label="Tên file">{{ videoFileName }}</el-descriptions-item>
        <el-descriptions-item label="Kích thước">{{ formatFileSize(videoFileSize) }}</el-descriptions-item>
        <el-descriptions-item label="Thời lượng" v-if="videoDuration">{{ formatDuration(videoDuration) }}
        </el-descriptions-item>
        <el-descriptions-item label="Trạng thái">
          <el-tag :type="modelValue.contentAssetId ? 'success' : 'warning'">
            {{ modelValue.contentAssetId ? 'Đã upload lên S3' : 'Đang upload...' }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </el-card>

  <!-- Preview thumbnail -->
  <div style="position: relative; width: 100px; height: 100px; margin-top: 10px" v-if="thumbnailPreview">
    <span
        style="position: absolute; color: red; font-size: 20px; cursor: pointer; top: -14px; right: -8px; z-index:1"
        @click="handleRemoveThumbnail">✕</span>
    <img :src="thumbnailPreview" alt="thumbnail"
         style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px" />
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref, watch, watchEffect } from 'vue'
  import type { FormInstance, FormRules, UploadInstance } from 'element-plus'
  import { Delete, UploadFilled } from '@element-plus/icons-vue'

  const formRef = ref<FormInstance>()
  const videoRef = ref<HTMLVideoElement>()
  const modelValue = defineModel<any>({ required: true })
  const props = defineProps<{
    previewVideoFromDB:String
  }>();

  // Video state
  const previewVideo = ref<string | null>(null)
  const videoFileName = ref('')
  const videoFileSize = ref(0)
  const videoDuration = ref(0)
  const inputUpload = ref<UploadInstance>()
  const thumbnailPreview = ref<string>('')

  const rules = reactive<FormRules>({
    title: [{ required: true, message: 'Trường này bắt buộc', trigger: 'blur' }]
  })

  const handleProcessVideoFile = async (file: any) => {
    if (!file?.raw) return
    const rawFile: File = file.raw

    if (previewVideo.value) URL.revokeObjectURL(previewVideo.value)
    previewVideo.value = URL.createObjectURL(rawFile)
    videoFileName.value = file.name
    videoFileSize.value = file.size

    modelValue.value.videoFile = rawFile
    inputUpload.value?.clearFiles()
  }

  const handleVideoLoaded = () => {
    if (videoRef.value) {
      videoDuration.value = videoRef.value.duration
      modelValue.value.durationSeconds = Math.floor(videoRef.value.duration)
    }
  }

  const handleRemoveVideo = () => {
    if (previewVideo.value) URL.revokeObjectURL(previewVideo.value)
    previewVideo.value = null
    videoFileName.value = ''
    videoFileSize.value = 0
    videoDuration.value = 0
    modelValue.value.contentAssetId = null
    modelValue.value.durationSeconds = null
    inputUpload.value?.clearFiles()
  }

  const handleRemoveThumbnail = () => {
    if (thumbnailPreview.value?.startsWith('blob:')) URL.revokeObjectURL(thumbnailPreview.value)
    thumbnailPreview.value = ''
    modelValue.value.thumbnailAssetId = null
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const validate = async (): Promise<boolean> => {
    if (!formRef.value) return false
    try {
      await formRef.value.validate()
      return true
    } catch {
      return false
    }
  }

  const resetFields = () => {
    formRef.value?.resetFields()
    handleRemoveVideo()
    handleRemoveThumbnail()
  }

  watch(() => props.previewVideoFromDB, (value, oldValue) => {
    if (value) {
      previewVideo.value = value as string
    } else {
      previewVideo.value = null
    }
  }, { immediate: true })
  defineExpose({ validate, resetFields })
</script>

<style scoped lang="scss">
  .video-preview-card {
    margin-top: 16px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .video-container {
      margin-bottom: 12px;

      .video-player {
        width: 100%;
        max-height: 360px;
        border-radius: 4px;
        background: #000;
      }
    }

    .video-details {
      margin-top: 12px;
    }
  }

  :deep(.el-upload-dragger) {
    padding: 20px;
  }
</style>