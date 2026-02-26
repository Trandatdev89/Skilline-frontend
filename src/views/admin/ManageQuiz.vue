<template>
  <div class="order">
    <div class="order__add" style="display: flex;align-items: center;gap: 20px">
      <el-input
          v-model="selectArgumentOfQuiz.keyword"
          style="width: 240px"
          size="default"
          placeholder="Please Input"
          :suffix-icon="Search"
      />
      <el-select
          v-model="selectArgumentOfQuiz.courseIdSelected"
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
      <el-select
          v-model="selectArgumentOfQuiz.lectureIdSelected"
          filterable
          allow-create
          default-first-option
          :reserve-keyword="false"
          placeholder="Choose tags for your article"
          style="width: 240px"
      >
        <el-option
            v-for="item in listLectureOfCourse"
            :key="item.id"
            :label="item.title"
            :value="item.id"
        />
      </el-select>

      <el-button @click="showFormAddQuiz" :icon="CirclePlus">
        Thêm quiz
      </el-button>
      <!--      <el-button @click="handleFilter">Filter</el-button>-->
    </div>
    <div class="order__table">
      <DataTable
          ref="dataTable"
          :get-data-function="handleFilter"
      >
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="title" label="Tiêu đề" />
        <el-table-column prop="description" label="Mo ta" />
        <el-table-column prop="timeLimit" label="Thời gian thi" />
        <el-table-column prop="maxAttempt" label="Thi toi da" />
        <el-table-column prop="status" label="Hanh dong">
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
                :title="'Tạo mới quiz'"
                text-btn-ok="Lưu"
                :type-action="TypeAction.CREATE"
                @create="handleCreateQuiz">
    <FormAddQuiz v-model="dataQuizNeedSave" ref="formSaveQuiz" :lectureId=" selectArgumentOfQuiz.lectureIdSelected" />
  </CreateDialog>
</template>

<script setup lang="ts">

  import DataTable from '@/components/datatable/DataTable.vue'
  import { CirclePlus, RefreshLeft, Search } from '@element-plus/icons-vue'
  import useCourse from '@/composable/useCourse.ts'
  import { reactive, ref, watch, watchEffect } from 'vue'
  import useLecture from '@/composable/useLecture..ts'
  import useQuiz from '@/composable/useQuiz.ts'
  import QuizApi from '@/api/QuizApi.ts'
  import { TypeAction } from '@/enums/TypeAction.ts'
  import CreateDialog from '@/components/dialog/common/CreateDialog.vue'
  import FormAddQuiz from '@/views/admin/quiz/FormAddQuiz.vue'
  import type { QuizReq } from '@/type/req/QuizReq.ts'


  const { listCourse, getListCourse } = useCourse()
  const { listLectureOfCourse, getListLectureByCourseId } = useLecture()
  const { listQuizOfLecture, getQuizByLectureId } = useQuiz()
  const loading = ref<boolean>(false)
  const formSaveQuiz = ref<typeof FormAddQuiz | null>(null)
  const createDialog = ref()

  const selectArgumentOfQuiz = reactive({
    courseIdSelected: 1,
    keyword: '',
    lectureIdSelected: null
  })

  const dataQuizNeedSave = reactive<QuizReq>({
    id: null,
    lectureId: selectArgumentOfQuiz.lectureIdSelected,
    title: '',
    desc: '',
    maxAttempt: null
  })

  const handleCreateQuiz = () => {
    console.log(dataQuizNeedSave)
  }

  const showFormAddQuiz = () => {
    createDialog.value?.show()
  }

  const updateCourse = (row: any) => {

  }

  const getQuizzes = (param: any) => {

  }

  const handleFilter = async (params: any) => {
    const requestParams = {
      ...params,
      courseId: selectArgumentOfQuiz.courseIdSelected,
      keyword: selectArgumentOfQuiz.keyword,
      lectureId: selectArgumentOfQuiz.lectureIdSelected
    }
    return await QuizApi.getQuizByLectureId(requestParams)
  }

  watchEffect(async () => {
    await getListCourse()
  })

  watch(() => selectArgumentOfQuiz.courseIdSelected, async (newValue) => {
    if (newValue) {
      await getListLectureByCourseId(newValue)
    }
  })

</script>

<style scoped lang="scss">
  .order {
    &__add {
      margin:25px 0;
    }
  }
</style>