<template>
  <div class="course-page">
    <div class="container">
      <el-breadcrumb separator="•" class="breadcrumb">
        <el-breadcrumb-item>Trang chủ</el-breadcrumb-item>
        <el-breadcrumb-item>Khóa học online</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="content-wrapper">
        <!-- Sidebar Filter -->
        <aside class="filter-sidebar">
          <div class="filter-section">
            <h3 class="filter-title">Bộ lọc</h3>

            <!-- Search by Title -->
            <div class="filter-group">
              <label class="filter-label">Tìm kiếm khóa học</label>
              <el-input
                  v-model="filters.title"
                  placeholder="Nhập tên khóa học..."
                  :prefix-icon="Search"
                  clearable
              />
            </div>

            <div class="filter-group">
              <label class="filter-label">Danh mục</label>
              <el-radio-group v-model="filters.categoryId">
                <el-radio
                    v-for="item in listCategory"
                    :key="item.id"
                    :label="item.id"
                    class="category-checkbox"
                >
                  {{ item.name }}
                </el-radio>
              </el-radio-group>
            </div>

            <div class="filter-group">
              <label class="filter-label">Cấp độ</label>
              <el-select
                  v-model="filters.level"
                  filterable
                  placeholder="Chọn cấp độ"
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


            <!-- Custom Price Range -->
            <div class="filter-group">
              <label class="filter-label">Hoặc tùy chỉnh giá</label>
              <div class="price-inputs">
                <el-input-number
                    v-model="filters.priceStart"
                    :min="0"
                    placeholder="Từ"
                    controls-position="right"
                />
                <span class="price-separator">-</span>
                <el-input-number
                    v-model="filters.priceEnd"
                    :min="0"
                    placeholder="Đến"
                    controls-position="right"
                />
              </div>
            </div>


            <div class="filter-group">
              <label class="filter-label">Đánh giá</label>
              <el-radio-group @change="applyFilters">
                <el-radio
                    v-for="item in rateOptions"
                    :key="item.key"
                    :value="item.key"
                    :label="item.label"
                    class="price-radio"
                >
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </div>

            <!-- Reset Button -->
            <el-button
                type="danger"
                plain
                class="reset-btn"
                @click="resetFilters"
            >
              <el-icon>
                <RefreshLeft />
              </el-icon>
              Xóa bộ lọc
            </el-button>
          </div>
        </aside>

        <!-- Course Grid -->
        <main class="course-content">
          <div class="result-header">
            <span class="result-count">Tìm thấy 0 khóa học</span>
            <el-select placeholder="Sắp xếp" class="sort-select" @change="applySorting">
              <el-option label="Mới nhất" value="newest" />
              <el-option label="Giá thấp đến cao" value="price-asc" />
              <el-option label="Giá cao đến thấp" value="price-desc" />
              <el-option label="Tên A-Z" value="name-asc" />
            </el-select>
          </div>

                    <div class="course-grid" v-if="listCourse.length > 0">
                      <template v-for="course in listCourse" :key="course.id">
                        <CardUi
                            @click="handleToLecture(course.id)"
                            :img="course?.thumbnail_url"
                            :title="course.title"
                            :content-course="course"
                        />
                      </template>
                    </div>

          <el-empty

              description="Không tìm thấy khóa học phù hợp"
              :image-size="200"
          />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router'
  import { onMounted, reactive, watch } from 'vue'
  import { RefreshLeft, Search } from '@element-plus/icons-vue'
  import useCourse from '@/composable/useCourse.ts'
  import useCategory from '@/composable/useCategory.ts'
  import LevelStudent from '@/enums/LevelStudent.ts'
  import CardUi from "@/components/card/CardUi.vue";


  export interface SearchCourse {
    title: string,
    level: string,
    categoryId: number | null,
    priceStart: number | null,
    priceEnd: number | null,
    rateStart: number | null,
    rateEnd: number | null,
    discount: number | null,
    price: number | null
  }

  const router = useRouter()
  const { listCourse, getListCourse, searchCourse } = useCourse()
  const { listCategory, getListCategories } = useCategory()

  const rateOptions = [
    { key: 1, label: '1 sao trở lên' },
    { key: 2, label: '2 sao trở lên' },
    { key: 3, label: '3 sao trở lên' },
    { key: 4, label: '4 sao trở lên' },
    { key: 5, label: '5 sao trở lên' }
  ]

  const levelOptions = [
    { key: 1, label: 'Người mới', value: LevelStudent.BEGINNER },
    { key: 2, label: 'Chuyên gia', value: LevelStudent.ADVANCE },
    { key: 3, label: 'Tất cả', value: null }
  ]

  // Filter state
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

  const applyFilters = (value: number) => {
    console.log(value)
    // Xử lý price range từ radio buttons
    switch (value) {
      case 1:
        filters.rateStart = 1
        filters.rateEnd = 5
        break
      case 2:
        filters.rateStart = 2
        filters.rateEnd = 5
        break
      case 3:
        filters.rateStart = 3
        filters.rateEnd = 5
        break
      case 4:
        filters.rateStart = 4
        filters.rateEnd = 5
        break
      case 5:
        filters.rateStart = 5
        filters.rateEnd = 5
        break
      default:
        filters.rateStart = null
        filters.rateEnd = null
        break
    }
  }

  const applySorting = () => {

  }

  const resetFilters = () => {

  }

  const handleToLecture = (courseId: number) => {
    router.push(`/lecture?courseId=${courseId}`)
  }

  onMounted(() => {
    getListCourse()
    getListCategories()
  })

  watch(filters, (newValue) => {
    if (newValue) {
      searchCourse(newValue)
    }
  })
