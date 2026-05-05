<template>
  <div class="data-table">
    <div class="data-table__wrapper">
      <el-table
          v-if="data"
          v-loading="loading"
          :height="tableHeight"
          :data="data"
          ref="tableRef"
          @sort-change="handleSortChange"
          empty-text="Không có dữ liệu"
          class="no-wrap-table"
          style="width: 100%">
        <slot></slot>
      </el-table>
    </div>

    <div style="display: flex;align-items: center;justify-content: center;margin-top: 16px">
      <el-pagination
          :page-size="request.size"
          :page-count="totalPage"
          @change="changePage"
          layout="prev, pager, next"
          :total="totalElement"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
  import AlertService from '@/service/AlertService.ts'
  import type { RequestParam } from '@/type/RequestParam.ts'

  const data = ref<any>([])
  const totalElement = ref<number>(0)
  const totalPage = ref<number>(0)
  const loading = ref<boolean>(false)
  const windowHeight = ref(window.innerHeight)
  const emit = defineEmits(['reload'])

  const request = reactive<RequestParam>({
    page: 1,
    size: 10,
    keyword: '',
    sort: null
  })

  const props = defineProps({
    getDataFunction: {
      type: Function,
      require: true
    },
    rowClassName: {
      type: Function,
      require: false
    },
    isShowPagination: {
      type: Boolean,
      required: false,
      default: true
    }
  })

  // Lắng nghe resize để tính lại chiều cao
  const handleResize = () => {
    windowHeight.value = window.innerHeight
  }
  onMounted(() => window.addEventListener('resize', handleResize))
  onUnmounted(() => window.removeEventListener('resize', handleResize))

  // Chiều cao table = chiều cao màn hình trừ header admin + toolbar + pagination
  const tableHeight = computed(() => {
    return windowHeight.value - 260
  })

  const getData = async () => {
    loading.value = true
    const res = await props?.getDataFunction(request)
    if (res.code === 200) {
      data.value = res.data.list
      updatePageRequest(res.data)
    } else {
      AlertService.error('Error', '')
    }
    loading.value = false
  }

  const reload = async (request: RequestParam) => {
    loading.value = true
    const res = await props?.getDataFunction(request)
    if (res.code === 200) {
      data.value = res.data.list
      updatePageRequest(res.data)
    } else {
      AlertService.error('Error', res.message)
    }
    loading.value = false
  }

  const changePage = async (currentPage: number, prevPage: number) => {
    if (currentPage !== prevPage) {
      request.page = currentPage
      await reload(request)
    }
  }

  const updatePageRequest = (data: any) => {
    request.page = data.page
    request.size = data.size
    totalElement.value = data.totalElements
    totalPage.value = data.totalPages
  }

  const handleSortChange = (value: any) => {
    request.sort = `${value.prop}:${value.order === 'ascending' ? 'ASC' : 'DESC'}`
    emit('reload', request)
  }

  onMounted(async () => {
    await getData()
  })

  defineExpose({ getData, reload, request })
</script>

<style lang="scss" scoped>
  .data-table {
    display: flex;
    flex-direction: column;
    height: 100%;

    &__wrapper {
      flex: 1;
      overflow-x: auto; // scroll ngang khi nhiều cột

      // Thanh scroll ngang đẹp hơn
      &::-webkit-scrollbar {
        height: 6px;
      }

      &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
      }

      &::-webkit-scrollbar-thumb {
        background: #c0c4cc;
        border-radius: 3px;

        &:hover {
          background: #909399;
        }
      }
    }
  }

  .no-wrap-table ::v-deep(.cell) {
    white-space: nowrap;
  }

  .no-wrap-table {
    width: max-content; // key chính
    min-width: 100%;
  }
</style>