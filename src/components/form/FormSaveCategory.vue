<template>
  <el-form
      ref="formRef"
      :model="modelValue"
      :rules="rules">
    <el-form-item label-position="top" label="Tiêu đề danh mục" prop="title">
      <el-input v-model="modelValue.title" />
    </el-form-item>
    <el-form-item label-position="top" label="Ảnh danh mục">
      <el-upload
          :limit="1"
          :auto-upload="false"
          :show-file-list="false"
          accept="image/*"
          @change="handleProcessFile">
        <el-button :icon="Upload" :loading="uploading">
          {{ uploading ? `Đang upload... ${uploadPercent}%` : 'Chọn ảnh' }}
        </el-button>
      </el-upload>
    </el-form-item>

    <!-- Progress bar -->
    <el-progress
        v-if="uploading"
        :percentage="uploadPercent"
        :stroke-width="6"
        style="margin-bottom: 12px" />
  </el-form>

  <!-- Preview ảnh -->
  <div style="position: relative; width: 100px; height: 100px" v-if="imgUpload">
    <span
        style="position: absolute; color: red; font-size: 25px; cursor: pointer; top: -18px; right: -8px"
        @click="handleRemoveFile">X</span>
    <img :src="imgUpload" alt="category image" style="width: 100%; height: 100%; object-fit: cover" />
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref, watch } from 'vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import { Upload } from '@element-plus/icons-vue'
  import MediaApi from '@/api/MediaApi.ts'
  import AlertService from '@/service/AlertService.ts'

  const imgUpload = ref<string>('')
  const uploading = ref(false)
  const uploadPercent = ref(0)

  const formRef = ref<FormInstance>()
  const rules = reactive<FormRules>({
    title: [{ required: true, message: 'Trường này bắt buộc', trigger: 'blur' }]
  })

  const modelValue = defineModel<{
    id: number | null
    title: string
    assetId: string | null
    imgPreviewUrl: string | null
  }>({ required: true })

  /**
   * Khi người dùng chọn ảnh:
   * 1. Preview ngay
   * 2. Upload lên S3 qua presigned URL
   * 3. Lưu assetId vào modelValue
   */
  const handleProcessFile = async (file: any) => {
    if (!file?.raw) return

    const rawFile: File = file.raw

    // Preview ngay
    if (imgUpload.value?.startsWith('blob:')) URL.revokeObjectURL(imgUpload.value)
    imgUpload.value = URL.createObjectURL(rawFile)
    modelValue.value.assetId = null

    uploading.value = true
    uploadPercent.value = 0

    try {
      const assetId = await MediaApi.uploadFile(rawFile, 'IMAGE', (percent) => {
        uploadPercent.value = percent
      })
      modelValue.value.assetId = assetId
      AlertService.success('Upload thành công', 'Ảnh đã được tải lên')
    } catch (error: any) {
      AlertService.error('Upload thất bại', error?.message || 'Có lỗi xảy ra khi upload ảnh')
      handleRemoveFile()
    } finally {
      uploading.value = false
    }
  }

  const handleRemoveFile = () => {
    if (imgUpload.value?.startsWith('blob:')) URL.revokeObjectURL(imgUpload.value)
    imgUpload.value = ''
    modelValue.value.assetId = null
    modelValue.value.imgPreviewUrl = null
  }

  const validate = async (): Promise<boolean> => {
    if (!formRef.value) return false
    try {
      await formRef.value.validate()
      return true
    } catch (error) {
      return false
    }
  }

  const resetFields = () => {
    formRef.value?.resetFields()
    handleRemoveFile()
  }

  // Khi edit: hiện ảnh cũ từ server
  watch(
      () => modelValue.value.imgPreviewUrl,
      (url) => {
        if (url) imgUpload.value = url
      },
      { immediate: true }
  )

  defineExpose({ validate, resetFields })
</script>

<style scoped lang="scss"></style>