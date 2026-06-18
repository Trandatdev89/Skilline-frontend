<template>
  <div class="course-page">
    <div class="container">
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">Trang chủ</el-breadcrumb-item>
        <el-breadcrumb-item>Khóa học online</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="content-wrapper">
        <aside class="filter-sidebar">
          <div class="filter-header">
            <el-icon><Filter /></el-icon>
            <h3 class="filter-title">Bộ lọc</h3>
            <el-button link type="danger" size="small" @click="resetFilters">
              Xóa tất cả
            </el-button>
          </div>

          <div class="filter-group">
            <label class="filter-label">Tìm kiếm</label>
            <el-input
                v-model="filters.title"
                placeholder="Nhập tên khóa học..."
                :prefix-icon="Search"
                clearable
            />
          </div>

          <div class="filter-group">
            <label class="filter-label">Danh mục</label>
            <el-select
                v-model="filters.categoryId"
                placeholder="Tất cả danh mục"
                style="width: 100%"
                clearable
            >
              <el-option
                  v-for="item in listCategory"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
              />
            </el-select>
          </div>

          <div class="filter-group">
            <label class="filter-label">Cấp độ</label>
            <el-select
                v-model="filters.level"
                placeholder="Tất cả cấp độ"
                style="width: 100%"
                clearable
            >
              <el-option
                  v-for="item in levelOptions"
                  :key="item.key"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </div>

          <div class="filter-group">
            <label class="filter-label">Khoảng giá</label>
            <div class="price-inputs">
              <el-input-number
                  v-model="filters.priceStart"
                  :min="0"
                  placeholder="Từ"
                  controls-position="right"
                  style="width: 100%"
              />
              <span class="price-separator">—</span>
              <el-input-number
                  v-model="filters.priceEnd"
                  :min="0"
                  placeholder="Đến"
                  controls-position="right"
                  style="width: 100%"
              />
            </div>
          </div>

          <div class="filter-group">
            <label class="filter-label">Đánh giá tối thiểu</label>
            <div class="rate-options">
              <div
                  v-for="item in rateOptions"
                  :key="item.key"
                  class="rate-option"
                  :class="{ active: filters.rateStart === item.key }"
                  @click="applyRateFilter(item.key)"
              >
                <el-rate
                    :model-value="item.key"
                    disabled
                    :max="5"
                    size="small"
                />
                <span class="rate-label">trở lên</span>
              </div>
            </div>
          </div>
        </aside>

        <main class="course-content">
          <div class="result-header">
            <span class="result-count">
              <strong>{{ totalElements }}</strong> khóa học
            </span>
            <el-select
                v-model="sortValue"
                placeholder="Sắp xếp"
                class="sort-select"
                clearable
                @change="handleSortChange"
            >
              <el-option label="Giá thấp đến cao"  value="priceDiscount:asc" />
              <el-option label="Giá cao đến thấp"  value="priceDiscount:desc" />
              <el-option label="Tên A-Z"            value="title:asc" />
              <el-option label="Đánh giá cao nhất" value="rate:desc" />
            </el-select>
          </div>

          <div class="course-grid" v-if="isLoading">
            <el-skeleton
                v-for="i in pageSize"
                :key="i"
                :rows="4"
                animated
                style="border-radius: 12px; overflow: hidden"
            />
          </div>

          <div class="course-grid" v-else-if="listCourse.length > 0">
            <div
                v-for="course in listCourse"
                :key="course.id"
                class="course-card"
                @click="handleToLecture(course.id)"
            >
              <div class="card-thumb">
                <img
                    :src="course.thumbnail_url"
                    :alt="course.title"
                    @error="handleImgError"
                />
                <div class="card-badges">
                  <span class="badge badge-discount" v-if="course.discount > 0">
                    -{{ course.discount }}%
                  </span>
                  <span class="badge badge-level">
                    {{ levelLabel(course.level) }}
                  </span>
                </div>
              </div>

              <div class="card-body">
                <h3 class="card-title">{{ course.title }}</h3>

                <div class="card-rating">
                  <el-rate
                      :model-value="course.rate"
                      disabled
                      size="small"
                      :colors="['#F7BA2A', '#F7BA2A', '#F7BA2A']"
                  />
                  <span class="rate-num">{{ course.rate?.toFixed(1) }}</span>
                </div>

                <div class="card-meta">
                  <span class="meta-item" v-if="course.accessDurationValue && course.expireUnit">
                    <el-icon><Clock /></el-icon>
                    {{ course.accessDurationValue }} {{ unitLabel(course.expireUnit) }}
                  </span>
                  <span class="meta-item meta-lifetime" v-else>
                    <el-icon><Unlock /></el-icon>
                    Trọn đời
                  </span>
                </div>

                <div class="card-price">
                  <span class="price-final">
                    {{ formatPrice(course.priceDiscount ?? course.priceOriginal) }}
                  </span>
                  <span
                      class="price-original"
                      v-if="course.priceOriginal > course.priceDiscount"
                  >
                    {{ formatPrice(course.priceOriginal) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="empty-wrap" v-else>
            <el-empty description="Không tìm thấy khóa học phù hợp" :image-size="160">
              <el-button @click="resetFilters">Xóa bộ lọc</el-button>
            </el-empty>
          </div>

          <div class="pagination-wrap" v-if="totalElements > 0">
            <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :total="totalElements"
                :page-sizes="[10, 20, 30, 50]"
                layout="total, sizes, prev, pager, next, jumper"
                background
                @size-change="handlePageSizeChange"
                @current-change="handlePageChange"
            />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { onMounted, reactive, ref, watch } from 'vue'
  import { Clock, Filter, Search, Unlock } from '@element-plus/icons-vue'
  import useCourse from '@/composable/useCourse'
  import useCategory from '@/composable/useCategory'
  import LevelStudent from '@/enums/LevelStudent'

  export interface SearchCourse {
    title: string
    level: string
    categoryId: number | null
    priceStart: number | null
    priceEnd: number | null
    rateStart: number | null
    rateEnd: number | null
    discount: number | null
    price: number | null
  }

  const router = useRouter()
  const {
    listCourse,
    totalElements,
    totalPages,
    currentPage,
    pageSize,
    isLoading,
    getListCourse,
    searchCourse
  } = useCourse()

  const { listCategory, getListCategories } = useCategory()

  const sortValue = ref<string | null>(null)
  const isFiltering = ref(false)

  const rateOptions = [{ key: 1 }, { key: 2 }, { key: 3 }, { key: 4 }, { key: 5 }]

  const levelOptions = [
    { key: 1, label: 'Người mới',  value: LevelStudent.BEGINNER },
    { key: 2, label: 'Nâng cao', value: LevelStudent.ADVANCE },
    { key: 3, label: 'Chuyên gia', value: LevelStudent.MASTER }
  ]

  const filters = reactive<SearchCourse>({
    title: '',
    level: '',
    categoryId: null,
    priceStart: null,
    priceEnd: null,
    rateStart: null,
    rateEnd: null,
    discount: null,
    price: null
  })

  const formatPrice = (value: number): string =>
      new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value ?? 0)

  const levelLabel = (level: string): string =>
      ({ BEGINNER: 'Cơ bản', INTERMEDIATE: 'Trung cấp', ADVANCE: 'Nâng cao' }[level] ?? level)

  const unitLabel = (unit: string): string =>
      ({ YEAR: 'năm', MONTH: 'tháng', DAY: 'ngày' }[unit] ?? unit)

  const handleImgError = (e: Event) => {
    ;(e.target as HTMLImageElement).src =
        'https://via.placeholder.com/320x175/E6F1FB/378ADD?text=Course'
  }

  const applyRateFilter = (starValue: number) => {
    // Toggle: click lại cùng giá trị thì bỏ chọn
    if (filters.rateStart === starValue) {
      filters.rateStart = null
      filters.rateEnd = null
    } else {
      filters.rateStart = starValue
      filters.rateEnd = 5
    }
  }

  const hasActiveFilter = (): boolean =>
      Object.values(filters).some((v) => v !== null && v !== undefined && v !== '')

  watch(
      filters,
      () => {
        isFiltering.value = hasActiveFilter()
        if (isFiltering.value) {
          searchCourse(filters, sortValue.value, 1, pageSize.value)
        } else {
          getListCourse(1, pageSize.value)
        }
      },
      { deep: true }
  )

  const handleSortChange = (val: string | null) => {
    sortValue.value = val

    searchCourse(
        isFiltering.value ? filters : ({} as SearchCourse),
        sortValue.value,
        1,
        pageSize.value
    )
  }

  const handlePageChange = (page: number) => {
    if (isFiltering.value || sortValue.value) {
      searchCourse(filters, sortValue.value, page, pageSize.value)
    } else {
      getListCourse(page, pageSize.value)
    }
  }

  const handlePageSizeChange = (size: number) => {
    if (isFiltering.value || sortValue.value) {
      searchCourse(filters, sortValue.value, 1, size)
    } else {
      getListCourse(1, size)
    }
  }

  const resetFilters = () => {
    filters.title = ''
    filters.level = ''
    filters.categoryId = null
    filters.priceStart = null
    filters.priceEnd = null
    filters.rateStart = null
    filters.rateEnd = null
    filters.discount = null
    filters.price = null
    sortValue.value = null
    isFiltering.value = false
    getListCourse(1, pageSize.value)
  }

  const handleToLecture = (courseId: number) => {
    router.push(`/lecture?courseId=${courseId}`)
  }

  onMounted(() => {
    getListCourse(1, 10)
    getListCategories()
  })
</script>

<style lang="scss" scoped>
  .course-page {
    padding: 24px 20px;
    background-color: #f5f6f8;
    min-height: 100vh;
  }

  .breadcrumb { margin-bottom: 24px; font-size: 14px; }

  .content-wrapper {
    display: flex;
    gap: 24px;
    align-items: flex-start;
  }

  .filter-sidebar {
    width: 280px;
    flex-shrink: 0;
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    border: 1px solid #f0f0f0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    position: sticky;
    top: 20px;
    max-height: calc(100vh - 40px);
    overflow-y: auto;

    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 4px; }
  }

  .filter-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;

    .el-icon { font-size: 18px; color: #409eff; }
    .filter-title { font-size: 16px; font-weight: 600; color: #303133; margin: 0; flex: 1; }
  }

  .filter-group {
    margin-bottom: 22px;

    .filter-label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: #606266;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
  }

  .price-inputs {
    display: flex;
    align-items: center;
    gap: 8px;

    .price-separator { color: #c0c4cc; font-size: 16px; flex-shrink: 0; }
  }

  .rate-options { display: flex; flex-direction: column; gap: 6px; }

  .rate-option {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 10px;
    border-radius: 8px;
    border: 1px solid #f0f0f0;
    cursor: pointer;
    transition: all 0.15s;
    background: #fafafa;

    &:hover { border-color: #409eff; background: #ecf5ff; }

    &.active {
      border-color: #409eff;
      background: #ecf5ff;
      .rate-label { color: #409eff; font-weight: 600; }
    }

    .rate-label { font-size: 12px; color: #909399; white-space: nowrap; }

    :deep(.el-rate) {
      height: auto;
      .el-rate__icon { font-size: 14px; margin-right: 2px; }
    }
  }

  .course-content { flex: 1; min-width: 0; }

  .result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 14px 18px;
    background: #fff;
    border-radius: 10px;
    border: 1px solid #f0f0f0;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);

    .result-count {
      font-size: 14px;
      color: #606266;
      strong { font-size: 18px; color: #303133; margin-right: 2px; }
    }

    .sort-select { width: 200px; }
  }

  .course-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 24px;
  }

  .course-card {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #f0f0f0;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);

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

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }

    .course-card:hover & img { transform: scale(1.04); }

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

  .card-body { padding: 14px 16px 16px; }

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

    .rate-num { font-size: 13px; font-weight: 600; color: #F7BA2A; }

    :deep(.el-rate) {
      height: auto;
      .el-rate__icon { font-size: 14px; margin-right: 1px; }
    }
  }

  .card-meta {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;

    .meta-item {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #909399;

      .el-icon { font-size: 13px; }
      &.meta-lifetime { color: #529b2e; }
    }
  }

  .card-price {
    display: flex;
    align-items: baseline;
    gap: 8px;
    padding-top: 10px;
    border-top: 1px solid #f5f5f5;

    .price-final { font-size: 16px; font-weight: 700; color: #409eff; }
    .price-original { font-size: 12px; color: #c0c4cc; text-decoration: line-through; }
  }

  .empty-wrap {
    background: #fff;
    border-radius: 12px;
    padding: 48px 0;
    border: 1px solid #f0f0f0;
  }

  .pagination-wrap {
    display: flex;
    justify-content: center;
    padding: 20px 0;
    background: #fff;
    border-radius: 10px;
    border: 1px solid #f0f0f0;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);

    :deep(.el-pagination) {
      flex-wrap: wrap;
      gap: 4px;
      justify-content: center;
    }
  }

  @media (max-width: 1100px) {
    .content-wrapper { flex-direction: column; }
    .filter-sidebar { width: 100%; position: static; max-height: none; }
  }

  @media (max-width: 768px) {
    .course-page { padding: 16px 12px; }

    .result-header {
      flex-direction: column;
      gap: 10px;
      align-items: stretch;
      .sort-select { width: 100%; }
    }

    .course-grid { grid-template-columns: 1fr; }

    .pagination-wrap { padding: 16px 12px; }

    :deep(.el-pagination .el-pagination__sizes) { display: none; }
  }
</style>