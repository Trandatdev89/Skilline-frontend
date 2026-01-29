<template>
  <div class="data-table">
    <el-table v-if="data"
              :max-height="tableMaxHeight"
              :data="data"
              ref="tableRef"
              @sort-change="handleSortChange"
              empty-text="Data Empty">
      <slot></slot>
    </el-table>

    <div style="display: flex;align-items: center;justify-content: center;margin-top: 20px">
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


  import { computed, onMounted, reactive, ref } from 'vue'
  import AlertService from '@/service/AlertService.ts'
  import type { RequestParam } from '@/type/RequestParam.ts'

  const data = ref<any>([])
  const totalElement = ref<number>(0)
  const totalPage = ref<number>(0)
  const loading = ref<boolean>(false)
  const emit = defineEmits(['reload']);
  const request = reactive<RequestParam>({
    page:1,
    size:10,
    keyword:'',
    sort:null
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

  const tableMaxHeight = computed(() => {
    return window.innerHeight - 220
  })

  const getData = async () => {
    loading.value = true
    const res = await props?.getDataFunction(request);
    if (res.code === 200) {
      data.value = res.data.list
      updatePageRequest(res.data)
    } else {
      AlertService.error('Error', '')
    }
    loading.value = false
  }

  const reload = async (request:RequestParam) => {
    loading.value = true
    const res = await props?.getDataFunction(request)
    if (res.code === 200) {
      data.value = res.data.list

      updatePageRequest(res.data)
      loading.value = false
    } else {
      AlertService.error('Error', res.message)
      loading.value = false
    }
  }

  const changePage = async (currentPage:number, prevPage:number)=>{
      if(currentPage!==prevPage){
        request.page = currentPage;
        await reload(request);
      }
  }

  const updatePageRequest = (data: any) => {
    request.page = data.page
    request.size = data.size
    totalElement.value = data.totalElements
    totalPage.value = data.totalPages
  }

  const handleSortChange = (value:any)=>{
    request.sort = `${value.prop}:${value.order === "ascending" ? 'ASC' : 'DESC'}`;
    emit('reload',request);
  }

  onMounted(async () => {
    await getData()
  })

  defineExpose({ getData,reload,request})

</script>

<style lang="scss" scoped>

</style>