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
          @change="handleProcessVideoFile">
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          Kéo thả video vào đây hoặc <em>click để chọn</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">Chỉ hỗ trợ video mp4/avi/mov</div>
        </template>
      </el-upload>
    </el-form-item>

    <!-- Progress bar video -->
    <el-progress
        v-if="videoUploading"
        :percentage="videoUploadPercent"
        :stroke-width="8"
        style="margin-bottom: 12px" />

    <!-- Upload thumbnail -->
    <el-form-item label="Ảnh thumbnail (tuỳ chọn)">
      <el-upload
          :auto-upload="false"
          :show-file-list="false"
          accept="image/*"
          :limit="1"
          @change="handleProcessThumbnailFile">
        <el-button :loading="thumbnailUploading">
          {{ thumbnailUploading ? `Đang upload... ${thumbnailUploadPercent}%` : 'Chọn ảnh thumbnail' }}
        </el-button>
      </el-upload>
    </el-form-item>

    <el-progress
        v-if="thumbnailUploading"
        :percentage="thumbnailUploadPercent"
        :stroke-width="6"
        style="margin-bottom: 12px" />
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
        <el-descriptions-item label="Thời lượng" v-if="videoDuration">{{ formatDuration(videoDuration) }}</el-descriptions-item>
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
    <img :src="thumbnailPreview" alt="thumbnail" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px" />
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import { Delete, UploadFilled } from '@element-plus/icons-vue'
  import MediaApi from '@/api/MediaApi.ts'
  import AlertService from '@/service/AlertService.ts'

  const formRef = ref<FormInstance>()
  const videoRef = ref<HTMLVideoElement>()
  const modelValue = defineModel<any>({ required: true })

  // Video state
  const previewVideo = ref<string | null>(null)
  const videoFileName = ref('')
  const videoFileSize = ref(0)
  const videoDuration = ref(0)
  const videoUploading = ref(false)
  const videoUploadPercent = ref(0)

  // Thumbnail state
  const thumbnailPreview = ref<string>('')
  const thumbnailUploading = ref(false)
  const thumbnailUploadPercent = ref(0)

  const rules = reactive<FormRules>({
    title: [{ required: true, message: 'Trường này bắt buộc', trigger: 'blur' }]
  })

  /**
   * Chọn video → upload lên S3 qua presigned URL → lưu contentAssetId
   */
  const handleProcessVideoFile = async (file: any) => {
    if (!file?.raw) return
    const rawFile: File = file.raw

    if (previewVideo.value) URL.revokeObjectURL(previewVideo.value)
    previewVideo.value = URL.createObjectURL(rawFile)
    videoFileName.value = file.name
    videoFileSize.value = file.size
    modelValue.value.contentAssetId = null

    videoUploading.value = true
    videoUploadPercent.value = 0

    try {
      const assetId = await MediaApi.uploadFile(rawFile, 'VIDEO', (percent) => {
        videoUploadPercent.value = percent
      })
      modelValue.value.contentAssetId = assetId
      AlertService.success('Upload thành công', 'Video đã được tải lên và đang xử lý')
    } catch (error: any) {
      AlertService.error('Upload thất bại', error?.message || 'Có lỗi xảy ra khi upload video')
      handleRemoveVideo()
    } finally {
      videoUploading.value = false
    }
  }

  /**
   * Chọn thumbnail → upload lên S3 → lưu thumbnailAssetId
   */
  const handleProcessThumbnailFile = async (file: any) => {
    if (!file?.raw) return
    const rawFile: File = file.raw

    if (thumbnailPreview.value?.startsWith('blob:')) URL.revokeObjectURL(thumbnailPreview.value)
    thumbnailPreview.value = URL.createObjectURL(rawFile)
    modelValue.value.thumbnailAssetId = null

    thumbnailUploading.value = true
    thumbnailUploadPercent.value = 0

    try {
      const assetId = await MediaApi.uploadFile(rawFile, 'IMAGE', (percent) => {
        thumbnailUploadPercent.value = percent
      })
      modelValue.value.thumbnailAssetId = assetId
      AlertService.success('Upload thành công', 'Thumbnail đã được tải lên')
    } catch (error: any) {
      AlertService.error('Upload thất bại', error?.message || 'Có lỗi xảy ra khi upload thumbnail')
      handleRemoveThumbnail()
    } finally {
      thumbnailUploading.value = false
    }
  }

  const handleVideoLoaded = () => {
    if (videoRef.value) {
      videoDuration.value = videoRef.value.duration
      // Tự động set durationSeconds để gửi lên BE
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
    } catch { return false }
  }

  const resetFields = () => {
    formRef.value?.resetFields()
    handleRemoveVideo()
    handleRemoveThumbnail()
  }

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
    .video-details { margin-top: 12px; }
  }
  :deep(.el-upload-dragger) { padding: 20px; }
</style>