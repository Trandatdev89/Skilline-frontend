<template>
  <el-form ref="formRef" :model="modelValue" :rules="rules" label-position="top">
    <el-form-item label="Tiêu đề" prop="title">
      <el-input v-model="modelValue.title" />
    </el-form-item>

    <el-form-item label="Cấp độ" prop="level">
      <el-select v-model="modelValue.level" style="width: 100%">
        <el-option :value="LevelStudent.BEGINNER" label="Người mới (Beginner)" />
        <el-option :value="LevelStudent.ADVANCE" label="Nâng cao (Advance)" />
        <el-option :value="LevelStudent.MASTER" label="Chuyên gia (Master)" />
      </el-select>
    </el-form-item>

    <el-form-item label="Trạng thái xuất bản" prop="publishStatus">
      <el-select v-model="modelValue.publishStatus" style="width: 100%">
        <el-option value="DRAFT" label="Bản nháp" />
        <el-option value="PUBLISHER" label="Đã xuất bản" />
        <el-option value="ARCHIVED" label="Lưu trữ" />
      </el-select>
    </el-form-item>

    <el-row :gutter="16">
      <el-col :span="12">
        <el-form-item label="Giá gốc (VND)" prop="price">
          <el-input-number v-model="modelValue.price" :min="0" style="width: 100%" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="Giảm giá (%)" prop="discount">
          <el-input-number v-model="modelValue.discount" :min="0" :max="100" style="width: 100%" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :span="12">
        <el-form-item label="Thời hạn truy cập" prop="accessDurationValue">
          <el-input-number v-model="modelValue.accessDurationValue" :min="1" style="width: 100%" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="Đơn vị thời gian" prop="accessDurationUnit">
          <el-select v-model="modelValue.accessDurationUnit" style="width: 100%">
            <el-option value="MINUTE" label="Phút" />
            <el-option value="HOURS" label="Giờ" />
            <el-option value="DAY" label="Ngày" />
            <el-option value="WEEK" label="Tuần" />
            <el-option value="MONTH" label="Tháng" />
            <el-option value="YEAR" label="Năm" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="Đánh giá" prop="rate">
      <el-rate v-model="modelValue.rate" :max="5" allow-half show-score />
    </el-form-item>

    <el-form-item label="Mô tả" prop="desc">
      <el-input type="textarea" :rows="4" v-model="modelValue.desc" />
    </el-form-item>

    <!-- Upload ảnh khoá học -->
    <el-form-item label="Ảnh khóa học">
      <el-upload
          ref="inputUpload"
          :limit="1"
          :auto-upload="false"
          :show-file-list="false"
          accept="image/*"
          @change="handleProcessFile">
        <el-button type="primary" :loading="uploading">
          {{ uploading ? `Đang upload... ${uploadPercent}%` : 'Chọn ảnh' }}
        </el-button>
      </el-upload>
    </el-form-item>

    <el-progress v-if="uploading" :percentage="uploadPercent" :stroke-width="6" style="margin-bottom: 12px" />
  </el-form>

  <!-- Preview ảnh -->
  <div style="position: relative; width: 100px; height: 100px; margin-top: 8px" v-if="imgPreview">
    <span
        style="position: absolute; color: red; font-size: 20px; cursor: pointer; top: -14px; right: -8px; z-index:1"
        @click="handleRemoveFile">✕</span>
    <img :src="imgPreview" alt="thumbnail" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px" />
  </div>
</template>

<script setup lang="ts">
  import LevelStudent from '@/enums/LevelStudent.ts'
  import { reactive, ref, watch } from 'vue'
  import type { FormInstance, FormRules, UploadInstance } from 'element-plus'
  import type { CourseReq } from '@/type/req/CourseReq.ts'
  import MediaApi from '@/api/MediaApi.ts'
  import AlertService from '@/service/AlertService.ts'

  const imgPreview = ref<string>('')
  const uploading = ref(false)
  const uploadPercent = ref(0)

  const formRef = ref<FormInstance>()
  const inputUpload = ref<UploadInstance>()
  const modelValue = defineModel<CourseReq>({ required: true })

  const rules = reactive<FormRules>({
    title: [{ required: true, message: 'Trường này bắt buộc', trigger: 'blur' }],
    level: [{ required: true, message: 'Trường này bắt buộc', trigger: 'change' }],
    publishStatus: [{ required: true, message: 'Trường này bắt buộc', trigger: 'change' }],
    categoryId: [{ required: true, message: 'Trường này bắt buộc', trigger: 'change' }],
    price: [{ required: true, message: 'Trường này bắt buộc', trigger: 'blur' }]
  })

  const handleProcessFile = async (file: any) => {
    if (!file?.raw) return
    const rawFile: File = file.raw

    imgPreview.value = URL.createObjectURL(rawFile)
    modelValue.value.thumbnailFile = rawFile
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
      inputUpload.value?.clearFiles()
    }
  }

  const handleRemoveFile = () => {
    if (imgPreview.value?.startsWith('blob:')) URL.revokeObjectURL(imgPreview.value)
    imgPreview.value = ''
    modelValue.value.thumbnailFile = null
    modelValue.value.assetId = null
    modelValue.value.thumbnailPreviewUrl = null
    inputUpload.value?.clearFiles()
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
    handleRemoveFile()
  }

  watch(
      () => modelValue.value.thumbnailPreviewUrl,
      (url) => {
        if (url && !imgPreview.value.startsWith('blob:')) {
          imgPreview.value = url
        }
        if (!url && !imgPreview.value.startsWith('blob:')) {
          imgPreview.value = ''
        }
      },
      { immediate: true, deep: true }
  )

  defineExpose({ resetFields, validate })
</script>

<style scoped lang="scss"></style>