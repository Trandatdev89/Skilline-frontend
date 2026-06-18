<template>
  <div class="mail-config">

    <div class="mail-config__header">

      <input
          v-model="subject"
          class="mail-input"
          placeholder="Nhập tiêu đề email"
      >

      <select
          v-model="language"
          class="mail-select"
      >
        <option value="vi">Tiếng Việt</option>
        <option value="en">English</option>
      </select>

      <label class="mail-active">
        <input
            v-model="active"
            type="checkbox"
        >
        Active
      </label>

    </div>

    <div class="ckeditor-wrapper">
      <div ref="editorEl"></div>
    </div>

  </div>
</template>

<script setup lang="ts">
  import { onMounted, onBeforeUnmount, ref, watch } from 'vue'

  import {
    ClassicEditor,
    Bold,
    Italic,
    Underline,
    Heading,
    Paragraph,
    Link,
    List,
    ListProperties,
    Table,
    TableToolbar,
    Image,
    ImageToolbar,
    ImageUpload,
    ImageResize,
    MediaEmbed,
    Essentials
  } from 'ckeditor5'

  import 'ckeditor5/ckeditor5.css'

  import { Base64UploadAdapterPlugin } from '@/components/ckeditor/plugins/Base64UploadAdapterPlugin.ts'
  import MyButtonPlugin from '@/components/ckeditor/plugins/MyButtonPlugin.ts'
  import MyDropDownPlugin from '@/components/ckeditor/plugins/MyDropdownPlugin.ts'

  const props = defineProps<{
    modelValue: string
    subject?: string
    language?: string
    active?: boolean
    readonly?: boolean
    listTypeMail?: any[]
    listNotification?: any[]
  }>()

  const emit = defineEmits([
    'update:modelValue',
    'save',
    'changeType'
  ])

  const editorEl = ref<HTMLElement | null>(null)

  const subject = ref(props.subject || '')
  const language = ref(props.language || 'vi')
  const active = ref(props.active ?? true)

  const selectedType = ref('')

  let editorInstance: any = null

  onMounted(async () => {

    editorInstance = await ClassicEditor.create(editorEl.value!, {
      licenseKey: 'GPL',
      initialData: props.modelValue || '',
      myDropdown: {
        listType: props.listTypeMail || props.listNotification
      },
      plugins: [
        Essentials,
        Paragraph,
        Bold,
        Italic,
        Underline,
        Heading,
        Link,
        List,
        ListProperties,
        Table,
        TableToolbar,
        Image,
        ImageToolbar,
        ImageUpload,
        ImageResize,
        MediaEmbed,
        MyButtonPlugin,
        MyDropDownPlugin
      ],
      extraPlugins: [Base64UploadAdapterPlugin],
      toolbar: [
        'heading',
        '|',
        'bold',
        'italic',
        'underline',
        'link',
        '|',
        'bulletedList',
        'numberedList',
        '|',
        'insertTable',
        'imageUpload',
        'mediaEmbed',
        '|',
        'undo',
        'redo',
        '|',
        'myButton',
        '|',
        'myDropdown'
      ]
    })

    editorInstance.model.document.on('change:data', () => {
      emit('update:modelValue', editorInstance.getData())
    })

    editorInstance.on('myButton:save', () => {

      emit('save', {
        subject: subject.value,
        htmlContent: editorInstance.getData(),
        type: selectedType.value,
        language: language.value,
        active: active.value
      })

    })

    editorInstance.on('myDropdown:changeType', (evt: any, payload: string) => {

      selectedType.value = payload

      emit('changeType', payload)

    })

    if (props.readonly) {
      editorInstance.enableReadOnlyMode('readonly')
    }

  })

  watch(
      () => props.modelValue,
      (value) => {
        if (editorInstance && value !== editorInstance.getData()) {
          editorInstance.setData(value || '')
        }
      }
  )

  watch(
      () => props.subject,
      value => {
        subject.value = value || ''
      }
  )

  watch(
      () => props.language,
      value => {
        language.value = value || 'vi'
      }
  )

  watch(
      () => props.active,
      value => {
        active.value = value ?? true
      }
  )

  onBeforeUnmount(() => {
    editorInstance?.destroy()
  })
</script>

<style scoped>

  .mail-config__header{
    display:flex;
    gap:12px;
    margin-bottom:16px;
  }

  .mail-input{
    flex:1;
  }

  .mail-select{
    width:120px;
  }

  .ckeditor-wrapper :deep(.ck-editor__editable){
    min-height:300px;
  }

</style>