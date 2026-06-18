<template>
  <div class="lecture-page">
    <div class="container">


      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">Trang chủ</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/course' }">Khóa học</el-breadcrumb-item>
        <el-breadcrumb-item>{{ course?.title ?? '...' }}</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="lecture-layout">

        <div class="lecture-main">

          <div class="course-hero" v-if="!isCheckUserBuy && course">
            <div class="hero-thumb">
              <img :src="course.thumbnail_url" :alt="course.title" @error="handleImgError" />
              <div class="hero-overlay">
                <el-icon class="play-icon-big">
                  <VideoPlay />
                </el-icon>
              </div>
            </div>
            <div class="hero-info">
              <el-tag :type="levelType(course.level)" size="small" class="level-tag">
                {{ levelLabel(course.level) }}
              </el-tag>
              <h1 class="hero-title">{{ course.title }}</h1>
              <div class="hero-meta">
                <el-rate :model-value="course.rate" disabled size="small" :colors="['#F7BA2A','#F7BA2A','#F7BA2A']" />
                <span class="rate-val">{{ course.rate?.toFixed(1) }}</span>
              </div>
            </div>
          </div>

          <div class="section-card">
            <h2 class="section-title">
              <el-icon>
                <Star />
              </el-icon>
              Bạn sẽ học được gì?
            </h2>
            <div class="learn-grid">
              <div class="learn-item" v-for="(item, i) in learnItems" :key="i">
                <el-icon class="check-icon">
                  <CircleCheckFilled />
                </el-icon>
                <span>{{ item }}</span>
              </div>
            </div>
          </div>

          <div class="section-card" v-if="course?.description">
            <h2 class="section-title">
              <el-icon>
                <InfoFilled />
              </el-icon>
              Giới thiệu khóa học
            </h2>
            <div class="description-text" v-html="formattedDescription"></div>
          </div>

          <div class="section-card">
            <h2 class="section-title">
              <el-icon>
                <List />
              </el-icon>
              Nội dung khóa học
              <span class="lesson-count">({{ listLectureOfCourse.length }} bài giảng)</span>
            </h2>

            <div class="lesson-list">
              <div
                  v-for="(lesson, index) in listLectureOfCourse"
                  :key="lesson.id"
                  class="lesson-item"
                  :class="{ clickable: isCheckUserBuy || lesson.previewable }"
                  @click="(isCheckUserBuy || lesson.previewable) && handleShowLecture(lesson.id)"
              >
                <div class="lesson-left">
                  <div class="lesson-number">{{ index + 1 }}</div>
                  <el-icon class="lesson-icon">
                    <VideoPlay />
                  </el-icon>
                  <div class="lesson-info">
                    <span class="lesson-title-text">{{ lesson.title }}</span>
                    <span class="lesson-preview-badge" v-if="lesson.previewable && !isCheckUserBuy">
                      Xem thử
                    </span>
                  </div>
                </div>
                <div class="lesson-right">
                  <el-tag v-if="isCheckUserBuy" type="success" size="small" @click.stop="handleShowLecture(lesson.id)">
                    Học
                  </el-tag>
                  <span class="lesson-duration" v-if="lesson.durationSeconds">
                    {{ formatDuration(lesson.durationSeconds) }}
                  </span>
                  <el-icon class="lock-icon" v-if="!isCheckUserBuy && !lesson.previewable">
                    <Lock />
                  </el-icon>
                </div>
              </div>

              <div class="lesson-empty" v-if="listLectureOfCourse.length === 0">
                <el-skeleton :rows="4" animated />
              </div>
            </div>
          </div>

          <ReviewSection :courseId="courseId" />
        </div>

        <aside class="course-sidebar" v-if="!isCheckUserBuy && course">

          <div class="sidebar-thumb">
            <img :src="course.thumbnail_url" :alt="course.title" @error="handleImgError" />
            <div class="thumb-overlay">
              <el-icon>
                <VideoPlay />
              </el-icon>
            </div>
          </div>

          <div class="sidebar-pricing">
            <div class="price-row">
              <span class="price-current">{{ formatPrice(course.priceDiscount) }}</span>
              <span class="price-original" v-if="course.priceOriginal > course.priceDiscount">
                {{ formatPrice(course.priceOriginal) }}
              </span>
              <span class="price-badge" v-if="course.discount > 0">-{{ course.discount }}%</span>
            </div>

            <div class="sidebar-actions">
              <el-button type="primary" size="large" class="btn-cart" @click="handleAdd">
                <el-icon>
                  <ShoppingCart />
                </el-icon>
                Thêm vào giỏ
              </el-button>
            </div>
          </div>

          <div class="sidebar-stats">
            <h4 class="stats-title">Thông tin khóa học</h4>
            <div class="stat-row">
              <el-icon>
                <VideoPlay />
              </el-icon>
              <span class="stat-label">Số bài giảng</span>
              <span class="stat-val">{{ listLectureOfCourse.length }} bài</span>
            </div>
            <div class="stat-row">
              <el-icon>
                <Star />
              </el-icon>
              <span class="stat-label">Đánh giá</span>
              <span class="stat-val">{{ course.rate?.toFixed(1) }} / 5</span>
            </div>
            <div class="stat-row">
              <el-icon>
                <Clock />
              </el-icon>
              <span class="stat-label">Thời hạn</span>
              <span class="stat-val" v-if="course.accessDurationValue && course.expireUnit">
                {{ course.accessDurationValue }} {{ unitLabel(course.expireUnit) }}
              </span>
              <span class="stat-val lifetime" v-else>Trọn đời</span>
            </div>
            <div class="stat-row">
              <el-icon>
                <Medal />
              </el-icon>
              <span class="stat-label">Cấp độ</span>
              <span class="stat-val">{{ levelLabel(course.level) }}</span>
            </div>
          </div>
        </aside>

      </div>
    </div>
  </div>

  <LectureVideoDialog
      ref="lectureVideoDialog"
      title="Video Player"
      :video-id="videoId"
  />
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue'
  import ReviewSection from './ReviewSection.vue'
  import {
    CircleCheckFilled,
    Clock,
    InfoFilled,
    List,
    Lock,
    Medal,
    ShoppingCart,
    Star,
    VideoPlay
  } from '@element-plus/icons-vue'
  import { useRoute } from 'vue-router'
  import LectureVideoDialog from '@/components/dialog/LectureVideoDialog.vue'
  import AlertService from '@/service/AlertService'
  import useCartStore from '@/stores/cart'
  import EnrollmentApi from '@/api/EnrollmentApi'
  import useCourse from '@/composable/useCourse'
  import LectureApi from '@/api/LectureApi.ts'
  import useRedirect from '@/composable/useRedirect.ts'

  const route = useRoute()
  const courseId = computed(() => Number(route.query.courseId))

  const videoId = ref<string>('')
  const lectureVideoDialog = ref()
  const isCheckUserBuy = ref<boolean>(false)

  const { handleAddToCart } = useCartStore()
  const listLectureOfCourse = ref<any>([])
  const { listCourse, getListCourseByListId } = useCourse()
  const {redirectCourse} = useRedirect()


  const course = computed(() => listCourse.value?.[0] ?? null)

  const learnItems = [
    'Nắm vững kiến thức nền tảng và nâng cao của khóa học',
    'Áp dụng thực hành qua các bài tập thực tế',
    'Xây dựng nền tảng kỹ thuật vững chắc',
    'Nâng cao tư duy logic và khả năng giải quyết vấn đề',
    'Học cách tối ưu hóa code và hiệu suất',
    'Có kinh nghiệm làm việc với các công nghệ hiện đại'
  ]

  const getListLectureByCourseId = async () => {
    const requestParams = {
      page: 1,
      size: 100,
      courseId: courseId.value
    }
    const res = await LectureApi.getLecturesByCourseId(requestParams)
    listLectureOfCourse.value = res.data.list
    if (listLectureOfCourse.value.length === 0) {
      await redirectCourse()
    }
  }

  const formattedDescription = computed(() => {
    if (!course.value?.description) return ''
    return course.value.description
        .replace(/\n/g, '<br/>')
  })

  const formatPrice = (value: number): string =>
      new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value ?? 0)

  const formatDuration = (seconds: number): string => {
    if (!seconds) return ''
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${String(s).padStart(2, '0')}`
  }

  const levelLabel = (level: string): string =>
      ({ BEGINNER: 'Cơ bản', INTERMEDIATE: 'Trung cấp', ADVANCE: 'Nâng cao' }[level] ?? level)

  const levelType = (level: string): string =>
      ({ BEGINNER: 'success', INTERMEDIATE: 'warning', ADVANCE: 'danger' }[level] ?? 'info')

  const unitLabel = (unit: string): string =>
      ({ YEAR: 'năm', MONTH: 'tháng', DAY: 'ngày' }[unit] ?? unit)

  const handleImgError = (e: Event) => {
    ;(e.target as HTMLImageElement).src =
        'https://via.placeholder.com/400x225/E6F1FB/378ADD?text=Course'
  }

  const handleShowLecture = (id: string) => {
    videoId.value = id
    lectureVideoDialog.value.show()
  }

  const handleAdd = () => {
    if (!course.value) return
    const isAdd = handleAddToCart(course.value.id)
    if (isAdd) {
      AlertService.success('Thành công', 'Thêm khóa học vào giỏ thành công')
    } else {
      AlertService.error('Thất bại', 'Khóa học đã có trong giỏ hàng')
    }
  }

  const checkUserEnrollment = async () => {
    const res = await EnrollmentApi.checkUserEnrollment(courseId.value)
    isCheckUserBuy.value = res.data
  }

  onMounted(async () => {
    await Promise.all([
      getListCourseByListId([courseId.value]),
      getListLectureByCourseId(),
      checkUserEnrollment()
    ])
  });

  watch(() => courseId.value, (id) => {
    if (!id || isNaN(id)) {
      redirectCourse()
    }
  }, { immediate: true })
</script>

<style lang="scss" scoped>
  .lecture-page {
    background: #f5f6f8;
    min-height: 100vh;
    padding: 24px 20px;
  }

  .breadcrumb {
    margin-bottom: 20px;
    font-size: 14px;
  }

  .lecture-layout {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 24px;
    align-items: flex-start;
  }

  .section-card {
    background: #fff;
    border-radius: 12px;
    padding: 28px;
    border: 1px solid #f0f0f0;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
    margin-bottom: 20px;
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    font-weight: 700;
    color: #1a2e5a;
    margin: 0 0 20px 0;

    .el-icon {
      color: #409eff;
      font-size: 20px;
    }

    .lesson-count {
      font-size: 14px;
      font-weight: 400;
      color: #909399;
      margin-left: 4px;
    }
  }

  .course-hero {
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    border: 1px solid #f0f0f0;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
    margin-bottom: 20px;
    display: flex;
    gap: 20px;
    align-items: flex-start;

    .hero-thumb {
      position: relative;
      width: 200px;
      height: 130px;
      border-radius: 10px;
      overflow: hidden;
      flex-shrink: 0;
      cursor: pointer;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .hero-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.2s;

        .play-icon-big {
          font-size: 40px;
          color: #fff;
        }
      }

      &:hover .hero-overlay {
        opacity: 1;
      }
    }

    .hero-info {
      flex: 1;

      .level-tag {
        margin-bottom: 10px;
      }

      .hero-title {
        font-size: 20px;
        font-weight: 700;
        color: #1a2e5a;
        margin: 0 0 12px 0;
        line-height: 1.4;
      }

      .hero-meta {
        display: flex;
        align-items: center;
        gap: 8px;

        .rate-val {
          font-size: 14px;
          font-weight: 600;
          color: #F7BA2A;
        }
      }
    }
  }

  .learn-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .learn-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 14px;
    color: #303133;
    line-height: 1.5;

    .check-icon {
      color: #67c23a;
      font-size: 18px;
      flex-shrink: 0;
      margin-top: 1px;
    }
  }

  .description-text {
    font-size: 14px;
    color: #606266;
    line-height: 1.8;
  }

  .lesson-list {
    display: flex;
    flex-direction: column;
  }

  .lesson-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
    border-bottom: 1px solid #f5f5f5;
    transition: background 0.15s;
    border-radius: 8px;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: #f9fbff;
    }

    &.clickable {
      cursor: pointer;
    }

    .lesson-left {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
      min-width: 0;

      .lesson-number {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: #ecf5ff;
        color: #409eff;
        font-size: 12px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .lesson-icon {
        color: #409eff;
        font-size: 16px;
        flex-shrink: 0;
      }

      .lesson-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }

      .lesson-title-text {
        font-size: 14px;
        color: #303133;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .lesson-preview-badge {
        font-size: 11px;
        color: #409eff;
        font-weight: 500;
      }
    }

    .lesson-right {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;

      .lesson-duration {
        font-size: 12px;
        color: #909399;
        min-width: 40px;
        text-align: right;
      }

      .lock-icon {
        color: #c0c4cc;
        font-size: 14px;
      }
    }
  }

  .lesson-empty {
    padding: 16px;
  }

  .course-sidebar {
    position: sticky;
    top: 20px;
    display: flex;
    flex-direction: column;
    gap: 0;
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid #f0f0f0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  .sidebar-thumb {
    position: relative;
    width: 100%;
    aspect-ratio: 16/9;
    overflow: hidden;
    background: #ecf5ff;
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .thumb-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;

      .el-icon {
        font-size: 48px;
        color: #fff;
      }
    }
  }

  .sidebar-pricing {
    background: #fff;
    padding: 20px;
    border-bottom: 1px solid #f0f0f0;

    .price-row {
      display: flex;
      align-items: baseline;
      gap: 8px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }

    .price-current {
      font-size: 26px;
      font-weight: 700;
      color: #f56c6c;
    }

    .price-original {
      font-size: 14px;
      color: #c0c4cc;
      text-decoration: line-through;
    }

    .price-badge {
      font-size: 12px;
      font-weight: 600;
      background: #fef0f0;
      color: #f56c6c;
      border: 1px solid #fde2e2;
      padding: 2px 8px;
      border-radius: 20px;
    }

    .sidebar-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .btn-cart, .btn-enroll {
        width: 100%;
        height: 44px;
        font-size: 14px;
        font-weight: 600;
        border-radius: 8px;
      }
    }
  }

  .sidebar-stats {
    background: #fff;
    padding: 20px;

    .stats-title {
      font-size: 14px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 14px 0;
    }

    .stat-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 0;
      border-bottom: 1px solid #f5f5f5;

      &:last-child {
        border-bottom: none;
      }

      .el-icon {
        font-size: 16px;
        color: #409eff;
        flex-shrink: 0;
      }

      .stat-label {
        font-size: 13px;
        color: #909399;
        flex: 1;
      }

      .stat-val {
        font-size: 13px;
        font-weight: 600;
        color: #303133;

        &.lifetime {
          color: #529b2e;
        }
      }
    }
  }

  @media (max-width: 1100px) {
    .lecture-layout {
      grid-template-columns: 1fr;

      .course-sidebar {
        position: static;
        order: -1;
      }
    }

    .learn-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .lecture-page {
      padding: 16px 12px;
    }

    .section-card {
      padding: 20px;
    }

    .course-hero {
      flex-direction: column;

      .hero-thumb {
        width: 100%;
        height: 200px;
      }
    }
  }
</style>