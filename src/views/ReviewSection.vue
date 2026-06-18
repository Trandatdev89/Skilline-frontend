<template>
  <div class="review-section">

    <div class="review-section__header">
      <h3 class="review-section__title">
        <el-icon><ChatDotRound /></el-icon>
        Đánh giá khoá học
        <span class="review-section__count">({{ reviews.length }})</span>
      </h3>
      <div class="review-section__avg" v-if="reviews.length > 0">
        <span class="review-section__avg-score">{{ avgRating.toFixed(1) }}</span>
        <el-rate :model-value="avgRating" disabled allow-half />
      </div>
    </div>

    <div class="review-section__list" ref="listRef">
      <div v-if="loading" class="review-section__loading">
        <el-skeleton :rows="3" animated v-for="i in 3" :key="i" style="margin-bottom: 16px" />
      </div>

      <div v-else-if="reviews.length === 0" class="review-section__empty">
        <el-empty description="Chưa có đánh giá nào. Hãy là người đầu tiên!" :image-size="80" />
      </div>

      <template v-else>
        <div
            v-for="review in reviews"
            :key="review.id"
            class="review-item"
        >
          <div class="review-item__meta">
            <el-avatar
                :size="40"
                :src="review.avatar || undefined"
                class="review-item__avatar"
            >
              {{ review.username?.charAt(0).toUpperCase() }}
            </el-avatar>
            <div class="review-item__info">
              <span class="review-item__username">{{ review.username }}</span>
              <div class="review-item__row">
                <el-rate :model-value="review.rating" disabled size="small" />
                <span class="review-item__date">{{ review.createdAt }}</span>
              </div>
            </div>
          </div>

          <div class="review-item__comment" v-html="review.comment"></div>
        </div>
      </template>
    </div>

    <div class="review-section__form">
      <div class="review-section__form-title">Viết đánh giá của bạn</div>

      <div class="review-section__rating-pick">
        <span class="review-section__rating-label">Chất lượng:</span>
        <el-rate v-model="form.rating" :texts="ratingTexts" show-text />
      </div>

      <div class="review-section__input-wrap">
        <el-input
            v-model="form.comment"
            type="textarea"
            :rows="3"
            placeholder="Chia sẻ trải nghiệm của bạn về khoá học này..."
            resize="none"
            maxlength="500"
            show-word-limit
            class="review-section__textarea"
        />
      </div>

      <div class="review-section__form-actions">
        <el-button
            type="primary"
            :loading="submitting"
            :disabled="!form.comment.trim() || form.rating === 0"
            @click="submitReview"
            class="review-section__submit-btn"
        >
          <el-icon><Promotion /></el-icon>
          Gửi đánh giá
        </el-button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import { ChatDotRound, Promotion } from '@element-plus/icons-vue'
  import ReviewApi, { type ReviewRes } from '@/api/ReviewApi'

  const props = defineProps<{
    courseId: number
  }>()

  const reviews = ref<ReviewRes[]>([])
  const loading = ref(false)
  const submitting = ref(false)

  const form = ref({
    comment: '',
    rating: 0
  })

  const ratingTexts = ['Tệ', 'Kém', 'Trung bình', 'Tốt', 'Xuất sắc']

  const avgRating = computed(() => {
    if (reviews.value.length === 0) return 0
    const sum = reviews.value.reduce((acc, r) => acc + (r.rating ?? 0), 0)
    return sum / reviews.value.length
  })

  const fetchReviews = async () => {
    loading.value = true
    try {
      const res = await ReviewApi.getReviewByCourseId(props.courseId)
      if (res.code === 200) {
        reviews.value = res.data ?? []
      }
    } catch (e) {
      ElMessage.error('Không thể tải đánh giá.Bạn cần đăng nhập để đánh giá!')
    } finally {
      loading.value = false
    }
  }

  const submitReview = async () => {
    if (!form.value.comment.trim()) {
      ElMessage.warning('Vui lòng nhập nội dung đánh giá')
      return
    }
    if (form.value.rating === 0) {
      ElMessage.warning('Vui lòng chọn số sao')
      return
    }

    submitting.value = true
    try {
      const res = await ReviewApi.createReview({
        courseId: props.courseId,
        comment: form.value.comment,
        rating: form.value.rating,
        reviewId: null
      })

      if (res.code === 200) {
        ElMessage.success('Đã gửi đánh giá!')
        form.value = { comment: '', rating: 0 }
        await fetchReviews();
      }
    } catch (e) {
      ElMessage.error('Gửi đánh giá thất bại')
    } finally {
      submitting.value = false
    }
  }

  onMounted(fetchReviews)
</script>

<style lang="scss" scoped>
  .review-section {
    display: flex;
    flex-direction: column;
    gap: 0;
    background: #fff;
    border-radius: 12px;
    border: 1px solid #ebeef5;
    overflow: hidden;

    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px 16px;
      border-bottom: 1px solid #f0f2f5;
    }

    &__title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      font-size: 17px;
      font-weight: 600;
      color: #1a1a2e;

      .el-icon {
        color: #F48C06;
        font-size: 20px;
      }
    }

    &__count {
      font-size: 14px;
      font-weight: 400;
      color: #909399;
    }

    &__avg {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    &__avg-score {
      font-size: 28px;
      font-weight: 700;
      color: #F48C06;
      line-height: 1;
    }

    &__list {
      max-height: 420px;
      overflow-y: auto;
      padding: 12px 24px;

      // custom scrollbar
      &::-webkit-scrollbar {
        width: 5px;
      }
      &::-webkit-scrollbar-track {
        background: #f5f5f5;
        border-radius: 4px;
      }
      &::-webkit-scrollbar-thumb {
        background: #dcdfe6;
        border-radius: 4px;
        &:hover { background: #c0c4cc; }
      }
    }

    &__loading,
    &__empty {
      padding: 16px 0;
    }

    &__form {
      padding: 20px 24px;
      border-top: 1px solid #f0f2f5;
      background: #fafafa;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    &__form-title {
      font-size: 14px;
      font-weight: 600;
      color: #303133;
    }

    &__rating-pick {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    &__rating-label {
      font-size: 13px;
      color: #606266;
      white-space: nowrap;
    }

    &__input-wrap {
      width: 100%;
    }

    &__textarea {
      width: 100%;

      :deep(.el-textarea__inner) {
        border-radius: 8px;
        font-size: 14px;
        resize: none;
        &:focus {
          border-color: #F48C06;
          box-shadow: 0 0 0 2px rgba(244, 140, 6, 0.15);
        }
      }
    }

    &__form-actions {
      display: flex;
      justify-content: flex-end;
    }

    &__submit-btn {
      background-color: #F48C06;
      border-color: #F48C06;
      font-weight: 500;
      padding: 10px 24px;
      border-radius: 8px;

      &:hover:not(:disabled) {
        background-color: #d97a05;
        border-color: #d97a05;
      }

      &:disabled {
        opacity: 0.6;
      }
    }
  }

  .review-item {
    padding: 14px 0;
    border-bottom: 1px solid #f0f2f5;

    &:last-child {
      border-bottom: none;
    }

    &__meta {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 10px;
    }

    &__avatar {
      background-color: #F48C06;
      color: #fff;
      font-weight: 600;
      flex-shrink: 0;
    }

    &__info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    &__username {
      font-size: 14px;
      font-weight: 600;
      color: #303133;
    }

    &__row {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    &__date {
      font-size: 12px;
      color: #909399;
    }


    &__comment {
      font-size: 14px;
      line-height: 1.7;
      color: #606266;
      padding-left: 52px;
      word-break: break-word;
    }
  }
</style>