<template>
  <div class="category">
    <div class="category__add" style="display:flex;align-items:center;justify-content:space-between;margin:25px 0">
      <el-button
          v-if="selectedIds.length > 0"
          type="danger"
          :icon="Delete"
          :loading="deleteLoading"
          @click="handleDeleteSelected">
        Xóa {{ selectedIds.length }} mục
      </el-button>
      <div v-else />
      <el-button @click="handleShowCreateCate" :icon="CirclePlus">Thêm danh mục</el-button>
    </div>
    <div class="category__table">
      <DataTable ref="dataTable" :get-data-function="getListCategory" @reload="handleReloadData"
                 @selection-change="(rows: any[]) => selectedIds = rows.map(r => r.id)">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="id" label="ID" sortable width="80" />
        <el-table-column prop="name" label="Tên danh mục" sortable />
        <el-table-column prop="active" label="Trạng thái" width="120">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.active">Tồn tại</el-tag>
            <el-tag type="danger" v-else>Đã xóa</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Ảnh" width="80">
          <template #default="scope">
            <el-image
                v-if="scope.row.urlThumbnail"
                style="width:50px;height:50px"
                :src="scope.row.urlThumbnail"
                fit="cover">
              <template #error>
                <div style="display:flex;align-items:center;justify-content:center;height:100%">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <span v-else>—</span>
          </template>
        </el-table-column>
        <el-table-column label="Hành động" fixed="right" width="100">
          <template #default="scope">
            <el-button @click="updateCategory(scope.row)" :icon="EditPen" circle size="small" />
            <el-button type="danger" @click="handleDeleteOne(scope.row.id)" :icon="Delete" circle size="small" />
          </template>
        </el-table-column>
      </DataTable>
    </div>
  </div>

  <CreateDialog
      ref="createDialog"
      v-loading="loading"
      :title="isEdit ? 'Cập nhật danh mục' : 'Tạo mới danh mục'"
      :text-btn-ok="'Lưu'"
      :width-dialog="500"
      :type-action="TypeAction.CREATE"
      @cancel="resetData"
      @create="handleCreateCate">
    <FormSaveCategory ref="createCateForm" v-model="category" />
  </CreateDialog>
</template>

<script setup lang="ts">
  import { reactive, ref, watch } from 'vue'
  import DataTable from '@/components/datatable/DataTable.vue'
  import CreateDialog from '@/components/dialog/common/CreateDialog.vue'
  import AlertService from '@/service/AlertService.ts'
  import CategoryApi from '@/api/CategoryApi.ts'
  import { RefreshLeft, CirclePlus, Delete, EditPen, Picture } from '@element-plus/icons-vue'
  import { useRoute } from 'vue-router'
  import type { RequestParam } from '@/type/RequestParam.ts'
  import FormSaveCategory from '@/components/form/FormSaveCategory.vue'
  import { TypeAction } from '@/enums/TypeAction.ts'
  import { ElMessageBox } from 'element-plus'

  const route = useRoute()
  const dataTable = ref()
  const createDialog = ref()
  const createCateForm = ref()
  const loading = ref(false)
  const deleteLoading = ref(false)
  const isEdit = ref(false)
  const selectedIds = ref<number[]>([])

  const category = reactive({
    id: null as number | null,
    title: '',
    assetId: null as string | null,
    imgPreviewUrl: null as string | null
  })

  const updateCategory = (row: any) => {
    isEdit.value = true
    category.id = row.id
    category.title = row.name
    category.imgPreviewUrl = row.urlThumbnail ?? null
    // Giữ assetId cũ — nếu user không upload ảnh mới thì BE giữ ảnh cũ
    category.assetId = row.thumbnailAssetId ?? null
    createDialog.value?.show()
  }

  function handleShowCreateCate() {
    resetData()
    createDialog.value?.show()
  }

  const handleCreateCate = async () => {
    const isValid = await createCateForm.value?.validate()
    if (!isValid) return

    loading.value = true
    try {
      const res = await CategoryApi.save({
        id: category.id ?? undefined,
        name: category.title,
        assetId: category.assetId ?? undefined
      })
      if (res.code !== 200) throw new Error(res.message)

      resetData()
      createCateForm.value?.resetFields()
      dataTable.value?.reload(dataTable.value?.request)
      createDialog.value?.hide()
      AlertService.success('Thành công', isEdit.value ? 'Cập nhật danh mục thành công!' : 'Thêm danh mục thành công!')
    } catch (error: any) {
      AlertService.error('Lỗi', error?.message || 'Có lỗi xảy ra')
    } finally {
      loading.value = false
    }
  }

  const handleDeleteOne = async (id: number) => {
    try {
      await ElMessageBox.confirm('Bạn có chắc muốn xóa danh mục này?', 'Xác nhận xóa', {
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
        type: 'warning'
      })
      deleteLoading.value = true
      await CategoryApi.deleteCategory([id])
      dataTable.value?.reload(dataTable.value?.request)
      AlertService.success('Thành công', 'Đã xóa danh mục')
    } catch (e: any) {
      if (e !== 'cancel') AlertService.error('Lỗi', e?.message || 'Xóa thất bại')
    } finally {
      deleteLoading.value = false
    }
  }

  const handleDeleteSelected = async () => {
    try {
      await ElMessageBox.confirm(`Bạn có chắc muốn xóa ${selectedIds.value.length} danh mục?`, 'Xác nhận xóa', {
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
        type: 'warning'
      })
      deleteLoading.value = true
      await CategoryApi.deleteCategory(selectedIds.value)
      selectedIds.value = []
      dataTable.value?.reload(dataTable.value?.request)
      AlertService.success('Thành công', 'Đã xóa các danh mục được chọn')
    } catch (e: any) {
      if (e !== 'cancel') AlertService.error('Lỗi', e?.message || 'Xóa thất bại')
    } finally {
      deleteLoading.value = false
    }
  }

  const resetData = () => {
    isEdit.value = false
    category.id = null
    category.title = ''
    category.assetId = null
    category.imgPreviewUrl = null
  }

  const getListCategory = async (params: any) => {
    return await CategoryApi.getListCategoryPagination(params)
  }

  watch(() => route.query.keyword, (newKeyword) => {
    if (newKeyword !== undefined) {
      dataTable.value?.reload({ page: 1, size: 10, keyword: newKeyword as string })
    }
  }, { immediate: true })

  const handleReloadData = (request: RequestParam) => {
    dataTable.value?.reload(request)
  }
</script>

<style scoped lang="scss"></style>