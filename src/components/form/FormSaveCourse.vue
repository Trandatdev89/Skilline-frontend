<template>
  <el-form
      ref="formRef"
      :model="modelValue"
      :rules="rules">
    <el-form-item label-position="top" label="Tiêu đề" prop="title">
      <el-input v-model="modelValue.title" />
    </el-form-item>
    <el-form-item label-position="top" label="Cấp độ" prop="level">
      <el-select v-model="modelValue.level">
        <el-option :value="LevelStudent.BEGINNER" :label="LevelStudent.BEGINNER" />
        <el-option :value="LevelStudent.ADVANCE" :label="LevelStudent.ADVANCE" />
      </el-select>
    </el-form-item>
    <el-form-item label-position="top" label="Giá" prop="price">
      <el-input-number v-model="modelValue.price" />
    </el-form-item>
    <el-form-item label-position="top" label="Giảm giá" prop="discount">
      <el-input-number v-model="modelValue.discount" />
    </el-form-item>
    <el-form-item label-position="top" label="Đánh giá" prop="rate">
      <el-input-number v-model="modelValue.rate" />
    </el-form-item>
    <el-form-item label-position="top" label="Danh mục" prop="categoryId">
      <el-select v-model="modelValue.categoryId" multiple-limit="1" @visible-change="handleVisibleChange">
        <el-option v-for="item in listCategory" :key="item.id" :value="item.id" :label="item.name">
          {{ item.name }}
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label-position="top" label="Mô tả" prop="desc">
      <el-input type="textarea" v-model="modelValue.desc" />
    </el-form-item>

    <!-- Upload ảnh khoá học -->
    <el-form-item label-position="top" label="Ảnh khóa học">
      <el-upload
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

    <!-- Progress bar khi upload -->
    <el-progress
        v-if="uploading"
        :percentage="uploadPercent"
        :stroke-width="6"
        style="margin-bottom: 12px" />
  </el-form>

  <!-- Preview ảnh -->
  <div style="position: relative; width: 100px; height: 100px" v-if="imgPreview">
    <span
        style="position: absolute; color: red; font-size: 25px; cursor: pointer; top: -18px; right: -8px"
        @click="handleRemoveFile">X</span>
    <img :src="imgPreview" alt="thumbnail" style="width: 100%; height: 100%; object-fit: cover" />
  </div>
</template>

<script setup lang="ts">
  import LevelStudent from '@/enums/LevelStudent.ts'
  import { nextTick, onMounted, reactive, ref, watch } from 'vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import useCategory from '@/composable/useCategory.ts'
  import type { CourseReq } from '@/type/req/CourseReq.ts'
  import MediaApi from '@/api/MediaApi.ts'
  import AlertService from '@/service/AlertService.ts'

  const imgPreview = ref<string>('')
  const uploading = ref(false)
  const uploadPercent = ref(0)

  const { listCategory, getListCategory } = useCategory()
  const formRef = ref<FormInstance>()
  const selectDropdown = ref<HTMLElement | null>(null)
  const modelValue = defineModel<CourseReq>({ required: true })

  const validationPrice = (rule: any, value: any, callback: any) => {
    if (value < 0) {
      callback(new Error('Giá giảm không được nhỏ hơn 0'))
    } else {
      callback()
    }
  }

  const rules = reactive<FormRules>({
    title: [{ required: true, message: 'Trường này bắt buộc', trigger: 'blur' }],
    level: [{ required: true, message: 'Trường này bắt buộc', trigger: 'blur' }],
    price: [
      { required: true, message: 'Trường này bắt buộc', trigger: 'blur' },
      { validator: validationPrice, trigger: 'blur' }
    ]
  })

  /**
   * Khi người dùng chọn file ảnh:
   * 1. Preview ngay bằng ObjectURL
   * 2. Upload lên S3 qua presigned URL
   * 3. Lưu assetId vào modelValue để gửi lên server khi save course
   */
  const handleProcessFile = async (file: any) => {
    if (!file?.raw) return

    const rawFile: File = file.raw

    // Preview ngay lập tức
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
    }
  }

  const handleRemoveFile = () => {
    if (imgPreview.value?.startsWith('blob:')) {
      URL.revokeObjectURL(imgPreview.value)
    }
    imgPreview.value = ''
    modelValue.value.thumbnailFile = null
    modelValue.value.assetId = null
    modelValue.value.thumbnailPreviewUrl = null
  }

  const handleScroll = async (e: Event) => {
    const ev = e.target as HTMLElement
    if (ev.scrollTop + ev.clientHeight >= ev.scrollHeight - 20) {
      await getListCategory()
    }
  }

  const handleVisibleChange = async (visible: boolean) => {
    if (visible) {
      await nextTick()
      const dropdown = document.querySelector('.el-select-dropdown__wrap')
      if (dropdown) {
        selectDropdown.value = dropdown as HTMLElement
        dropdown.addEventListener('scroll', handleScroll, { passive: true })
      }
    } else {
      if (selectDropdown.value) {
        selectDropdown.value.removeEventListener('scroll', handleScroll)
      }
    }
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

  // Khi edit course: hiện ảnh cũ từ server (thumbnailPreviewUrl)
  watch(
      () => modelValue.value.thumbnailPreviewUrl,
      (url) => {
        if (url) {
          imgPreview.value = url
        }
      },
      { immediate: true }
  )

  onMounted(async () => {
    await getListCategory()
  })

  defineExpose({ resetFields, validate })
</script>

<style scoped lang="scss"></style>