<template>
  <div class="category">
    <div class="category__add" style="float: right;margin:25px 0">
      <el-button @click="handleShowCreateCate" :icon="CirclePlus">
        Thêm danh mục
      </el-button>
    </div>
    <div class="category__table">
      <DataTable
          ref="dataTable"
          :get-data-function="getListCategory"
          @reload="handleReloadData"
      >
        <el-table-column prop="id" label="ID" sortable />
        <el-table-column prop="name" label="Tên danh mục" sortable />
        <el-table-column prop="isActive" label="Trạng thái">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.isActive">Tồn tại</el-tag>
            <el-tag type="danger" v-else>Đã xóa</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="Ảnh">
          <template #default="scope">
            <img :src="scope.row.urlThumbnail" alt="image..." style="width: 50px;height: 50px" />
          </template>
        </el-table-column>
        <el-table-column prop="action" label="Hanh dong">
          <template #default="scope">
            <el-button @click="updateCategory(scope.row)">
              <el-icon>
                <RefreshLeft />
              </el-icon>
            </el-button>
          </template>
        </el-table-column>
      </DataTable>
    </div>
  </div>
  <CreateDialog ref="createDialog"
                v-loading="loading"
                :title="'Tạo mới danh mục'"
                :text-btn-ok="'Lưu'"
                :width-dialog="500"
                :heightDialog="400"
                :type-action="TypeAction.CREATE"
                @cancel="resetData"
                @create="handleCreateCate">
    <FormSaveCategory ref="createCateForm"
                      v-model="category" />
  </CreateDialog>
</template>

<script setup lang="ts">
  import { reactive, ref, watch } from 'vue'
  import DataTable from '@/components/datatable/DataTable.vue'
  import CreateDialog from '@/components/dialog/common/CreateDialog.vue'
  import type { FormInstance } from 'element-plus'
  import AlertService from '@/service/AlertService.ts'
  import CategoryApi from '@/api/CategoryApi.ts'
  import { RefreshLeft,CirclePlus} from '@element-plus/icons-vue'
  import { useRoute } from 'vue-router'
  import type { RequestParam } from '@/type/RequestParam.ts'
  import FormSaveCategory from '@/components/form/FormSaveCategory.vue'
  import { TypeAction } from '@/enums/TypeAction.ts'

  const route = useRoute()
  const dataTable = ref()
  const createDialog = ref()
  const createCateForm = ref<FormInstance>()
  const loading = ref(false)
  const isEdit = ref(false)


  const category = reactive({
    id: null,
    title: '',
    path: null as File | string | null,
    imgPreview:null
  })

  const updateCategory = (row: any) => {
    isEdit.value = true
    category.id = row.id
    category.title = row.name
    category.path = row.urlThumbnail
    createDialog.value?.show();
  }

  function handleShowCreateCate() {
    createDialog.value?.show()
  }

  const handleCreateCate = async () => {
    const isValid = await createCateForm.value?.validate()

    if (!isValid) {
      return
    }

    loading.value = true

    try {
      const formData = new FormData()
      if (category.id) {
        formData.append('id', category.id)
      }
      if (category.path && category.path instanceof File) {
        formData.append('path', category.path)
      }
      formData.append('name', category.title)

      const res = await CategoryApi.save(formData)

      if (res.code !== 200) {
        throw new Error(res.message)
      }

      resetData();
      createCateForm.value?.resetFields()
      dataTable.value?.reload(dataTable.value?.request);
      createDialog.value?.hide()

      AlertService.success('Success', isEdit.value ? 'Cập nhật danh mục thành công!' : 'Thêm danh mục thành công!')
    } catch (error: any) {
      AlertService.error('Error', error)
    } finally {
      loading.value = false
    }
  }

  const resetData = () => {
    isEdit.value = false
    category.id = null
    category.path = null
    category.title = ''
  }

  const getListCategory = async (params: any) => {
    return await CategoryApi.getListCategoryPagination(params)
  }

  watch(() => route.query.keyword, (newKeyword) => {
    if (newKeyword !== undefined) {
      dataTable.value?.reload({
        page: 1,
        size: 10,
        keyword: newKeyword as string
      })
    }
  }, { immediate: true })

  const handleReloadData = (request: RequestParam) => {
    dataTable.value?.reload(request)
  }

</script>


<style scoped lang="scss">

</style>

