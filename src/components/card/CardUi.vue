<template>
  <div class="card-ui">
    <div class="card-thumb">
      <img
          :src="props.img"
          :alt="props.title"
          @error="handleImgError"
      />
      <div class="card-badges" v-if="props.contentCourse">
        <span class="badge badge-discount" v-if="props.contentCourse.discount > 0">
          -{{ props.contentCourse.discount }}%
        </span>
        <span class="badge badge-level">
          {{ levelLabel(props.contentCourse.level) }}
        </span>
      </div>
    </div>

    <div class="card-body">
      <h3 class="card-title">{{ props.title }}</h3>

      <div class="card-rating" v-if="props.contentCourse">
        <el-rate
            :model-value="localRate"
            disabled
            size="small"
            :colors="['#F7BA2A', '#F7BA2A', '#F7BA2A']"
        />
        <span class="rate-num">{{ props.contentCourse.rate?.toFixed(1) ?? '0.0' }}</span>
      </div>

      <div class="card-meta" v-if="props.contentCourse">
        <span
            class="meta-item"
            v-if="props.contentCourse.accessDurationValue && props.contentCourse.expireUnit"
        >
          <el-icon><Clock /></el-icon>
          {{ props.contentCourse.accessDurationValue }} {{ unitLabel(props.contentCourse.expireUnit) }}
        </span>
        <span class="meta-item meta-lifetime" v-else>
          <el-icon><Unlock /></el-icon>
          Trọn đời
        </span>
      </div>

      <div class="card-price" v-if="props.contentCourse">
        <span class="price-final">
          {{ formatPrice(props.contentCourse.priceDiscount ?? props.contentCourse.priceOriginal) }}
        </span>
        <span
            class="price-original"
            v-if="props.contentCourse.priceOriginal > props.contentCourse.priceDiscount"
        >
          {{ formatPrice(props.contentCourse.priceOriginal) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue'
  import { Clock, Unlock } from '@element-plus/icons-vue'

  const props = defineProps<{
    title: string
    img: string
    contentCourse?: any
  }>()

  const localRate = ref(props.contentCourse?.rate ?? 0)

  watch(
      () => props.contentCourse?.rate,
      (newVal) => { localRate.value = newVal ?? 0 }
  )

  const formatPrice = (value: number): string =>
      new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value ?? 0)

  const levelLabel = (level: string): string => {
    const map: Record<string, string> = {
      BEGINNER: 'Cơ bản',
      INTERMEDIATE: 'Trung cấp',
      ADVANCE: 'Nâng cao'
    }
    return map[level] ?? level
  }

  const unitLabel = (unit: string): string => {
    const map: Record<string, string> = {
      YEAR: 'năm',
      MONTH: 'tháng',
      DAY: 'ngày'
    }
    return map[unit] ?? unit
  }

  const handleImgError = (e: Event) => {
    const el = e.target as HTMLImageElement
    el.src = 'https://via.placeholder.com/320x175/E6F1FB/378ADD?text=Course'
  }
</script>

<style lang="scss" scoped>
  .card-ui {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #f0f0f0;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
    height: 100%;
    display: flex;
    flex-direction: column;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      border-color: #d9ecff;
    }
  }

  .card-thumb {
    position: relative;
    width: 100%;
    height: 175px;
    overflow: hidden;
    background: #ecf5ff;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }

    .card-ui:hover & img {
      transform: scale(1.04);
    }

    .card-badges {
      position: absolute;
      top: 10px;
      left: 10px;
      display: flex;
      gap: 6px;
    }

    .badge {
      font-size: 11px;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 20px;

      &.badge-discount {
        background: #fef0f0;
        color: #f56c6c;
        border: 1px solid #fde2e2;
      }

      &.badge-level {
        background: rgba(255, 255, 255, 0.92);
        color: #606266;
        border: 1px solid #e9e9eb;
      }
    }
  }

  .card-body {
    padding: 14px 16px 16px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .card-title {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
    line-height: 1.45;
    margin: 0 0 10px 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 40px;
  }

  .card-rating {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;

    .rate-num {
      font-size: 13px;
      font-weight: 600;
      color: #F7BA2A;
    }

    :deep(.el-rate) {
      height: auto;
      .el-rate__icon { font-size: 14px; margin-right: 1px; }
    }
  }

  .card-meta {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
    flex: 1;

    .meta-item {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #909399;

      .el-icon { font-size: 13px; }

      &.meta-lifetime {
        color: #529b2e;
      }
    }
  }

  .card-price {
    display: flex;
    align-items: baseline;
    gap: 8px;
    padding-top: 10px;
    border-top: 1px solid #f5f5f5;

    .price-final {
      font-size: 16px;
      font-weight: 700;
      color: #409eff;
    }

    .price-original {
      font-size: 12px;
      color: #c0c4cc;
      text-decoration: line-through;
    }
  }
</style>