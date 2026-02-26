<template>
  <el-form
      ref="formRef"
      :model="modelValue"
      :rules="rules">
    <el-form-item label-position="top" label="Tiêu đề" prop="title">
      <el-input v-model="modelValue.title" />
    </el-form-item>
    <el-form-item label-position="top" label="Bai giang" prop="lectureId">
      <el-input v-model="props.lectureId" />
    </el-form-item>
    <el-form-item label-position="top" label="Tối đa số lần thi" prop="maxAttempt">
      <el-input-number v-model="modelValue.maxAttempt" />
    </el-form-item>
    <el-form-item label-position="top" label="Mô tả" prop="desc">
      <el-input type="textarea" v-model="modelValue.desc" />
    </el-form-item>
  </el-form>
</template>


<script setup lang="ts">

  import { reactive, ref, watchEffect } from 'vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import type { QuizReq } from '@/type/req/QuizReq.ts'

  const formRef = ref<FormInstance>()
  const modelValue = defineModel<QuizReq>({ required: true })
  const props = defineProps<{
    lectureId: string
  }>()

  const rules = reactive<FormRules>({
    title: [
      { required: true, message: 'Trường này băt buộc', trigger: 'blur' }
    ],
    maxAttempt: [
      { min: 5, message: 'Trường này băt buộc', trigger: 'blur' }
    ]
  })


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
  }

  defineExpose({
    resetFields, validate
  })

  watchEffect(() => {
    console.log(modelValue.value.lectureId)
  })

</script>

<style scoped lang="scss">

</style>