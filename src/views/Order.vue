<template>
  <div class="order">
    <div class="container">
      <div class="order-page">
        <!-- Breadcrumb -->
        <el-breadcrumb separator="•" class="breadcrumb">
          <el-breadcrumb-item>Trang chủ</el-breadcrumb-item>
          <el-breadcrumb-item>Đơn hàng</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="order-container">
          <!-- Left Section - Student Info -->
          <div class="student-info-section">
            <h2 class="section-title">Thông tin học viên</h2>

            <el-form :model="infoUser" ref="studentFormRef" :rules="rules" label-position="top">
              <el-form-item label="Họ và tên *" prop="fullname">
                <el-input
                    v-model="infoUser.fullname"
                    placeholder="Nhập họ và tên"
                    size="large"
                />
              </el-form-item>

              <el-form-item label="Số điện thoại *" prop="phone">
                <el-input
                    v-model="infoUser.phone"
                    placeholder="Nhập số điện thoại"
                    size="large"
                />
              </el-form-item>

              <el-form-item label="Email *" prop="email">
                <el-input
                    v-model="infoUser.email"
                    placeholder="Nhập địa chỉ email"
                    size="large"
                />
              </el-form-item>
            </el-form>

            <!-- Login Link -->
            <div class="login-link">
              <span>Bạn đã có tài khoản? </span>
              <el-link type="primary" @click="handleLogin">Đăng nhập</el-link>
            </div>
          </div>

          <!-- Right Section - Course List & Payment -->
          <div class="order-summary-section">
            <h2 class="section-title">Danh sách khóa học</h2>

            <!-- Course Item -->
            <div class="course-item" v-for="item in listOrder.order">
              <div class="course-image">
                <img :src="courseImage" alt="Course" />
              </div>
              <div class="course-details">
                <h3 class="course-title">
                  {{ item.title }}
                </h3>
                <div class="course-price">
                  <span class="current-price">{{ item.price }} VND</span>
                </div>
              </div>
            </div>

            <!-- Discount Code -->
            <div class="discount-section">
              <el-select
                  v-model="selectedDiscount"
                  placeholder="Phiếu giảm giá"
                  size="large"
                  class="discount-select"
                  :suffix-icon="TicketIcon"
              >
                <el-option label="Phiếu giảm giá" value="" disabled />
                <el-option label="Giảm 10%" value="10percent" />
                <el-option label="Giảm 50,000 VND" value="50k" />
              </el-select>
            </div>

            <!-- Price Summary -->
            <div class="price-summary">
              <div class="price-divider"></div>
              <div class="price-row total">
                <span class="price-label">Tổng tiền</span>
                <span class="price-value total-price">{{ listOrder.total }} <span class="currency">VND</span></span>
              </div>
            </div>

            <!-- Payment Button -->
            <el-button
                type="primary"
                size="large"
                class="payment-btn"
                @click="handlePayment"
                :loading="paymentLoading"
            >
              Thanh toán
            </el-button>

            <!-- Back Link -->
            <div class="back-link">
              <el-link @click="goBack" class="back-button">
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

