<template>
  <Ckeditor
      v-model="dataTemplateEmail.htmlContent"
      :subject="dataTemplateEmail.subject"
      :language="dataTemplateEmail.language"
      :active="dataTemplateEmail.active"
      :listTypeMail="listTypeMail"
      @changeType="changeTypeTemplateEmail"
      @save="handleSaveTemplateEmail"
  />
</template>

<script setup lang="ts">
  import { onMounted, reactive } from 'vue'
  import Ckeditor from '@/components/ckeditor/CKEditor.vue'
  import { TypeTemplateMail } from '@/type/TypeTemplateMail.ts'
  import type TemplateMailReq from '@/type/req/TemplateMailReq.ts'
  import TemplateMailApi from '@/api/TemplateMailApi.ts'
  import AlertService from '@/service/AlertService.ts'

  const dataTemplateEmail = reactive<TemplateMailReq>({
    type: '',
    active: true,
    htmlContent: '',
    language: 'vi',
    subject: ''
  })

  const listTypeMail = [
    TypeTemplateMail.WELCOME,
    TypeTemplateMail.VERIFY_ACCOUNT,
    TypeTemplateMail.TEACHER_APPLICATION,
    TypeTemplateMail.ASSIGNMENT_DEADLINE,
    TypeTemplateMail.CERTIFICATE_ISSUED,
    TypeTemplateMail.COURSE_REMINDER,
    TypeTemplateMail.PASSWORD_RESET,
    TypeTemplateMail.PAYMENT_SUCCESS,
    TypeTemplateMail.COURSE_ENROLLED,
    TypeTemplateMail.LIVE_STREAM_REMINDER
  ]

  const loadTemplateMail = async (type: string) => {

    try {

      const res =
          await TemplateMailApi.getTemplateMail(type)

      if (res.code !== 200) {
        throw new Error(res.message)
      }

      const template = res.data

      dataTemplateEmail.type = template.type
      dataTemplateEmail.subject = template.subject
      dataTemplateEmail.htmlContent = template.htmlContent
      dataTemplateEmail.language = template.language
      dataTemplateEmail.active = template.active

    } catch (error) {

      dataTemplateEmail.type = type
      dataTemplateEmail.subject = ''
      dataTemplateEmail.htmlContent = ''
      dataTemplateEmail.language = 'vi'
      dataTemplateEmail.active = true

    }

  }

  const changeTypeTemplateEmail = async (value: string) => {

    await loadTemplateMail(value)

  }
  const handleSaveTemplateEmail = async (payload: TemplateMailReq) => {

    try {

      Object.assign(dataTemplateEmail, payload)

      const res = await TemplateMailApi.saveTemplateMail(
          dataTemplateEmail
      )

      if (res.code !== 200) {
        throw new Error(res.message)
      }

      AlertService.success(
          'Success',
          'Lưu template thành công!'
      )

    } catch (error) {

      AlertService.error(
          'Error',
          'Lưu template không thành công!'
      )

    }
  }

  onMounted(async () => {

    await loadTemplateMail(
        TypeTemplateMail.VERIFY_ACCOUNT
    )

  })
</script>