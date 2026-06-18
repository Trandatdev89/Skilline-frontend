<template>
  <div class="cart-container">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">Trang chủ</el-breadcrumb-item>
      <el-breadcrumb-item>Giỏ hàng</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="cart-card">
      <div class="cart-header">
        <div class="header-left">
          <el-icon class="header-icon"><ShoppingCart /></el-icon>
          <h2 class="header-title">Giỏ hàng</h2>
          <span class="badge-count">{{ courseIds.length }} khóa học</span>
        </div>
      </div>

      <div v-if="courseIds.length === 0" class="empty-state">
        <el-empty description="Giỏ hàng trống" :image-size="120">
          <el-button type="primary" size="large" color="#F48C06">
            <RouterLink to="/course" style="text-decoration: none">
              <span style="color: white !important;">Khám phá khóa học</span>
            </RouterLink>
          </el-button>
        </el-empty>
      </div>

      <template v-else>
        <div class="table-head">
          <span class="col-course">Khóa học</span>
          <span class="col-center">Giá gốc / Giảm</span>
          <span class="col-center">Thành tiền</span>
          <span class="col-center">Đánh giá</span>
          <span class="col-center">Xóa</span>
        </div>

        <div
            v-for="item in listCourse"
            :key="item.id"
            class="course-row"
        >
          <div class="course-info">
            <img
                :src="item.thumbnail_url"
                :alt="item.title"
                class="thumbnail"
                @error="handleImgError"
            />
            <div class="course-meta">
              <p class="course-title">{{ item.title }}</p>
              <div class="course-tags">
                <span class="tag tag-level">
                  <el-icon><User /></el-icon>
                  {{ levelLabel(item.level) }}
                </span>
                <span class="tag tag-discount" v-if="item.discount > 0">
                  <el-icon><Discount /></el-icon>
                  Giảm {{ item.discount }}%
                </span>
                <span class="tag tag-duration">
                  <el-icon><Clock /></el-icon>
                  <span v-if="item.accessDurationValue && item.expireUnit">{{ item.accessDurationValue }} {{ unitLabel(item.expireUnit) }}</span>
                  <span v-else>Vĩnh viễn</span>
                </span>
              </div>
            </div>
          </div>

          <div class="price-col">
            <span class="price-original">
              {{ formatPrice(item.priceOriginal) }}
            </span>
            <span class="price-discount-pct" v-if="item.discount > 0">
              -{{ item.discount }}%
            </span>
          </div>

          <div class="price-col">
            <span class="price-final">{{ formatPrice(item.priceDiscount) }}</span>
            <span class="price-save" v-if="item.priceOriginal > item.priceDiscount">
              Tiết kiệm {{ formatPrice(item.priceOriginal - item.priceDiscount) }}
            </span>
          </div>

          <div class="rating-col">
            <el-rate
                :model-value="item.rate"
                disabled
                :colors="rateColors"
                score-template="{value}"
                show-score
                text-color="var(--el-text-color-secondary)"
            />
          </div>

          <div class="action-col">
            <el-button
                type="danger"
                :icon="Delete"
                circle
                plain
                size="small"
                @click="handleRemoveItem(item.id)"
            />
          </div>
        </div>

        <div class="summary-row">
          <div class="summary-left">
            <span class="summary-label">Tổng thanh toán</span>
            <span class="summary-total">{{ formatPrice(totalAmount) }}</span>
            <span class="summary-saved" v-if="totalSaved > 0">
              <el-icon><CircleCheck /></el-icon>
              Bạn tiết kiệm được {{ formatPrice(totalSaved) }}
            </span>
          </div>
          <el-button
              type="primary"
              size="large"
              class="checkout-btn"
              @click="handlePayment"
          >
            Mua khóa học
            <el-icon class="el-icon--right"><ArrowRight /></el-icon>
          </el-button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import {
    ShoppingCart,
    Delete,
    User,
    Discount,
    Clock,
    CircleCheck,
    ArrowRight
  } from '@element-plus/icons-vue'
  import useCartStore from '@/stores/cart'
  import useOrderStore from '@/stores/order'
  import useCourse from '@/composable/useCourse'
  import router from '@/router/route'

  const cartStore = useCartStore()
  const { courseIds } = storeToRefs(cartStore)
  const { handleSubCart, handleDeletes } = cartStore
  const orderStore = useOrderStore()
  const { listCourse, getListCourseByListId } = useCourse()

  const rateColors = ['#F7BA2A', '#F7BA2A', '#F7BA2A']

  const totalAmount = computed(() =>
      listCourse.value?.reduce(
          (sum: number, item: any) => sum + (item.priceDiscount ?? item.priceOriginal ?? 0),
          0
      ) ?? 0
  )

  const totalSaved = computed(() =>
      listCourse.value?.reduce(
          (sum: number, item: any) =>
              sum + Math.max(0, (item.priceOriginal ?? 0) - (item.priceDiscount ?? 0)),
          0
      ) ?? 0
  )

  const formatPrice = (value: number): string =>
      new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)

  const levelLabel = (level: string): string => {
    const map: Record<string, string> = {
      BEGINNER: 'Người mới',
      ADVANCE: 'Chuyên gia',
      INTERMEDIATE: 'Trung cấp'
    }
    return map[level] ?? level
  }

  const unitLabel = (unit: string): string => {
    const map: Record<string, string> = {
      YEAR: 'năm',
      MONTH: 'tháng',
      DAY: 'ngày',
      LIFETIME: 'trọn đời'
    }
    return map[unit] ?? unit
  }

  const handleImgError = (e: Event) => {
    const el = e.target as HTMLImageElement
    el.src = 'https://via.placeholder.com/72x52/E6F1FB/378ADD?text=Course'
  }

  const handleRemoveItem = (id: number) => {
    handleSubCart(id)
    listCourse.value = listCourse.value.filter((item: any) => item.id !== id)
  }

  const handlePayment = () => {
    orderStore.setPendingCourses(listCourse.value);
    router.push('/order')
  }

  onMounted(async () => {
    if (courseIds.value.length > 0) {
      await getListCourseByListId(courseIds.value)
    }
  })
