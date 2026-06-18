<template>
  <div class="order">
    <div class="container">
      <div class="order-page">

        <el-breadcrumb separator="/" class="breadcrumb">
          <el-breadcrumb-item :to="{ path: '/' }">Trang chủ</el-breadcrumb-item>
          <el-breadcrumb-item>Đơn mua</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="section-header">
          <el-icon class="section-icon">
            <List />
          </el-icon>
          <h2 class="section-title">Đơn mua của bạn</h2>
        </div>

        <div class="order-container">
          <div class="student-info-section">
            <div class="section-header">
              <el-icon class="section-icon">
                <User />
              </el-icon>
              <h2 class="section-title">Thông tin học viên</h2>
            </div>

            <el-form
                :model="infoUser"
                ref="studentFormRef"
                :rules="rules"
                label-position="top"
            >
              <el-form-item label="Họ và tên" prop="fullname">
                <el-input
                    v-model="infoUser.fullname"
                    placeholder="Nhập họ và tên"
                    size="large"
                    :prefix-icon="UserFilled"
                />
              </el-form-item>

              <el-form-item label="Số điện thoại" prop="phone">
                <el-input
                    v-model="infoUser.phone"
                    placeholder="Nhập số điện thoại"
                    size="large"
                    :prefix-icon="Phone"
                />
              </el-form-item>

              <el-form-item label="Email" prop="email">
                <el-input
                    v-model="infoUser.email"
                    placeholder="Nhập địa chỉ email"
                    size="large"
                    :prefix-icon="Message"
                />
              </el-form-item>
            </el-form>
          </div>
          <div class="order-summary-section">
            <template v-if="orderStore.pendingCourses.length">
              <div
                  v-for="item in orderStore.pendingCourses"
                  :key="item.id"
                  class="course-item"
              >
                <img
                    :src="item.thumbnail_url"
                    :alt="item.title"
                    class="course-thumb"
                    @error="handleImgError"
                />
                <div class="course-details">
                  <h3 class="course-title">{{ item.title }}</h3>
                  <div class="course-meta-tags">
                    <span class="tag tag-level">{{ levelLabel(item.level) }}</span>
                    <span class="tag tag-discount" v-if="item.discount > 0">
                      -{{ item.discount }}%
                    </span>
                  </div>
                  <div class="course-price-row">
                    <span class="price-original" v-if="item.priceOriginal > item.priceDiscount">
                      {{ formatPrice(item.priceOriginal) }}
                    </span>
                    <span class="price-final">
                      {{ formatPrice(item.priceDiscount ?? item.priceOriginal) }}
                    </span>
                  </div>
                </div>
              </div>
            </template>

            <el-empty v-else description="Không có khóa học nào" :image-size="80" />

            <div class="discount-section">
              <el-select
                  v-model="selectedDiscount"
                  placeholder="Chọn phiếu giảm giá"
                  size="large"
                  class="discount-select"
                  clearable
              >
              </el-select>
            </div>

            <div class="price-summary">
              <div class="price-row">
                <span class="price-label">Tạm tính</span>
                <span class="price-value">{{ formatPrice(orderStore.totalAmount) }}</span>
              </div>
              <div class="price-row" v-if="orderStore.totalSaved > 0">
                <span class="price-label">Tiết kiệm</span>
                <span class="price-value saved">- {{ formatPrice(orderStore.totalSaved) }}</span>
              </div>
              <el-divider style="margin: 12px 0" />
              <div class="price-row total">
                <span class="price-label">Tổng thanh toán</span>
                <span class="price-value total-val">{{ formatPrice(orderStore.totalAmount) }}</span>
              </div>
            </div>

            <el-button
                type="primary"
                size="large"
                class="payment-btn"
                @click="handlePayment"
                :loading="paymentLoading"
                :disabled="!orderStore.pendingCourses.length"
            >
              <el-icon v-if="!paymentLoading">
                <CreditCard />
              </el-icon>
              Thanh toán ngay
            </el-button>

            <div class="back-link">
              <el-link @click="goBack">
                <el-icon>
                  <ArrowLeft />
                </el-icon>
                Quay lại giỏ hàng
              </el-link>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import { ArrowLeft, CreditCard, List, Message, Phone, User, UserFilled } from '@element-plus/icons-vue'
  import { storeToRefs } from 'pinia'
  import { useRouter } from 'vue-router'
  import useOrderStore from '@/stores/order'
  import useAuthentication from '@/stores/Authentication'
  import OrderApi from '@/api/OrderApi'
  import PaymentApi from '@/api/PaymentApi'
  import useCartStore from '@/stores/cart.ts'

  const router = useRouter()
  const orderStore = useOrderStore()
  const cartStore = useCartStore();
  const authStore = useAuthentication()
  const { userInfo } = storeToRefs(authStore)

  const paymentLoading = ref(false)
  const selectedDiscount = ref('')
  const studentFormRef = ref()

  const infoUser = ref({
    fullname: userInfo.value?.name || '',
    phone: userInfo.value?.phone || '',
    email: userInfo.value?.email || ''
  })

  const rules = {
    fullname: [
      { required: true, message: 'Vui lòng nhập họ và tên', trigger: 'blur' }
    ],
    phone: [
      { required: true, message: 'Vui lòng nhập số điện thoại', trigger: 'blur' },
      { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ', trigger: 'blur' }
    ],
    email: [
      { required: true, message: 'Vui lòng nhập email', trigger: 'blur' },
      { type: 'email', message: 'Email không hợp lệ', trigger: 'blur' }
    ]
  }

  const formatPrice = (value: number): string =>
      new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)

  const levelLabel = (level: string): string => {
    const map: Record<string, string> = {
      BEGINNER: 'Người mới',
      INTERMEDIATE: 'Trung cấp',
      ADVANCE: 'Chuyên gia'
    }
    return map[level] ?? level
  }

  const handleImgError = (e: Event) => {
    const el = e.target as HTMLImageElement
    el.src = 'https://via.placeholder.com/72x52/E6F1FB/378ADD?text=Course'
  }

  const goBack = () => router.push('/cart')

  const handlePayment = async () => {
    const valid = await studentFormRef.value?.validate().catch(() => false)
    if (!valid) return

    try {
      paymentLoading.value = true

      const responseOrder = await OrderApi.saveOrder({
        courseId: orderStore.pendingCourseIds,
        totalPrice: orderStore.totalAmount
      })

      if (responseOrder.code === 200) {
        const responsePayment: any = await PaymentApi.vnPayment({
          orderId: responseOrder.data.id,
          amount: responseOrder.data.totalPrice,
          userId: responseOrder.data.userId,
          courses: orderStore.pendingCourseIds
        })

        cartStore.handleDeletes();
        orderStore.clearOrder();
        window.location.href = responsePayment?.url
      }
    } catch (error:any) {
      ElMessage.error(error?.response.data.message);
    } finally {
      paymentLoading.value = false
    }
  }

  onMounted(() => {
    if (!orderStore.pendingCourses.length) {
      router.push('/cart')
    }
  })
