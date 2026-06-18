<template>
  <div class="course">
    <div class="course__add" style="display: flex;align-items: center;justify-content: space-between;margin: 25px 0">
      <div style="display:flex;align-items:center;gap:12px">
        <el-select
            v-model="categoryIdSelected"
            filterable
            allow-create
            default-first-option
            :reserve-keyword="false"
            @visible-change="handleVisibleChange"
            placeholder="Lọc theo danh mục"
            style="width: 240px"
        >
          <el-option v-for="item in listCategory" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <el-button
            v-if="selectedIds.length > 0"
            type="danger"
            :icon="Delete"
            :loading="deleteLoading"
            @click="handleDeleteSelected">
          Xóa {{ selectedIds.length }} mục
        </el-button>
      </div>
      <el-button @click="handleShowCreateCourse" :icon="CirclePlus">Thêm khóa học</el-button>
    </div>
    <div class="course__table">
      <DataTable ref="dataTable"
                 v-if="categoryLoaded"
                 :get-data-function="getListCourse"
                 @selection-change="(rows: any[]) => selectedIds = rows.map(r => r.id)">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="title" label="Tiêu đề" />
        <el-table-column prop="level" label="Cấp độ" />
        <el-table-column prop="publishStatus" label="Trạng thái">
          <template #default="scope">
            <el-tag :type="scope.row.publishStatus === 'PUBLISHER' ? 'success' : 'warning'">
              {{ scope.row.publishStatus }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="priceOriginal" label="Giá gốc">
          <template #default="scope">
            {{ scope.row.priceOriginal?.toLocaleString('vi-VN') }}đ
          </template>
        </el-table-column>
        <el-table-column prop="discount" label="Giảm giá">
          <template #default="scope">
            {{ scope.row.discount }}%
          </template>
        </el-table-column>
        <el-table-column prop="priceDiscount" label="Giá sau giảm">
          <template #default="scope">
            {{ scope.row.priceDiscount?.toLocaleString('vi-VN') }}đ
          </template>
        </el-table-column>
        <el-table-column prop="rate" label="Đánh giá" />
        <el-table-column prop="thumbnail_url" label="Ảnh">
          <template #default="scope">
            <el-image
                v-if="scope.row.thumbnail_url"
                style="width: 50px; height: 50px"
                :src="scope.row.thumbnail_url"
                fit="cover"
            >
              <template #error>
                <div style="display:flex;align-items:center;justify-content:center;height:100%">
                  <el-icon>
                    <Picture />
                  </el-icon>
                </div>
              </template>
            </el-image>
            <span v-else>—</span>
          </template>
        </el-table-column>
        <el-table-column prop="accessDurationValue" label="Thời hạn">
          <template #default="scope">
            {{ scope.row.accessDurationValue }} {{ scope.row.expireUnit }}
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="Ngày tạo" />
        <el-table-column prop="updatedAt" label="Ngày cập nhật" />
        <el-table-column label="Hành động" fixed="right" width="110">
          <template #default="scope">
            <el-button @click="updateCourse(scope.row)" :icon="EditPen" circle size="small" />
            <el-button type="danger" @click="handleDeleteOne(scope.row.id)" :icon="Delete" circle size="small" />
          </template>
        </el-table-column>
      </DataTable>
    </div>
  </div>
  <CreateDialog ref="createDialog"
                v-loading="loading"
                :title="'Tạo mới khóa học'"
                text-btn-ok="Lưu"
                :type-action="TypeAction.CREATE"
                @create="handleCreateCourse">
    <FormSaveCourse v-model="course" ref="formSaveCourse" />
  </CreateDialog>
</template>

<script setup lang="ts">
  import { nextTick, onMounted, reactive, ref, watch } from 'vue'
  import DataTable from '@/components/datatable/DataTable.vue'
  import CreateDialog from '@/components/dialog/common/CreateDialog.vue'
  import LevelStudent from '@/enums/LevelStudent.js'
  import CourseApi from '@/api/CourseApi.js'
  import { CirclePlus, Delete, EditPen, Picture } from '@element-plus/icons-vue'
  import useCourse from '@/composable/useCourse.js'
  import useCategory from '@/composable/useCategory.js'
  import { TypeAction } from '@/enums/TypeAction.js'
  import FormSaveCourse from '@/components/form/FormSaveCourse.vue'
  import type { CourseReq } from '@/type/req/CourseReq.js'
  import { useRoute } from 'vue-router'
  import { ElMessageBox } from 'element-plus'


  const dataTable = ref<InstanceType<typeof DataTable> | null>()
  const createDialog = ref()

  const loading = ref(false)
  const { saveCourse } = useCourse()
  const { listCategory, getListCategory } = useCategory()
  const categoryIdSelected = ref<number | null>(null)
  const selectDropdown = ref<HTMLElement | null>(null)
  const formSaveCourse = ref()
  const route = useRoute()
  const isEdit = ref(false)
  const selectedIds = ref<number[]>([])
  const deleteLoading = ref(false)
  const categoryLoaded = ref(false)

  const handleDeleteOne = async (id: number) => {
    try {
      await ElMessageBox.confirm('Bạn có chắc muốn xóa khóa học này?', 'Xác nhận xóa', {
        confirmButtonText: 'Xóa', cancelButtonText: 'Hủy', type: 'warning'
      })
      deleteLoading.value = true
      await CourseApi.deleteCourse([id])
      dataTable.value?.reload(dataTable.value?.request)
    } catch (e: any) {
      if (e !== 'cancel') console.error(e)
    } finally {
      deleteLoading.value = false
    }
  }

  const handleDeleteSelected = async () => {
    try {
      await ElMessageBox.confirm(`Bạn có chắc muốn xóa ${selectedIds.value.length} khóa học?`, 'Xác nhận xóa', {
        confirmButtonText: 'Xóa', cancelButtonText: 'Hủy', type: 'warning'
      })
      deleteLoading.value = true
      await CourseApi.deleteCourse(selectedIds.value)
      selectedIds.value = []
      dataTable.value?.reload(dataTable.value?.request)
    } catch (e: any) {
      if (e !== 'cancel') console.error(e)
    } finally {
      deleteLoading.value = false
    }
  }

  const course = reactive<CourseReq>({
    id: null,
    title: '',
    desc: '',
    level: LevelStudent.BEGINNER,
    price: null,
    thumbnail: null,
    thumbnailPreviewUrl: null,
    categoryId: categoryIdSelected?.value,
    discount: null,
    rate: 5,
    publishStatus: null,
    accessDurationValue: null,
    accessDurationUnit: null
  })

  const updateCourse = (row: any) => {
    isEdit.value = true
    course.id = row.id
    course.desc = row.description
    course.price = row.priceOriginal
    course.title = row.title
    course.level = row.level
    course.categoryId = row.categoryId
    course.rate = row.rate
    course.discount = Number(row.discount)
    course.publishStatus = row.publishStatus ?? null
    course.accessDurationValue = row.accessDurationValue ?? null
    course.accessDurationUnit = row.expireUnit ?? null
    course.thumbnailPreviewUrl = row.thumbnail_url ?? null
    course.thumbnail = null
    createDialog.value?.show()
  }

  function handleShowCreateCourse() {
    createDialog.value?.show()
  }

  const handleCreateCourse = async () => {

    const isValid = formSaveCourse.value?.validate()
    if (!isValid) {
      return
    }
    loading.value = true



    try {
      const formData = new FormData()

      if (course.id) formData.append('id', String(course.id))
      formData.append('title', course.title)
      formData.append('description', course.desc)
      formData.append('level', course.level)
      if (course.price !== null) formData.append('price', String(course.price))
      if (course.categoryId !== null) formData.append('categoryId', String(course.categoryId))
      if (course.rate !== null) formData.append('rate', String(course.rate))
      if (course.discount !== null) formData.append('discount', String(course.discount))
      if (course.publishStatus) formData.append('publishStatus', course.publishStatus)
      if (course.accessDurationValue !== null) formData.append('accessDurationValue', String(course.accessDurationValue))
      if (course.accessDurationUnit) formData.append('accessDurationUnit', course.accessDurationUnit)
      if (course.thumbnail) formData.append('thumbnail', course.thumbnail) // File object

      await saveCourse(formData)
      formSaveCourse.value?.resetFields()
      createDialog.value?.hide()
      dataTable.value?.reload(dataTable.value?.request)
      resetData()
    } catch (e) {
      console.log(e)
    }

    loading.value = false
  }

  const getListCourse = async (pageRequest: any) => {
    return await CourseApi.getListCourses(pageRequest)
  }

  const handleScroll = async (e: Event) => {
    const ev = e.target as HTMLElement
    if (ev.scrollTop + ev.clientHeight >= ev.scrollHeight - 20) {
      await getListCategory()
    }
  }

  const handleVisibleChange = async (visible: boolean) => {
    if (visible) {
      await nextTick()
      const dropdown = document.querySelector('.el-select-dropdown__wrap')
      if (dropdown) {
        selectDropdown.value = dropdown as HTMLElement
        dropdown.addEventListener('scroll', handleScroll, { passive: true })
      }
    } else {
      if (selectDropdown.value) {
        selectDropdown.value.removeEventListener('scroll', handleScroll)
      }
    }
  }

  const resetData = () => {
    course.id = null
    course.title = ''
    course.desc = ''
    course.level = LevelStudent.BEGINNER
    course.price = null
    course.thumbnail = null
    course.thumbnailPreviewUrl = null
    course.discount = null
    course.rate = 5
    course.publishStatus = null
    course.accessDurationValue = null
    course.accessDurationUnit = null
  }

  watch(() => categoryIdSelected.value, (newValue, oldValue) => {
    if (newValue && newValue !== oldValue) {
      if (dataTable.value?.request) {
        dataTable.value.request.categoryId = newValue
        dataTable.value.reload(dataTable.value.request)
      }
      course.categoryId = newValue
    }
  })

  watch(() => route.query.keyword, (newKeyword) => {
    if (newKeyword !== undefined) {
      dataTable.value?.reload({
        page: 1,
        size: 10,
        keyword: newKeyword as string,
        categoryId: categoryIdSelected.value ?? undefined
      })
    }
  }, { immediate: true })

  onMounted(async () => {
    await getListCategory()
    if (listCategory.value.length > 0) {
      categoryIdSelected.value = listCategory.value[0].id
    }
    categoryLoaded.value = true
  })
</script>


<style scoped lang="scss">

</style>