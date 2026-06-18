<template>
  <div class="quiz-manage">
    <!-- Toolbar -->
    <div class="quiz-manage__toolbar">
      <div style="display:flex;align-items:center;gap:12px">
        <el-select v-model="selectArgs.courseIdSelected" filterable placeholder="Chọn khóa học" style="width:220px">
          <el-option v-for="item in listCourse" :key="item.id" :label="item.title" :value="item.id" />
        </el-select>
        <el-select v-model="selectArgs.lectureIdSelected" filterable placeholder="Chọn bài giảng" style="width:220px"
                   clearable>
          <el-option v-for="item in listLectureOfCourse" :key="item.id" :label="item.title" :value="item.id" />
        </el-select>
        <el-input v-model="selectArgs.keyword" placeholder="Tìm kiếm quiz..." style="width:200px" :prefix-icon="Search"
                  clearable />
        <el-button
            v-if="selectedQuizIds.length > 0"
            type="danger" :icon="Delete" :loading="deleteLoading"
            @click="handleDeleteSelectedQuiz">
          Xóa {{ selectedQuizIds.length }} quiz
        </el-button>
      </div>
      <el-button type="primary" :icon="CirclePlus" @click="showFormAddQuiz">Tạo Quiz</el-button>
    </div>

    <!-- Quiz table -->
    <DataTable ref="dataTable" :get-data-function="handleFilter"
               @selection-change="(rows: any[]) => selectedQuizIds = rows.map(r => r.id)">
      <el-table-column type="selection" width="50" />
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="Tiêu đề" />
      <el-table-column prop="description" label="Mô tả" />
      <el-table-column prop="timeLimit" label="Thời gian thi">
        <template #default="scope">
          {{ scope.row.timeLimit }} {{ scope.row.timeUnit }}
        </template>
      </el-table-column>
      <el-table-column prop="maxAttempt" label="Số lần thi tối đa" width="140" />
      <el-table-column label="Hành động" fixed="right" width="110">
        <template #default="scope">
          <el-button :icon="EditPen" circle size="small" @click="handleEditQuiz(scope.row)" />
          <el-button type="primary" :icon="QuestionFilled" circle size="small" @click="handleOpenQuestions(scope.row)"
                     title="Quản lý câu hỏi" />
        </template>
      </el-table-column>
    </DataTable>
  </div>

  <!-- Dialog tạo/sửa Quiz -->
  <CreateDialog ref="createDialog" v-loading="loading"
                :title="editingQuiz ? 'Cập nhật Quiz' : 'Tạo mới Quiz'"
                text-btn-ok="Lưu" :type-action="TypeAction.CREATE" @create="handleCreateQuiz">
    <FormAddQuiz v-model="dataQuizNeedSave" ref="formSaveQuiz" :lecture-id="selectArgs.lectureIdSelected" />
  </CreateDialog>

  <QuestionEditor ref="questionEditor" />

</template>