</script>

<style lang="scss" scoped>
  .course-page {
    padding: 20px;
    background-color: #f8f9fa;
    min-height: 100vh;

    .breadcrumb {
      margin-bottom: 30px;
      font-size: 14px;
      color: #666;
    }

    .content-wrapper {
      display: flex;
      gap: 30px;
      align-items: flex-start;
    }

    // Filter Sidebar Styles
    .filter-sidebar {
      width: 300px;
      flex-shrink: 0;
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      position: sticky;
      top: 20px;
      max-height: calc(100vh - 40px);
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }

      &::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 10px;

        &:hover {
          background: #555;
        }
      }

      .filter-title {
        font-size: 20px;
        font-weight: 700;
        color: #333;
        margin: 0 0 24px 0;
        padding-bottom: 16px;
        border-bottom: 2px solid #f0f0f0;
      }

      .filter-group {
        margin-bottom: 28px;

        .filter-label {
          display: block;
          font-size: 15px;
          font-weight: 600;
          color: #333;
          margin-bottom: 12px;
        }

        .category-checkbox,
        .price-radio {
          display: flex;
          width: 100%;
          margin: 0 0 10px 0;
          padding: 8px 0;

          :deep(.el-checkbox__label),
          :deep(.el-radio__label) {
            font-size: 14px;
            color: #666;
          }
        }

        .price-inputs {
          display: flex;
          align-items: center;
          gap: 12px;

          .el-input-number {
            flex: 1;
          }

          .price-separator {
            color: #999;
            font-weight: 500;
          }
        }
      }

      .reset-btn {
        width: 100%;
        margin-top: 12px;
        height: 40px;
        font-weight: 600;
        border-radius: 8px;
      }
    }

    // Course Content Styles
    .course-content {
      flex: 1;
      min-width: 0;

      .result-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        padding: 16px 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

        .result-count {
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }

        .sort-select {
          width: 200px;
        }
      }

      .course-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 24px;
      }
    }
  }

  // Responsive Design
  @media (max-width: 1200px) {
    .course-page {
      .content-wrapper {
        flex-direction: column;
      }

      .filter-sidebar {
        width: 100%;
        position: static;
        max-height: none;
      }

      .course-content {
        .course-grid {
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        }
      }
    }
  }

  @media (max-width: 768px) {
    .course-page {
      padding: 15px;

      .filter-sidebar {
        padding: 20px;

        .filter-title {
          font-size: 18px;
        }
      }

      .course-content {
        .result-header {
          flex-direction: column;
          gap: 12px;
          align-items: stretch;

          .sort-select {
            width: 100%;
          }
        }

        .course-grid {
          grid-template-columns: 1fr;
        }
      }
    }
  }
</style>