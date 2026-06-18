<template>
  <div class="result-page">
    <div class="result-card">
      <div
          class="result-icon"
          :class="type"
      >
        <el-icon
            v-if="type === 'success'"
            :size="70"
        >
          <CircleCheckFilled />
        </el-icon>

        <el-icon
            v-else
            :size="70"
        >
          <CircleCloseFilled />
        </el-icon>
      </div>

      <h1>
        {{ isSuccess ? 'Thành công!' : 'Thất bại!' }}
      </h1>

      <p>
        {{message}}
      </p>

      <div class="actions">
        <el-button type="primary" size="large" color="#F48C06">
          <RouterLink to="/" style="text-decoration: none">
            <span style="color: white !important;">Về trang chủ</span>
          </RouterLink>
        </el-button>

        <el-button
            v-if="!isSuccess"
            size="large"
        >
          Thử lại
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import {
    CircleCheckFilled,
    CircleCloseFilled
  } from '@element-plus/icons-vue'

  const route = useRoute()

  const props = defineProps({
    type: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    }
  })

  const type = computed(() => {
    return props.type || route.params.type || 'success'
  })

  const message = computed(() => {
    return props.message || route.query.message || ''
  })


  const isSuccess = computed(() => type.value === 'success')
</script>

<style scoped lang="scss">
  .result-page {
    min-height: calc(100vh - 200px);

    display: flex;
    justify-content: center;
    align-items: center;

    padding: 40px 20px;
  }

  .result-card {
    width: 100%;
    max-width: 600px;

    background: white;
    border-radius: 24px;

    padding: 48px;

    text-align: center;

    box-shadow:
        0 10px 30px rgba(0, 0, 0, 0.08);

    h1 {
      margin-top: 24px;
      margin-bottom: 16px;

      font-size: 32px;
      font-weight: 700;
    }

    p {
      color: #6b7280;
      line-height: 1.8;
      font-size: 16px;
    }
  }

  .result-icon {
    display: flex;
    justify-content: center;

    &.success {
      color: #67c23a;
    }

    &.error {
      color: #f56c6c;
    }
  }

  .actions {
    margin-top: 32px;

    display: flex;
    justify-content: center;
    gap: 12px;
  }
</style>