<script setup lang="ts">
  import { reactive, ref, watch, watchEffect } from 'vue'
  import DataTable from '@/components/datatable/DataTable.vue'
  import QuestionEditor from '@/views/admin/manage-quiz/QuestionEditor.vue'
  import { CirclePlus, Delete, EditPen, QuestionFilled, Search } from '@element-plus/icons-vue'
  import useCourse from '@/composable/useCourse.js'
  import useLecture from '@/composable/useLecture..js'
  import QuizApi from '@/api/QuizApi.js'
  import { TypeAction } from '@/enums/TypeAction.js'
  import CreateDialog from '@/components/dialog/common/CreateDialog.vue'
  import FormAddQuiz from '@/views/admin/manage-quiz/FormAddQuiz.vue'
  import type { QuizReq } from '@/type/req/QuizReq.js'
  import AlertService from '@/service/AlertService.js'
  import { ElMessageBox } from 'element-plus'

  const { listCourse, getListCourse } = useCourse()
  const { listLectureOfCourse, getListLectureByCourseId } = useLecture()
  const loading = ref(false)
  const deleteLoading = ref(false)
  const formSaveQuiz = ref<typeof FormAddQuiz | null>(null)
  const createDialog = ref()
  const dataTable = ref()
  const selectedQuizIds = ref<number[]>([])
  const editingQuiz = ref<any>(null)
  const questionEditor = ref<InstanceType<typeof QuestionEditor> | null>(null)

  interface AnswerDraft {
    id?: number;
    content: string;
    isCorrect: boolean
  }

  interface QuestionDraft {
    id?: number
    content: string
    type: 'SINGLE' | 'MULTIPLE'
    score: number
    position: number
    answerReqs: AnswerDraft[]
  }

  const questions = ref<QuestionDraft[]>([])

  const selectArgs = reactive({
    courseIdSelected: null as number | null,
    keyword: '',
    lectureIdSelected: null as string | null
  })

  const dataQuizNeedSave = reactive<QuizReq>({
    id: null,
    lectureId: null,
    title: '',
    desc: '',
    maxAttempt: null,
    timeLimit: null,
    timeUnit: null
  })

  const showFormAddQuiz = () => {
    editingQuiz.value = null
    Object.assign(dataQuizNeedSave, {
      id: null,
      lectureId: null,
      title: '',
      desc: '',
      maxAttempt: null,
      timeLimit: null,
      timeUnit: null
    })
    createDialog.value?.show()
  }

  const handleEditQuiz = (row: any) => {
    editingQuiz.value = row
    Object.assign(dataQuizNeedSave, {
      id: row.id,
      lectureId: row.lectureId,
      title: row.title,
      desc: row.description,
      maxAttempt: row.maxAttempt,
      timeLimit: row.timeLimit,
      timeUnit: row.timeUnit
    })
    createDialog.value?.show()
  }

  const handleCreateQuiz = async () => {
    const isValid = await formSaveQuiz.value?.validate()
    if (!isValid) return
    loading.value = true
    try {
      const res = await QuizApi.saveQuiz({
        id: dataQuizNeedSave.id ?? undefined,
        lectureId: selectArgs.lectureIdSelected,
        title: dataQuizNeedSave.title,
        desc: dataQuizNeedSave.desc,
        maxAttempt: dataQuizNeedSave.maxAttempt,
        timeLimit: dataQuizNeedSave.timeLimit,
        timeUnit: dataQuizNeedSave.timeUnit
      })
      if (res.code !== 200) throw new Error(res.message)
      createDialog.value?.hide()
      dataTable.value?.reload(dataTable.value?.request)
      AlertService.success('Thành công', editingQuiz.value ? 'Cập nhật quiz thành công!' : 'Tạo quiz thành công!')
    } catch (e: any) {
      AlertService.error('Lỗi', e?.message || 'Có lỗi xảy ra')
    } finally {
      loading.value = false
    }
  }

  const handleDeleteSelectedQuiz = async () => {
    try {
      await ElMessageBox.confirm(`Xóa ${selectedQuizIds.value.length} quiz đã chọn?`, 'Xác nhận', {
        confirmButtonText: 'Xóa', cancelButtonText: 'Hủy', type: 'warning'
      })
      deleteLoading.value = true
      await QuizApi.deleteQuiz(selectedQuizIds.value)
      selectedQuizIds.value = []
      dataTable.value?.reload(dataTable.value?.request)
    } catch (e: any) {
      if (e !== 'cancel') AlertService.error('Lỗi', e?.message)
    } finally {
      deleteLoading.value = false
    }
  }

  const handleOpenQuestions = (quiz: any) => {
    questionEditor.value?.open(quiz)
  }

  const handleFilter = async (params: any) => {
    return await QuizApi.getQuizByCourse({
      ...params,
      courseId: selectArgs.courseIdSelected,
      keyword: selectArgs.keyword
    })
  }

  watchEffect(async () => {
    await getListCourse()
  })

  watch(() => selectArgs.courseIdSelected, async (val) => {
    if (val) await getListLectureByCourseId(val)
  })
</script>