</script>

<style lang="scss" scoped>
  .order-page {
    background-color: #f8f9fa;
    min-height: 100vh;
    padding: 24px 20px;

    .breadcrumb {
      margin-bottom: 24px;
      font-size: 14px;
    }

    .order-container {
      display: grid;
      grid-template-columns: 1fr 420px;
      gap: 24px;
      max-width: 1100px;
      margin: 0 auto;
    }
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 24px;

    .section-icon {
      font-size: 20px;
      color: #409eff;
    }

    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #303133;
      margin: 0;
    }
  }

  .student-info-section {
    background: #fff;
    border-radius: 12px;
    padding: 28px;
    border: 1px solid #f0f0f0;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    height: fit-content;

    :deep(.el-form-item__label) {
      font-weight: 600;
      color: #606266;
      font-size: 14px;
      padding-bottom: 4px;
    }

    :deep(.el-input__wrapper) {
      border-radius: 8px;
    }

    :deep(.el-form-item) {
      margin-bottom: 20px;
    }

    .login-link {
      text-align: center;
      font-size: 14px;
      color: #909399;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
  }

  .order-summary-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .course-item {
    background: #fff;
    border-radius: 10px;
    padding: 14px;
    border: 1px solid #f0f0f0;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
    display: flex;
    gap: 14px;
    align-items: flex-start;
    transition: box-shadow 0.2s;

    &:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    }

    .course-thumb {
      width: 80px;
      height: 58px;
      border-radius: 8px;
      object-fit: cover;
      flex-shrink: 0;
      background: #ecf5ff;
    }

    .course-details {
      flex: 1;
      min-width: 0;

      .course-title {
        font-size: 14px;
        font-weight: 600;
        color: #303133;
        margin: 0 0 8px 0;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .course-meta-tags {
        display: flex;
        gap: 6px;
        margin-bottom: 8px;

        .tag {
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 20px;
          font-weight: 500;

          &.tag-level {
            background: #f4f4f5;
            color: #606266;
            border: 1px solid #e9e9eb;
          }

          &.tag-discount {
            background: #fef0f0;
            color: #f56c6c;
            border: 1px solid #fde2e2;
          }
        }
      }

      .course-price-row {
        display: flex;
        align-items: center;
        gap: 8px;

        .price-original {
          font-size: 12px;
          color: #c0c4cc;
          text-decoration: line-through;
        }

        .price-final {
          font-size: 15px;
          font-weight: 700;
          color: #409eff;
        }
      }
    }
  }

  .discount-section {
    .discount-select {
      width: 100%;
    }
  }

  .price-summary {
    background: #fff;
    border-radius: 10px;
    padding: 18px 20px;
    border: 1px solid #f0f0f0;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);

    .price-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 0;

      .price-label {
        font-size: 14px;
        color: #909399;
      }

      .price-value {
        font-size: 14px;
        font-weight: 500;
        color: #303133;

        &.saved {
          color: #529b2e;
        }
      }

      &.total {
        .price-label {
          font-size: 16px;
          font-weight: 600;
          color: #303133;
        }

        .total-val {
          font-size: 20px;
          font-weight: 700;
          color: #409eff;
        }
      }
    }
  }

  .payment-btn {
    width: 100%;
    height: 48px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    .el-icon {
      font-size: 18px;
    }
  }

  .back-link {
    text-align: center;

    .el-link {
      font-size: 13px;
      color: #909399;
      display: inline-flex;
      align-items: center;
      gap: 6px;

      &:hover {
        color: #409eff;
      }
    }
  }

  @media (max-width: 1024px) {
    .order-page .order-container {
      grid-template-columns: 1fr;
      gap: 16px;

      .order-summary-section {
        order: -1;
      }
    }
  }

  @media (max-width: 768px) {
    .order-page {
      padding: 16px 12px;
    }

    .student-info-section {
      padding: 20px;
    }

    .course-item .course-thumb {
      width: 64px;
      height: 46px;
    }
  }
</style>