<template>
  <el-dialog v-model="visibilityModel"
             :width="widthDialog"
             top="4vh"
             style="position: relative;overflow-y: auto"
             class="common-dialog"
             :style="{ maxHeight: `${heightDialog}px`}"
             @close="hide"
  >
    <template #header>
         <span>
           {{ title }}
         </span>
    </template>
    <div class="dialog-main">
      <slot></slot>
    </div>
    <template #footer>
      <el-button @click="hide">Cancel</el-button>
      <el-button @click="handleAction">{{ textBtnOk }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { TypeAction } from '@/enums/TypeAction.ts'

  const visibilityModel = ref(false)

  const emit = defineEmits(['create', 'update', 'delete', 'read','cancel'])

  const props = defineProps({
    title: {
      type: String,
      required: true,
      default: 'Tạo mới'
    },
    textBtnOk: {
      type: String,
      required: true,
      default: 'Ok'
    },
    typeAction: {
      type: TypeAction,
      required: false
    },
    widthDialog: {
      type: Number,
      required: false,
      default: 800
    },
    heightDialog: {
      type: Number,
      required: false,
      default: 650
    }
  })

  const handleAction = () => {
    switch (props.typeAction) {
      case TypeAction.CREATE:
        return emit('create')
      case TypeAction.UPDATE:
        return emit('update')
      case TypeAction.DELETE:
        return emit('delete')
      case TypeAction.READ:
        return emit('read')
    }
  }

  const hide = () => {
    emit('cancel');
    visibilityModel.value = false
  }

  const show = () => {
    visibilityModel.value = true
  }

  defineExpose({ show, hide })
</script>

<style scoped lang="scss">

</style>