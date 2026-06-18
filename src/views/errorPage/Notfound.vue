<script setup lang="ts">
</script>
<template>
  <div class="not-found">
    <div class="not-found__content">
      <div class="not-found__code">
        404
      </div>

      <h1>Oops! Không tìm thấy trang</h1>

      <p>
        Trang bạn đang tìm kiếm có thể đã bị di chuyển,
        đổi tên hoặc không còn tồn tại.
      </p>

      <div class="not-found__actions">
        <el-button type="primary" size="large" color="#F48C06">
          <RouterLink to="/" style="text-decoration: none">
            <span style="color: white !important;">Về trang chủ</span>
          </RouterLink>
        </el-button>

        <el-button type="primary" size="large" color="#F48C06">
          <RouterLink to="/course" style="text-decoration: none">
            <span style="color: white !important;">Khám phá khóa học</span>
          </RouterLink>
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .not-found {
    min-height: calc(100vh - 140px);

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 40px 20px;

    background: linear-gradient(
        180deg,
        #f8fafc 0%,
        #ffffff 100%
    );

    &__content {
      text-align: center;
      max-width: 700px;
    }

    &__code {
      font-size: 180px;
      font-weight: 800;
      line-height: 1;

      background: linear-gradient(
          135deg,
          #409eff,
          #67c23a
      );

      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;

      margin-bottom: 20px;
    }

    h1 {
      font-size: 42px;
      margin-bottom: 16px;
      color: #1f2937;
    }

    p {
      font-size: 18px;
      line-height: 1.8;
      color: #6b7280;
      margin-bottom: 32px;
    }

    &__actions {
      display: flex;
      justify-content: center;
      gap: 16px;
    }
  }

  @media (max-width: 768px) {
    .not-found {
      &__code {
        font-size: 120px;
      }

      h1 {
        font-size: 30px;
      }

      p {
        font-size: 16px;
      }

      &__actions {
        flex-direction: column;
        align-items: center;
      }
    }
  }
</style>