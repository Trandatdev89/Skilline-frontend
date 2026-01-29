<template>
  <el-form
      ref="formRef"
      :model="modelValue"
      :rules="rules">
    <el-form-item label-position="top" label="Tiêu đề" prop="title">
      <el-input v-model="modelValue.title" />
    </el-form-item>
    <el-form-item label-position="top" label="Upload video" prop="videoFile">
      <el-upload :auto-upload="false"
                 :show-file-list="false"
                 accept="video/*"
                 :limit="1"
                 drag
                 @change="handleProcessFile">
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          Kéo thả video vào đây hoặc <em>click để chọn</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            Chỉ hỗ trợ video mp4/avi/mov
          </div>
        </template>
      </el-upload>
    </el-form-item>
  </el-form>

  <el-card v-if="previewVideo" class="video-preview-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <span>Video Preview</span>
        <el-button
            type="danger"
            :icon="Delete"
            circle
            size="small"
            @click="handleRemoveFile"
        />
      </div>
    </template>

    <div class="video-container">
      <video
          ref="videoRef"
          :src="previewVideo"
          controls
          preload="metadata"
          class="video-player"
          @loadedmetadata="handleVideoLoaded"
      >
        Trình duyệt của bạn không hỗ trợ video.
      </video>
    </div>

    <div class="video-details">
      <el-descriptions :column="1" size="small" border>
        <el-descriptions-item label="Tên file">
          {{ videoFileName }}
        </el-descriptions-item>
        <el-descriptions-item label="Kích thước">
          {{ formatFileSize(videoFileSize) }}
        </el-descriptions-item>
        <el-descriptions-item label="Thời lượng" v-if="videoDuration">
          {{ formatDuration(videoDuration) }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </el-card>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import { Delete, UploadFilled } from '@element-plus/icons-vue'

  const rules = reactive<FormRules>({
    title: [
      { required: true, message: 'Trường này băt buộc', trigger: 'blur' }
    ],
    courseId: [
      { required: true, message: 'Trường này băt buộc', trigger: 'blur' }
    ],
    position: [
      { required: true, message: 'Trường này băt buộc', trigger: 'blur' }
    ],
    videoFile: [
      { required: true, message: 'Trường này băt buộc', trigger: 'blur' }
    ]
  })

  const formRef = ref<FormInstance>()
  const videoRef = ref<HTMLVideoElement>()
  const modelValue = defineModel<any>({ required: true })
  const previewVideo = ref<string | null>(null)
  const videoFileName = ref<string>('')
  const videoFileSize = ref<number>(0)
  const videoDuration = ref<number>(0)

  const handleProcessFile = (file: any) => {
    if (file && file.raw) {
      modelValue.value.videoFile = file.raw
      videoFileName.value = file.name
      videoFileSize.value = file.size

      // Revoke previous object URL to avoid memory leak
      if (previewVideo.value) {
        URL.revokeObjectURL(previewVideo.value)
      }

      previewVideo.value = URL.createObjectURL(file.raw)
    }
  }

  const handleVideoLoaded = () => {
    if (videoRef.value) {
      videoDuration.value = videoRef.value.duration
    }
  }

  const handleRemoveFile = () => {
    // Revoke object URL to free memory
    if (previewVideo.value) {
      URL.revokeObjectURL(previewVideo.value)
    }

    previewVideo.value = null
    videoFileName.value = ''
    videoFileSize.value = 0
    videoDuration.value = 0
    modelValue.value.videoFile = null
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const validate = async (): Promise<boolean> => {
    if (!formRef.value) return false

    try {
      await formRef.value.validate()
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  const resetFields = () => {
    formRef.value?.resetFields()
    handleRemoveFile()
  }

  defineExpose({
    validate,
    resetFields
  })
</script>

<style scoped lang="scss">
  .video-preview-card {
    margin-top: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .video-container {
      margin-bottom: 15px;

      .video-player {
        width: 100%;
        max-height: 400px;
        border-radius: 4px;
        background-color: #000;
      }
    }

    .video-details {
      margin-top: 15px;
    }
  }

  :deep(.el-upload-dragger) {
    padding: 20px;
  }
</style>