</script>

<style lang="scss" scoped>
  .cart-container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 24px 20px;
    min-height: 100vh;
    background-color: #f8f9fa;
  }

  .breadcrumb {
    margin-bottom: 20px;
    font-size: 14px;
  }

  .cart-card {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #f0f0f0;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  }

  .cart-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid #f0f0f0;

    .header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .header-icon {
      font-size: 20px;
      color: #409eff;
    }

    .header-title {
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0;
    }

    .badge-count {
      font-size: 12px;
      background: #ecf5ff;
      color: #409eff;
      padding: 3px 10px;
      border-radius: 20px;
      font-weight: 500;
    }
  }

  .empty-state {
    padding: 48px 0;
  }

  .table-head {
    display: grid;
    grid-template-columns: 1fr 130px 130px 130px 56px;
    gap: 12px;
    padding: 10px 24px;
    background: #fafafa;
    border-bottom: 1px solid #f0f0f0;

    span {
      font-size: 12px;
      font-weight: 600;
      color: #909399;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .col-center {
      text-align: center;
    }
  }

  .course-row {
    display: grid;
    grid-template-columns: 1fr 130px 130px 130px 56px;
    gap: 12px;
    padding: 16px 24px;
    border-bottom: 1px solid #f5f5f5;
    align-items: center;
    transition: background 0.15s;

    &:last-of-type {
      border-bottom: none;
    }

    &:hover {
      background: #fafcff;
    }
  }

  .course-info {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .thumbnail {
    width: 80px;
    height: 58px;
    border-radius: 8px;
    object-fit: cover;
    flex-shrink: 0;
    background: #ecf5ff;
  }

  .course-meta {
    min-width: 0;
    flex: 1;
  }

  .course-title {
    font-size: 14px;
    font-weight: 500;
    color: #303133;
    line-height: 1.45;
    margin: 0 0 8px 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .course-tags {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .tag {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 20px;
    font-weight: 500;
    line-height: 1.8;

    .el-icon {
      font-size: 11px;
    }

    &.tag-level {
      background: #f4f4f5;
      color: #606266;
      border: 1px solid #e9e9eb;
    }

    &.tag-discount {
      background: #f0f9eb;
      color: #529b2e;
      border: 1px solid #d1edc4;
    }

    &.tag-duration {
      background: #ecf5ff;
      color: #409eff;
      border: 1px solid #d9ecff;
    }
  }

  .price-col {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  .price-original {
    font-size: 12px;
    color: #c0c4cc;
    text-decoration: line-through;
  }

  .price-discount-pct {
    font-size: 11px;
    font-weight: 600;
    color: #fff;
    background: #f56c6c;
    padding: 1px 6px;
    border-radius: 10px;
  }

  .price-final {
    font-size: 15px;
    font-weight: 600;
    color: #409eff;
  }

  .price-save {
    font-size: 11px;
    color: #529b2e;
  }

  .rating-col {
    display: flex;
    justify-content: center;
    align-items: center;

    :deep(.el-rate) {
      height: auto;
    }

    :deep(.el-rate__text) {
      font-size: 12px;
    }
  }

  .action-col {
    display: flex;
    justify-content: center;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    background: #fafafa;
    border-top: 1px solid #f0f0f0;
  }

  .summary-left {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .summary-label {
    font-size: 13px;
    color: #909399;
  }

  .summary-total {
    font-size: 24px;
    font-weight: 700;
    color: #303133;
    line-height: 1.2;
  }

  .summary-saved {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #529b2e;

    .el-icon {
      font-size: 13px;
    }
  }

  .checkout-btn {
    padding: 12px 32px;
    font-size: 15px;
    font-weight: 600;
    height: auto;
    border-radius: 8px;
  }

  @media (max-width: 900px) {
    .table-head {
      display: none;
    }

    .course-row {
      grid-template-columns: 1fr;
      gap: 12px;
      padding: 16px;
    }

    .price-col,
    .rating-col,
    .action-col {
      text-align: left;
      align-items: flex-start;
      justify-content: flex-start;
    }
  }

  @media (max-width: 600px) {
    .cart-container {
      padding: 16px 12px;
    }

    .cart-header {
      padding: 16px;
    }

    .summary-row {
      flex-direction: column;
      align-items: stretch;
      gap: 16px;
      padding: 16px;
    }

    .checkout-btn {
      width: 100%;
      justify-content: center;
    }
  }
</style>