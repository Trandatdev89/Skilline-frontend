<template>
  <el-dialog v-model="visible" fullscreen :show-close="false" v-loading="savingQuestions">
    <template #header>
      <div class="question-dialog-header">
        <span>Quản lý Quiz — {{ quiz?.title }}</span>
        <div style="display:flex;gap:8px">
          <el-button type="primary" :icon="Plus" @click="addQuestion">Thêm câu hỏi</el-button>
          <el-button type="success" :icon="Check" :loading="savingQuestions" @click="handleSaveAllQuestions">Lưu tất cả</el-button>
          <el-button :icon="Close" @click="visible = false">Đóng</el-button>
        </div>
      </div>
    </template>

    <div class="question-editor">
      <div class="question-sidebar">
        <div
            v-for="(q, idx) in questions"
            :key="idx"
            class="question-thumb"
            :class="{ active: currentQuestionIdx === idx }"
            @click="currentQuestionIdx = idx">
          <span class="q-num">{{ idx + 1 }}</span>
          <span class="q-title">{{ q.content || 'Câu hỏi chưa có nội dung' }}</span>
          <el-button type="danger" :icon="Delete" circle size="small" class="q-delete"
                     @click.stop="removeQuestion(idx)" />
        </div>
        <div class="question-thumb add-btn" @click="addQuestion">
          <el-icon><Plus /></el-icon> Thêm câu hỏi
        </div>
      </div>

      <div class="question-main" v-if="currentQuestion">
        <div class="question-canvas">
          <div class="question-input-wrap">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
              <div class="question-footer">
                <span>Nhiều đáp án đúng:</span>
                <el-switch
                    :model-value="currentQuestion.type === 'MULTIPLE'"
                    @change="(v: boolean) => currentQuestion.type = v ? 'MULTIPLE' : 'SINGLE'" />
              </div>
              <el-tag type="info" size="small">
                Điểm: {{ scorePerQuestion }}
              </el-tag>
            </div>
            <el-input
                v-model="currentQuestion.content"
                type="textarea"
                :rows="3"
                placeholder="Nhập câu hỏi vào đây"
                class="question-textarea"
                resize="none" />
          </div>

          <div class="answers-grid">
            <div
                v-for="(ans, aIdx) in currentQuestion.answerReqs"
                :key="aIdx"
                class="answer-card"
                :class="[`answer-card--${aIdx}`, { correct: ans.isCorrect }]"
                @click="toggleCorrect(aIdx)">
              <div class="answer-card__actions">
                <el-button type="danger" :icon="Delete" circle size="small"
                           @click.stop="removeAnswer(aIdx)"
                           v-if="currentQuestion.answerReqs.length > 2" />
                <el-icon class="correct-icon"><CircleCheck /></el-icon>
              </div>
              <el-input
                  v-model="ans.content"
                  type="textarea"
                  :rows="2"
                  placeholder="Nhập tùy chọn trả lời ở đây"
                  class="answer-input"
                  resize="none"
                  @click.stop />
            </div>
            <div class="answer-card answer-card--add"
                 v-if="currentQuestion.answerReqs.length < 6"
                 @click="addAnswer">
              <el-icon size="28"><Plus /></el-icon>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="question-empty">
        <el-empty description="Chưa có câu hỏi nào. Bấm 'Thêm câu hỏi' để bắt đầu." />
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { Check, CircleCheck, Close, Delete, Plus } from '@element-plus/icons-vue'
  import QuizApi from '@/api/QuizApi.ts'
  import AlertService from '@/service/AlertService.ts'

  interface AnswerDraft { id?: number; content: string; isCorrect: boolean }
  interface QuestionDraft {
    id?: number
    content: string
    type: 'SINGLE' | 'MULTIPLE'
    position: number
    answerReqs: AnswerDraft[]
  }

  const scorePerQuestion = computed(() => {
    if (questions.value.length === 0) return 0
    return +(10 / questions.value.length).toFixed(2)
  })

  const visible = ref(false)
  const quiz = ref<any>(null)
  const questions = ref<QuestionDraft[]>([])
  const currentQuestionIdx = ref(0)
  const savingQuestions = ref(false)

  const currentQuestion = computed(() =>
      questions.value.length > 0 ? questions.value[currentQuestionIdx.value] : null
  )

  const open = async (selectedQuiz: any) => {
    quiz.value = selectedQuiz
    questions.value = []
    currentQuestionIdx.value = 0
    visible.value = true

    try {
      const res = await QuizApi.getQuestionsByQuiz(selectedQuiz.id)
      if (res.code === 200 && res.data?.length) {
        questions.value = res.data.map((q: any, idx: number) => ({
          id: q.questionId,
          content: q.content,
          type: q.type,
          score: q.maxScore ?? 1,
          position: idx + 1,
          answerReqs: (q.answers ?? []).map((a: any) => ({
            id: a.answerId,
            content: a.content,
            isCorrect: a.isCorrect ?? false
          }))
        }))
      }
    } catch {
      // Quiz chưa có câu hỏi
    }
  }

  const addQuestion = () => {
    questions.value.push({
      content: '',
      type: 'SINGLE',
      position: questions.value.length + 1,
      answerReqs: [
        { content: '', isCorrect: false },
        { content: '', isCorrect: false },
        { content: '', isCorrect: false },
        { content: '', isCorrect: false }
      ]
    })
    currentQuestionIdx.value = questions.value.length - 1
  }

  const removeQuestion = (idx: number) => {
    questions.value.splice(idx, 1)
    if (currentQuestionIdx.value >= questions.value.length) {
      currentQuestionIdx.value = Math.max(0, questions.value.length - 1)
    }
  }

  const addAnswer = () => {
    currentQuestion.value?.answerReqs.push({ content: '', isCorrect: false })
  }

  const removeAnswer = (idx: number) => {
    currentQuestion.value?.answerReqs.splice(idx, 1)
  }

  const toggleCorrect = (aIdx: number) => {
    if (!currentQuestion.value) return
    if (currentQuestion.value.type === 'SINGLE') {
      currentQuestion.value.answerReqs.forEach((a, i) => { a.isCorrect = i === aIdx })
    } else {
      currentQuestion.value.answerReqs[aIdx].isCorrect = !currentQuestion.value.answerReqs[aIdx].isCorrect
    }
  }

  const handleSaveAllQuestions = async () => {
    if (!quiz.value) return
    if (questions.value.length === 0) {
      AlertService.error('Lỗi', 'Cần có ít nhất 1 câu hỏi')
      return
    }
    for (const [i, q] of questions.value.entries()) {
      if (!q.content.trim()) {
        AlertService.error('Lỗi', `Câu hỏi ${i + 1} chưa có nội dung`)
        return
      }
      if (!q.answerReqs.some(a => a.isCorrect)) {
        AlertService.error('Lỗi', `Câu hỏi ${i + 1} chưa chọn đáp án đúng`)
        return
      }
    }

    savingQuestions.value = true
    try {
      const res = await QuizApi.saveQuestions({
        quizId: quiz.value.id,
        questions: questions.value.map((q, idx) => ({
          id: q.id ?? undefined,
          content: q.content,
          type: q.type,
          score: scorePerQuestion.value,
          position: idx + 1,
          answerReqs: q.answerReqs.map(a => ({
            id: a.id ?? undefined,
            content: a.content,
            isCorrect: a.isCorrect
          }))
        }))
      })
      if (res.code !== 200) throw new Error(res.message)
      AlertService.success('Thành công', 'Đã lưu tất cả câu hỏi')
      visible.value = false   // 👈 đóng dialog
    } catch (e: any) {
      AlertService.error('Lỗi', e?.message || 'Lưu câu hỏi thất bại')
    } finally {
      savingQuestions.value = false
    }
  }
  defineExpose({ open })
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

    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-thumb { background: rgba(255,255,255,.2); border-radius: 2px; }
  }

  .question-thumb {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,.1);
    border-radius: 8px;
    padding: 10px 8px;
    cursor: pointer;
    color: #fff;
    position: relative;
    transition: background .2s;

    &:hover { background: rgba(255,255,255,.2); }
    &.active { background: rgba(255,255,255,.3); outline: 2px solid #a78bfa; }

    .q-num {
      background: rgba(255,255,255,.25);
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
    &:hover .q-delete { opacity: 1; }

    &.add-btn {
      justify-content: center;
      border: 2px dashed rgba(255,255,255,.3);
      background: transparent;
      font-size: 13px;
      gap: 6px;
      &:hover { border-color: #a78bfa; color: #a78bfa; }
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
    background: rgba(255,255,255,.05);
    border-radius: 12px;
    padding: 20px;
  }

  .question-textarea {
    :deep(.el-textarea__inner) {
      background: transparent;
      border: none;
      border-bottom: 2px solid rgba(255,255,255,.3);
      border-radius: 0;
      color: #fff;
      font-size: 18px;
      text-align: center;
      resize: none;

      &::placeholder { color: rgba(255,255,255,.4); }
      &:focus { border-bottom-color: #a78bfa; box-shadow: none; }
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
        &:hover { background: nth($colors, 2); }
      }
    }

    &--add {
      background: rgba(255,255,255,.08) !important;
      border: 2px dashed rgba(255,255,255,.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255,255,255,.5);
      font-size: 14px;
      gap: 8px;
      &:hover { border-color: #a78bfa; color: #a78bfa; }
    }

    &.correct {
      outline: 3px solid #22c55e;
      box-shadow: 0 0 16px rgba(34,197,94,.4);

      .correct-icon { opacity: 1 !important; color: #22c55e; }
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
      &::placeholder { color: rgba(255,255,255,.6); }
      &:focus { box-shadow: none; }
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

  :deep(.el-dialog__body) { padding: 0; }
  :deep(.el-dialog__header) { padding: 16px 20px; border-bottom: 1px solid #eee; }
</style>