<style scoped lang="scss">
  .quiz-manage {
    &__toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 25px 0;
      gap: 12px;
    }
  }

  .question-dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 18px;
    font-weight: 600;
  }

  .question-editor {
    display: flex;
    height: calc(100vh - 120px);
    gap: 0;
  }

  // Sidebar
  .question-sidebar {
    width: 220px;
    min-width: 220px;
    background: #1e1b3a;
    overflow-y: auto;
    padding: 12px 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-radius: 8px 0 0 8px;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, .2);
      border-radius: 2px;
    }
  }

  .question-thumb {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, .1);
    border-radius: 8px;
    padding: 10px 8px;
    cursor: pointer;
    color: #fff;
    position: relative;
    transition: background .2s;

    &:hover {
      background: rgba(255, 255, 255, .2);
    }

    &.active {
      background: rgba(255, 255, 255, .3);
      outline: 2px solid #a78bfa;
    }

    .q-num {
      background: rgba(255, 255, 255, .25);
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      flex-shrink: 0;
    }

    .q-title {
      flex: 1;
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .q-delete {
      opacity: 0;
      transition: opacity .2s;
    }

    &:hover .q-delete {
      opacity: 1;
    }

    &.add-btn {
      justify-content: center;
      border: 2px dashed rgba(255, 255, 255, .3);
      background: transparent;
      font-size: 13px;
      gap: 6px;

      &:hover {
        border-color: #a78bfa;
        color: #a78bfa;
      }
    }
  }

  // Main editor
  .question-main {
    flex: 1;
    overflow-y: auto;
    background: #2d1b69;
  }

  .question-canvas {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-height: 100%;
  }

  .question-input-wrap {
    background: rgba(255, 255, 255, .05);
    border-radius: 12px;
    padding: 20px;
  }

  .question-textarea {
    :deep(.el-textarea__inner) {
      background: transparent;
      border: none;
      border-bottom: 2px solid rgba(255, 255, 255, .3);
      border-radius: 0;
      color: #fff;
      font-size: 18px;
      text-align: center;
      resize: none;

      &::placeholder {
        color: rgba(255, 255, 255, .4);
      }

      &:focus {
        border-bottom-color: #a78bfa;
        box-shadow: none;
      }
    }
  }

  // Answers grid
  .answers-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  $answer-colors: (
      0: (#4169e1, #3a5fcf),
      1: (#00b4a0, #009d8c),
      2: (#f5a623, #e09520),
      3: (#e05a6e, #cc4d61),
      4: (#8b5cf6, #7c4de5),
      5: (#10b981, #059669),
  );

  .answer-card {
    border-radius: 12px;
    padding: 16px;
    cursor: pointer;
    position: relative;
    min-height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transition: transform .15s, box-shadow .15s;

    @each $i, $colors in $answer-colors {
      &--#{$i} {
        background: nth($colors, 1);

        &:hover {
          background: nth($colors, 2);
        }
      }
    }

    &--add {
      background: rgba(255, 255, 255, .08) !important;
      border: 2px dashed rgba(255, 255, 255, .3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, .5);
      font-size: 14px;
      gap: 8px;

      &:hover {
        border-color: #a78bfa;
        color: #a78bfa;
      }
    }

    &.correct {
      outline: 3px solid #22c55e;
      box-shadow: 0 0 16px rgba(34, 197, 94, .4);

      .correct-icon {
        opacity: 1 !important;
        color: #22c55e;
      }
    }

    &__actions {
      position: absolute;
      top: 8px;
      right: 8px;
      left: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .correct-icon {
      opacity: 0;
      font-size: 20px;
      transition: opacity .2s;
    }
  }

  .answer-input {
    margin-top: 24px;

    :deep(.el-textarea__inner) {
      background: transparent;
      border: none;
      color: #fff;
      font-size: 15px;
      text-align: center;
      resize: none;

      &::placeholder {
        color: rgba(255, 255, 255, .6);
      }

      &:focus {
        box-shadow: none;
      }
    }
  }

  .question-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    color: #fff;
    padding: 8px 0;
  }

  .question-empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #2d1b69;
  }

  // Dialog override
  :deep(.el-dialog__body) {
    padding: 0;
  }

  :deep(.el-dialog__header) {
    padding: 16px 20px;
    border-bottom: 1px solid #eee;
  }
</style>