<template>
  <el-form
      ref="formRef"
      :model="modelValue"
      :rules="rules">
    <el-form-item label-position="top" label="Tiêu đề danh mục" prop="title">
      <el-input v-model="modelValue.title" />
    </el-form-item>
    <el-form-item
        label-position="top"
        label="Ảnh danh mục">

      <el-upload
          ref="inputUpload"
          :limit="1"
          :auto-upload="false"
          :show-file-list="false"
          accept="image/*"
          @change="handleProcessFile">

        <el-button :icon="Upload">
          Chọn ảnh
        </el-button>

      </el-upload>

    </el-form-item>
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
  import { ref, reactive, watch } from 'vue'
  import type {
    FormInstance,
    FormRules,
    UploadInstance
  } from 'element-plus'

  import { Upload } from '@element-plus/icons-vue'

  const imgUpload = ref('')

  const inputUpload = ref<UploadInstance>()

  const formRef = ref<FormInstance>()

  const rules = reactive<FormRules>({
    title: [
      {
        required: true,
        message: 'Trường này bắt buộc',
        trigger: 'blur'
      }
    ]
  })

  const modelValue = defineModel<{
    id: number | null
    title: string
    file: File | null
    imgPreviewUrl: string | null
  }>({
    required: true
  })

  const handleProcessFile = (file: any) => {

    if (!file?.raw) {
      return
    }

    const rawFile: File = file.raw

    if (imgUpload.value?.startsWith('blob:')) {
      URL.revokeObjectURL(imgUpload.value)
    }

    imgUpload.value = URL.createObjectURL(rawFile)

    modelValue.value.file = rawFile
  }

  const handleRemoveFile = () => {

    if (imgUpload.value?.startsWith('blob:')) {
      URL.revokeObjectURL(imgUpload.value)
    }

    imgUpload.value = ''

    modelValue.value.file = null
    modelValue.value.imgPreviewUrl = null

    inputUpload.value?.clearFiles()
  }

  const validate = async (): Promise<boolean> => {

    if (!formRef.value) {
      return false
    }

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
      () => modelValue.value.imgPreviewUrl,
      (url) => {

        if (url && !imgUpload.value.startsWith('blob:')) {
          imgUpload.value = url
        }

        if (!url && !imgUpload.value.startsWith('blob:')) {
          imgUpload.value = ''
        }
      },
      {
        immediate: true
      }
  )

  defineExpose({
    validate,
    resetFields
  })
</script>

<style scoped lang="scss"></style>