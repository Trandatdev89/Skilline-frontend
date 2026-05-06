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
      <el-input-number v-model="modelValue.maxAttempt" :min="1" />
    </el-form-item>
    <el-row :gutter="16">
      <el-col :span="12">
        <el-form-item label-position="top" label="Thời gian thi" prop="timeLimit">
          <el-input-number v-model="modelValue.timeLimit" :min="1" style="width: 100%" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label-position="top" label="Đơn vị thời gian" prop="timeUnit">
          <el-select v-model="modelValue.timeUnit" style="width: 100%">
            <el-option value="MINUTE" label="Phút" />
            <el-option value="HOURS" label="Giờ" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
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