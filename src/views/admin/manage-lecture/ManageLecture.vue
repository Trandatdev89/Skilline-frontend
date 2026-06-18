<template>
  <div class="lecture">
    <div class="lecture__add" style="display: flex;align-items: center;justify-content: space-between;margin: 25px 0">
      <div style="display:flex;align-items:center;gap:12px">
        <el-select v-model="courseIdSelected" filterable default-first-option placeholder="Chọn khóa học" style="width: 240px">
          <el-option v-for="item in listCourse" :key="item.id" :label="item.title" :value="item.id" />
        </el-select>
        <el-button v-if="selectedIds.length > 0" type="danger" :icon="Delete" :loading="deleteLoading" @click="handleDeleteSelected">
          Xóa {{ selectedIds.length }} mục
        </el-button>
      </div>
      <el-button @click="handleShowCreateCourse" :icon="CirclePlus">Thêm bài giảng</el-button>
    </div>
    <div class="lecture__table">
      <DataTable ref="dataTable" @reload="handleReloadData" :get-data-function="getListLectureByCourseId"
                 @selection-change="(rows: any[]) => selectedIds = rows.map(r => r.id)">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="Tiêu đề" sortable />
        <el-table-column prop="position" label="Vị trí" width="80" sortable />
        <el-table-column prop="durationSeconds" label="Thời lượng" sortable>
          <template #default="scope">
            {{ scope.row.durationSeconds ? formatDuration(scope.row.durationSeconds) : '—' }}
          </template>
        </el-table-column>
        <el-table-column prop="publishStatus" label="Trạng thái">
          <template #default="scope">
            <el-tag :type="scope.row.publishStatus === 'PUBLISHER' ? 'success' : scope.row.publishStatus === 'DRAFT' ? 'warning' : 'info'">
              {{ scope.row.publishStatus }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="previewable" label="Xem thử" width="90">
          <template #default="scope">
            <el-tag :type="scope.row.previewable ? 'success' : 'info'">
              {{ scope.row.previewable ? 'Có' : 'Không' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="urlThumbnail" label="Thumbnail" width="90">
          <template #default="scope">
            <el-image
                v-if="scope.row.urlThumbnail"
                style="width: 50px; height: 50px; cursor: pointer;"
                :src="scope.row.urlThumbnail"
                :preview-src-list="[scope.row.urlThumbnail]"
                :initial-index="0"
                fit="cover"
                preview-teleported>
              <template #error>
                <div class="image-slot"><el-icon><Picture /></el-icon></div>
              </template>
            </el-image>
            <span v-else>—</span>
          </template>
        </el-table-column>
        <el-table-column prop="createAt" label="Ngày tạo" sortable />
        <el-table-column prop="updateAt" label="Ngày cập nhật" sortable />
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
                :title="'Tạo mới bài giảng'"
                text-btn-ok="Lưu"
                :width-dialog="500"
                :type-action="TypeAction.CREATE"
                @cancel="resetData"
                @create="handleCreateLecture">
    <FormSaveLecture :model-value="lecture" ref="formSaveLecture"/>
  </CreateDialog>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref, watch } from 'vue'
  import DataTable from '@/components/datatable/DataTable.vue'
  import CreateDialog from '@/components/dialog/common/CreateDialog.vue'
  import LectureApi from '@/api/LectureApi.ts'
  import { RefreshLeft, Picture, Delete, EditPen, CirclePlus } from '@element-plus/icons-vue'
  import useCourse from '@/composable/useCourse.ts'
  import FormSaveLecture from '@/components/form/FormSaveLecture.vue'
  import { TypeAction } from '@/enums/TypeAction.ts'
  import useLecture from '@/composable/useLecture..ts'
  import { useRoute } from 'vue-router'
  import type { RequestParam } from '@/type/RequestParam.ts'
  import { ElMessageBox } from 'element-plus'

  const dataTable = ref<InstanceType<typeof DataTable> | null>(null)
  const createDialog = ref<InstanceType<typeof CreateDialog> | null>()
  const loading = ref(false)
  const courseIdSelected = ref(1)
  const formSaveLecture = ref<InstanceType<typeof FormSaveLecture> | null>(null);
  const { listCourse, getListCourseByMySelf } = useCourse()
  const {saveLectureByCourseId} = useLecture();
  const isEdit = ref(false)
  const route = useRoute()

  const selectedIds = ref<string[]>([])
  const deleteLoading = ref(false)
  const previewVideo = ref();

  const handleDeleteOne = async (id: string) => {
    try {
      await ElMessageBox.confirm('Bạn có chắc muốn xóa bài giảng này?', 'Xác nhận xóa', {
        confirmButtonText: 'Xóa', cancelButtonText: 'Hủy', type: 'warning'
      })
      deleteLoading.value = true
      await LectureApi.deleteLecture([id])
      dataTable.value?.reload(dataTable.value?.request)
    } catch (e: any) {
      if (e !== 'cancel') console.error(e)
    } finally {
      deleteLoading.value = false
    }
  }

  const handleDeleteSelected = async () => {
    try {
      await ElMessageBox.confirm(`Bạn có chắc muốn xóa ${selectedIds.value.length} bài giảng?`, 'Xác nhận xóa', {
        confirmButtonText: 'Xóa', cancelButtonText: 'Hủy', type: 'warning'
      })
      deleteLoading.value = true
      await LectureApi.deleteLecture(selectedIds.value)
      selectedIds.value = []
      dataTable.value?.reload(dataTable.value?.request)
    } catch (e: any) {
      if (e !== 'cancel') console.error(e)
    } finally {
      deleteLoading.value = false
    }
  }

  const lecture = reactive({
    id: null as string | null,
    title: '',
    courseId: courseIdSelected.value,
    contentAssetId: null as string | null,
    thumbnailAssetId: null as string | null,
    durationSeconds: null as number | null,
    previewable: false,
    publishStatus: null as string | null
  })

  const updateCourse = (row: any) => {
    isEdit.value = true
    lecture.id = row.id
    lecture.courseId = courseIdSelected.value
    lecture.title = row.title
    lecture.contentAssetId = row.contentAssetId ?? null
    lecture.thumbnailAssetId = row.thumbnailAssetId ?? null
    lecture.durationSeconds = row.durationSeconds ?? null
    lecture.previewable = row.previewable ?? false
    lecture.publishStatus = row.publishStatus ?? null
    createDialog.value?.show()
  }


  function handleShowCreateCourse() {
    createDialog.value?.show()
  }

  const handleCreateLecture = async () => {

    const isValid = formSaveLecture.value?.validate()

    if (!isValid) {
      return
    }

    loading.value = true
    try {
      // Gửi JSON — backend nhận contentAssetId và thumbnailAssetId, không nhận file trực tiếp nữa
      await saveLectureByCourseId({
        id: lecture.id ?? undefined,
        title: lecture.title,
        courseId: lecture.courseId,
        contentAssetId: lecture.contentAssetId ?? undefined,
        thumbnailAssetId: lecture.thumbnailAssetId ?? undefined,
        durationSeconds: lecture.durationSeconds ?? undefined,
        previewable: lecture.previewable,
        publishStatus: lecture.publishStatus ?? undefined
      })

      resetData()
      formSaveLecture.value?.resetFields()
      createDialog.value?.hide()
      dataTable.value?.reload(dataTable.value?.request)

    } catch (e) {
      console.log(e)
    }
    loading.value = false
  }

  const resetData = () => {
    isEdit.value = false
    lecture.id = null
    lecture.courseId = courseIdSelected.value
    lecture.title = ''
    lecture.contentAssetId = null
    lecture.thumbnailAssetId = null
    lecture.durationSeconds = null
    lecture.previewable = false
    lecture.publishStatus = null
    previewVideo.value = null
  }


  const getListLectureByCourseId = async (params: any) => {
    const requestParams = {
      ...params,
      courseId: courseIdSelected.value
    }
    return await LectureApi.getLecturesByCourseId(requestParams)
  }

  watch(() => courseIdSelected.value, async (newValue, oldValue) => {
    if (newValue && newValue !== oldValue) {
      if (dataTable.value?.request) {
        dataTable.value.request.courseId = newValue
        await dataTable.value.reload(dataTable.value.request)
      }
      lecture.courseId = newValue;
    }
  })

  watch(() => route.query.keyword, (newKeyword) => {
    if (newKeyword !== undefined) {
      dataTable.value?.reload({
        page: 1,
        size: 10,
        keyword: newKeyword as string
      })
    }
  }, { immediate: true })

  onMounted(async () => {
    await getListCourseByMySelf()
  })

  const handleReloadData = (request: RequestParam) => {
    dataTable.value?.reload(request)
  }

  const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
</script>


<style scoped lang="scss">

</style>