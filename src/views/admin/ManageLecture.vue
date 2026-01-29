<template>
  <div class="lecture">
    <div class="lecture__add" style="display: flex;align-items: center;justify-content: space-between;margin: 25px 0">
      <el-select
          v-model="courseIdSelected"
          filterable
          allow-create
          default-first-option
          :reserve-keyword="false"
          placeholder="Choose tags for your article"
          style="width: 240px"
      >
        <el-option
            v-for="item in listCourse"
            :key="item.id"
            :label="item.title"
            :value="item.id"
        />
      </el-select>
      <el-button @click="handleShowCreateCourse">
        Thêm bài giảng
      </el-button>
    </div>
    <div class="lecture__table">
      <DataTable
          ref="dataTable"
          @reload="handleReloadData"
          :get-data-function="getListLectureByCourseId"
      >
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="title" label="Tiêu đề" sortable/>
        <el-table-column prop="categoryName" label="Danh mục" />
        <el-table-column prop="duration" label="Thời lượng" sortable/>
        <el-table-column prop="position" label="Vị trí" sortable/>
        <el-table-column prop="processStatus" label="Upload" >
          <template #default="scope">
            <el-tag>
              {{ scope.row.processStatus }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createAt" label="Ngày tạo đơn" sortable/>
        <el-table-column prop="updateAt" label="Ngày cập nhập" sortable/>
        <el-table-column prop="urlThumbnail" label="Hình ảnh">
          <template #default="scope">
            <el-image
                style="width: 50px; height: 50px; cursor: pointer;"
                :src="scope.row.urlThumbnail"
                :preview-src-list="[scope.row.urlThumbnail]"
                :initial-index="0"
                fit="cover"
                preview-teleported
            >
              <template #error>
                <div class="image-slot">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="Hành động">
          <template #default="scope">
            <el-button @click="updateCourse(scope.row)">
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
  import { RefreshLeft, Delete } from '@element-plus/icons-vue'
  import useCourse from '@/composable/useCourse.ts'
  import FormSaveLecture from '@/components/form/FormSaveLecture.vue'
  import { TypeAction } from '@/enums/TypeAction.ts'
  import useLecture from '@/composable/useLecture..ts'
  import { useRoute } from 'vue-router'
  import type { RequestParam } from '@/type/RequestParam.ts'

  const dataTable = ref<InstanceType<typeof DataTable> | null>(null)
  const createDialog = ref<InstanceType<typeof CreateDialog> | null>()
  const loading = ref(false)
  const courseIdSelected = ref(1)
  const formSaveLecture = ref<InstanceType<typeof FormSaveLecture> | null>(null);
  const { listCourse, getListCourseByMySelf } = useCourse()
  const {listLectureOfCourse,saveLectureByCourseId} = useLecture();
  const isEdit = ref(false)
  const route = useRoute()

  const lecture = reactive({
    id: null,
    title: '',
    courseId: courseIdSelected.value,
    videoFile: null
  })

  const updateCourse = (row: any) => {
    isEdit.value = true;
    lecture.id = row.id
    lecture.courseId = row.courseId
    lecture.title = row.title
    lecture.videoFile = row.videoFile
    createDialog.value?.show()
  }


  function handleShowCreateCourse() {
    createDialog.value?.show()
  }

  const handleCreateLecture = async () => {

    const isValid = formSaveLecture.value?.validate();

    if(!isValid){
      return;
    }

    loading.value = true
    try{
      const formData = new FormData()

      Object.keys(lecture).forEach((key) => {
        let data = lecture[key as keyof typeof lecture]
        if (data) {
          formData.append(key, data as any)
        }
      })

      await saveLectureByCourseId(formData);

      resetData();
      formSaveLecture.value?.resetFields()
      createDialog.value?.hide()
      dataTable.value?.reload(dataTable.value?.request);

    }catch(e){
      console.log(e);
    }
    loading.value = false;
  }

  const resetData = () => {
    isEdit.value = false
    lecture.id = null
    lecture.courseId = courseIdSelected.value
    lecture.title = ''
    lecture.videoFile = null
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
</script>


<style scoped lang="scss">

</style>