<script setup>
  import { ref, reactive, watchEffect, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import { ArrowLeft, Ticket } from '@element-plus/icons-vue'
  import useOrderStore from '@/stores/order.js'
  import { storeToRefs } from 'pinia'
  import useAuthentication from '@/stores/Authentication.js'
  import OrderApi from '@/api/OrderApi.js'
  import AlertService from '@/service/AlertService.js'
  import PaymentApi from '@/api/PaymentApi.js'
  import UserApi from '@/api/UserApi.js'

  const orderStore = useOrderStore()
  const authenticationStore = useAuthentication()

  const { listOrder } = storeToRefs(orderStore)
  const { userInfo } = storeToRefs(authenticationStore)

  const orderReq = reactive({
    userId: userInfo.value.userId,
    totalPrice: listOrder.value.total,
    status: 'PAID',
    courseId: listOrder.value.order?.map(item => Number(item?.id))
  })

  const infoUser = ref({
    phone: '',
    email: '',
    fullname: ''
  })

  // Form validation rules
  const rules = {
    fullName: [
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

  // Refs
  const studentFormRef = ref()
  const selectedDiscount = ref('')
  const paymentLoading = ref(false)
  const TicketIcon = Ticket

  const courseImage = ref('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTAwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjNjY3ZWVhIi8+CjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjNzY0YmEyIi8+Cjx0ZXh0IHg9IjUwIiB5PSI0NSIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QzwvdGV4dD4KPC9zdmc+')

  const handlePayment = async () => {
    try {
      paymentLoading.value = true
      const responseOrder = await OrderApi.saveOrder(orderReq)
      if (responseOrder.code === 200) {
        const responsePaymentOnline = await PaymentApi.vnPayment({
          'orderId': parseInt(responseOrder?.data.id),
          'amount': responseOrder?.data.totalPrice,
          'userId': responseOrder?.data.userId,
          'courses':orderReq.courseId
        })
        window.location.href = responsePaymentOnline?.url
        orderStore.updateOrder();
      } else {
        AlertService.error('Thất bai!', 'Đơn hàng chưa được đặt')
      }
    } catch (error) {
      ElMessage.error('Vui lòng kiểm tra lại thông tin')
    }
    paymentLoading.value = false
  }

  const getInfoUser = async () => {
    const res = await UserApi.getInfo()
    infoUser.value = res.data
  }

  onMounted(async () => {
    await getInfoUser()
  })

</script>

<style lang="scss" scoped>
  .order-page {
    background-color: #f8f9fa;
    min-height: 100vh;
    padding: 20px;

    .breadcrumb {
      margin-bottom: 30px;
      font-size: 14px;
      color: #666;
    }

    .order-container {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 40px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .student-info-section {
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      height: fit-content;

      .section-title {
        color: #2c5aa0;
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 30px;
        margin-top: 0;
      }

      :deep(.el-form-item__label) {
        color: #333;
        font-weight: 600;
        font-size: 15px;
        margin-bottom: 8px;
      }

      :deep(.el-input__wrapper) {
        border-radius: 8px;
        box-shadow: 0 0 0 1px #d9d9d9;
        padding: 12px 16px;

        &:hover {
          box-shadow: 0 0 0 1px #40a9ff;
        }

        &.is-focus {
          box-shadow: 0 0 0 2px #40a9ff;
        }
      }

      :deep(.el-form-item) {
        margin-bottom: 25px;
      }

      .login-link {
        margin-top: 20px;
        text-align: center;
        font-size: 14px;
        color: #666;

        .el-link {
          font-weight: 600;
        }
      }
    }

    .order-summary-section {
      display: flex;
      flex-direction: column;
      gap: 20px;

      .section-title {
        color: #2c5aa0;
        font-size: 24px;
        font-weight: bold;
        margin: 0 0 20px 0;
      }

      .course-item {
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        display: flex;
        gap: 15px;

        .course-image {
          flex-shrink: 0;
          width: 80px;
          height: 60px;
          border-radius: 8px;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .course-details {
          flex: 1;

          .course-title {
            font-size: 16px;
            font-weight: 600;
            color: #333;
            margin: 0 0 10px 0;
            line-height: 1.4;
          }

          .course-price {
            .current-price {
              font-size: 18px;
              font-weight: bold;
              color: #e74c3c;
            }
          }
        }
      }

      .discount-section {
        .discount-select {
          width: 100%;

          :deep(.el-input__wrapper) {
            border-radius: 8px;
            padding: 12px 16px;
            background: white;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

            .el-input__inner {
              color: #17a2b8;
              font-weight: 500;
            }

            .el-input__suffix {
              .el-icon {
                color: #17a2b8;
              }
            }
          }
        }
      }

      .price-summary {
        background: white;
        border-radius: 12px;
        padding: 25px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

        .price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;

          &:last-child {
            margin-bottom: 0;
          }

          &.total {
            .price-label {
              font-size: 18px;
              font-weight: bold;
              color: #333;
            }

            .total-price {
              font-size: 20px;
              font-weight: bold;
              color: #17a2b8;
            }
          }

          .price-label {
            font-size: 16px;
            color: #666;
          }

          .price-value {
            font-size: 16px;
            font-weight: 600;
            color: #333;

            .currency {
              font-size: 14px;
              font-weight: normal;
              color: #666;
            }
          }
        }

        .price-divider {
          height: 1px;
          background: #e9ecef;
          margin: 20px 0;
        }
      }

      .payment-btn {
        background: #1e3a8a;
        border: none;
        border-radius: 8px;
        font-size: 18px;
        font-weight: bold;
        padding: 15px 0;
        width: 100%;

        &:hover {
          background: #1e40af;
        }

        &:active {
          background: #1d4ed8;
        }
      }

      .back-link {
        text-align: center;

        .back-button {
          color: #666;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;

          &:hover {
            color: #40a9ff;
            text-decoration: underline;
          }

          .el-icon {
            font-size: 16px;
          }
        }
      }
    }
  }

  @media (max-width: 1024px) {
    .order-page {
      .order-container {
        grid-template-columns: 1fr;
        gap: 20px;

        .order-summary-section {
          order: -1;
        }
      }
    }
  }

  @media (max-width: 768px) {
    .order-page {
      padding: 15px;

      .student-info-section,
      .course-item,
      .price-summary {
        padding: 20px;
      }

      .order-container {
        gap: 15px;
      }

      .course-item {
        flex-direction: column;
        text-align: center;

        .course-image {
          align-self: center;
        }
      }
    }
  }
</style>