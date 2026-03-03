<template>
  <div class="course">
    <div class="container">
      <div class="course-lecture">
        <div class="lecture-content">
          <!-- Title -->
          <h2 class="course-title">Nội dung khóa học</h2>

          <!-- Lesson Section -->
          <div class="lesson-section">

            <div class="lesson-list">
              <div
                  v-for="(lesson,index) in lessons"
                  :key="lesson.id"
                  class="lesson-item"
              >
                <div class="lesson-main">
                  <el-icon class="play-icon">
                    <VideoPlay />
                  </el-icon>
                  <span class="lesson-title">Bài {{index+1}} : {{ lesson.title }}</span>
                </div>
                <div class="lesson-actions">
                  <span
                      v-if="isCheckUserBuy"
                      type="primary"
                      class="try-link"
                      @click="handleShowLecture(lesson.id)"
                  >
                    Học
                  </span>
                  <span class="lesson-duration">{{ lesson.duration }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Course Info Sidebar -->
        <div class="course-sidebar" v-if="!isCheckUserBuy">
          <!-- Video Preview -->
          <div class="video-preview">
            <div class="video-container">
              <div class="video-placeholder">
                <div class="video-content">
                  <div class="course-badge"></div>
                  <div class="video-stats">
                    <span>QUA 130 VIDEO</span>
                    <span>VÀ 310 BÀI TẬP</span>
                    <span></span>
                  </div>
                  <div class="instructor-info">
                    <div class="instructor-avatar"></div>
                    <span></span>
                  </div>
                  <el-button class="watch-btn">
                    <el-icon>
                      <VideoPlay />
                    </el-icon>
                    WATCH VIDEO
                  </el-button>
                </div>
                <div class="play-button">
                  <el-icon>
                    <VideoPlay />
                  </el-icon>
                </div>
              </div>
              <!-- Social Media Icons -->
              <div class="social-icons">
                <div class="social-icon youtube"></div>
                <div class="social-icon facebook"></div>
              </div>
            </div>
          </div>

          <!-- Pricing -->
          <div class="pricing-section">
            <div class="price-display">
              <span class="current-price">1,099,000</span>
              <span class="currency">VND</span>
              <span class="original-price">2,750,000 VND</span>
            </div>
            <div style="display: flex;align-items: center;justify-content: space-between">
              <el-button type="primary" size="large" class="register-btn" @click="handleAdd">
                Thêm giỏ hàng
              </el-button>
              <el-button type="primary" size="large" class="register-btn">
                Đăng Ký Học
              </el-button>
            </div>
          </div>

          <!-- Course Stats -->
          <div class="course-stats">
            <div class="stat-item">
              <el-icon>
                <Document />
              </el-icon>
              <div class="stat-content">
                <span class="stat-label">Bài giảng</span>
                <span class="stat-value">170</span>
              </div>
            </div>

            <div class="stat-item">
              <el-icon>
                <Clock />
              </el-icon>
              <div class="stat-content">
                <span class="stat-label">Thời lượng</span>
                <span class="stat-value">150 giờ</span>
              </div>
            </div>

            <div class="stat-item">
              <el-icon>
                <EditPen />
              </el-icon>
              <div class="stat-content">
                <span class="stat-label">Bài tập</span>
                <span class="stat-value">520</span>
              </div>
            </div>

            <div class="stat-item">
              <el-icon>
                <Trophy />
              </el-icon>
              <div class="stat-content">
                <span class="stat-label">Số hữu</span>
                <span class="stat-value">Trọn đời</span>
              </div>
            </div>
          </div>

          <!-- Social Share -->
          <div class="social-share">
            <div class="social-item facebook">
              <el-icon>
                <Share />
              </el-icon>
            </div>
            <div class="social-item twitter">
              <el-icon>
                <Share />
              </el-icon>
            </div>
            <div class="social-item pinterest">
              <el-icon>
                <Share />
              </el-icon>
            </div>
            <div class="social-item linkedin">
              <el-icon>
                <Share />
              </el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <LectureVideoDialog
      ref="lectureVideoDialog"
      title="Video Player" :video-id="videoId"
  />
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import {
    VideoPlay,
    Document,
    Clock,
    EditPen,
    Trophy,
    Share
  } from '@element-plus/icons-vue'
  import { useRoute } from 'vue-router'
  import LectureApi from '@/api/LectureApi.js'
  import LectureVideoDialog from '@/components/dialog/LectureVideoDialog.vue'
  import AlertService from '@/service/AlertService.js'
  import useCartStore from '@/stores/cart.js'
  import EnrollmentApi from '@/api/EnrollmentApi.ts'

  const lessons = ref()
  const videoId = ref()
  const lectureVideoDialog = ref()
  const accessToken = localStorage.getItem("accessToken");

  const route = useRoute()
  const courseId = route.query.courseId;
  const {handleAddToCart} = useCartStore();
  const isCheckUserBuy = ref<boolean>(false);

  const getListLesson = async () => {
    try {
      let res = await LectureApi.getLecturesByCourseIdNotPagi(Number(courseId));
      lessons.value = res.data;
    } catch (error) {
      console.error('Error fetching lectures:', error);
    }
  }

  const checkUserEnrollment = async ()=>{
    const res = await EnrollmentApi.checkUserEnrollment(Number(courseId));
    isCheckUserBuy.value = res.data;
  }

  const handleShowLecture = (id:number) => {
    videoId.value = id
    lectureVideoDialog.value.show()
  }

  const handleAdd = () => {

    const isAdd = handleAddToCart(courseId);
    if (isAdd) {
      AlertService.success("Thành công","Thêm sản phẩm vào giỏ thành công")
    } else {
      AlertService.success("Thất bại","Sản phẩm đã thêm vào giỏ rồi")
    }
  };

  onMounted(() => {
    getListLesson()
    checkUserEnrollment();
  })
</script>

<style lang="scss" scoped>
  .course-lecture {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 30px;
    padding: 20px;
    background-color: #f8f9fa;
    min-height: 100vh;

    .lecture-content {
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

      .course-title {
        color: #2c5aa0;
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 30px;
        margin-top: 0;
      }

      .lesson-section {
        .section-header {
          background: #17a2b8;
          color: white;
          padding: 15px 20px;
          margin-bottom: 0;
          border-radius: 8px;

          h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
          }
        }

        .lesson-list {
          background: white;
          border: 1px solid #e9ecef;
          border-top: none;
          border-radius: 0 0 8px 8px;

          .lesson-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            border-bottom: 1px solid #f1f3f4;
            transition: all 0.3s ease;

            &:hover {
              background-color: #f8f9fa;
            }

            &:last-child {
              border-bottom: none;
            }

            &.premium {
              .lesson-title {
                color: #6c757d;
              }
            }

            .lesson-main {
              display: flex;
              align-items: center;
              flex: 1;

              .play-icon {
                color: #17a2b8;
                margin-right: 15px;
                font-size: 16px;
              }

              .lesson-title {
                color: #333;
                font-size: 15px;
                line-height: 1.4;
              }
            }

            .lesson-actions {
              display: flex;
              align-items: center;
              gap: 15px;

              .try-link {
                font-size: 14px;
                text-decoration: none;

                &:hover {
                  text-decoration: underline;
                }
              }

              .lesson-duration {
                color: #17a2b8;
                font-size: 14px;
                font-weight: 500;
                min-width: 50px;
                text-align: right;
              }
            }
          }
        }
      }
    }

    .course-sidebar {
      display: flex;
      flex-direction: column;
      gap: 20px;

      .video-preview {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

        .video-container {
          position: relative;

          .video-placeholder {
            aspect-ratio: 16/9;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            padding: 20px;

            .video-content {
              text-align: center;
              z-index: 2;

              .course-badge {
                background: rgba(255, 255, 255, 0.2);
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: bold;
                margin-bottom: 15px;
              }

              .video-stats {
                display: flex;
                flex-direction: column;
                gap: 5px;
                margin-bottom: 15px;

                span {
                  font-size: 14px;
                  font-weight: 600;
                }
              }

              .instructor-info {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 20px;
                font-size: 10px;

                .instructor-avatar {
                  width: 30px;
                  height: 30px;
                  background: rgba(255, 255, 255, 0.3);
                  border-radius: 50%;
                }
              }

              .watch-btn {
                background: #17a2b8;
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                font-weight: bold;

                &:hover {
                  background: #138496;
                }
              }
            }

            .play-button {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 60px;
              height: 60px;
              background: rgba(255, 255, 255, 0.9);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: all 0.3s ease;

              &:hover {
                background: white;
                transform: translate(-50%, -50%) scale(1.1);
              }

              .el-icon {
                font-size: 24px;
                color: #17a2b8;
              }
            }
          }

          .social-icons {
            position: absolute;
            bottom: 10px;
            right: 10px;
            display: flex;
            gap: 8px;

            .social-icon {
              width: 25px;
              height: 25px;
              border-radius: 4px;
              cursor: pointer;

              &.youtube {
                background: #ff0000;
              }

              &.facebook {
                background: #1877f2;
              }
            }
          }
        }
      }

      .pricing-section {
        background: white;
        padding: 25px;
        border-radius: 12px;
        text-align: center;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

        .price-display {
          margin-bottom: 20px;

          .current-price {
            font-size: 28px;
            font-weight: bold;
            color: #e74c3c;
          }

          .currency {
            font-size: 18px;
            color: #e74c3c;
            margin-left: 5px;
          }

          .original-price {
            display: block;
            font-size: 16px;
            color: #999;
            text-decoration: line-through;
            margin-top: 5px;
          }
        }

        .register-btn {
          width: 100%;
          background: #17a2b8;
          border: none;
          padding: 15px;
          font-size: 16px;
          font-weight: bold;
          border-radius: 8px;

          &:hover {
            background: #138496;
          }
        }
      }

      .course-stats {
        background: white;
        padding: 25px;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

        .stat-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 12px 0;
          border-bottom: 1px solid #f1f3f4;

          &:last-child {
            border-bottom: none;
          }

          .el-icon {
            color: #17a2b8;
            font-size: 20px;
          }

          .stat-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;

            .stat-label {
              color: #666;
              font-size: 14px;
            }

            .stat-value {
              color: #333;
              font-weight: 600;
              font-size: 14px;
            }
          }
        }
      }

      .social-share {
        display: flex;
        justify-content: center;
        gap: 15px;

        .social-item {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;

          .el-icon {
            color: white;
            font-size: 18px;
          }

          &.facebook {
            background: #1877f2;

            &:hover {
              background: #166fe5;
            }
          }

          &.twitter {
            background: #1da1f2;

            &:hover {
              background: #1a94da;
            }
          }

          &.pinterest {
            background: #bd081c;

            &:hover {
              background: #a70719;
            }
          }

          &.linkedin {
            background: #0077b5;

            &:hover {
              background: #006ba1;
            }
          }
        }
      }
    }
  }

  @media (max-width: 1024px) {
    .course-lecture {
      grid-template-columns: 1fr;
      gap: 20px;

      .course-sidebar {
        order: -1;

        .video-preview,
        .pricing-section,
        .course-stats {
          margin-bottom: 0;
        }
      }
    }
  }

  @media (max-width: 768px) {
    .course-lecture {
      padding: 15px;

      .lecture-content {
        padding: 20px;
      }

      .course-sidebar {
        .pricing-section,
        .course-stats {
          padding: 20px;
        }
      }
    }
  }
</style>