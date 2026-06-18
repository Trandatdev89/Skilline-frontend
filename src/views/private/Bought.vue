<template>
  <div class="course-page">
    <div class="container">
      <el-breadcrumb separator="•" class="breadcrumb">
        <el-breadcrumb-item>Trang chủ</el-breadcrumb-item>
        <el-breadcrumb-item>Khóa học đã mua</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="course-grid">
        <template
          v-if="listCourse && listCourse.length > 0"
          v-for="course in listCourse"
          :key="course.id">
          <CardUi
            @click="handleToLecture(course.id)"
            :img="course?.thumbnail_url"
            :title="course.title"
            :content-course="course" />
        </template>
        <template v-else>
          <div>Bạn chưa mua khóa nào</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import CardUi from '@/components/card/CardUi.vue'
import EnrollmentApi from '@/api/EnrollmentApi.js'

const router = useRouter()

const listCourse = ref<any>([])

const getListCourse = async () => {
  let res = await EnrollmentApi.getListCourseUserBought()
  listCourse.value = res.data
}

const handleToLecture = (courseId: number) => {
  router.push(`/lecture?courseId=${courseId}`)
}

onMounted(() => {
  getListCourse()
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

  .course-grid {
    display: flex;
    gap: 30px;
  }

  .course-card {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    }

    .card-header {
      position: relative;
      height: 280px;
      padding: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      overflow: hidden;

      &.c-programming {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1" fill="%23ffffff" opacity="0.1"/><circle cx="80" cy="40" r="1" fill="%23ffffff" opacity="0.08"/><circle cx="40" cy="80" r="1" fill="%23ffffff" opacity="0.12"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
        }
      }

      &.python-course {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        color: white;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23ffffff" opacity="0.1"/><circle cx="75" cy="45" r="1" fill="%23ffffff" opacity="0.08"/><circle cx="45" cy="75" r="1" fill="%23ffffff" opacity="0.12"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
        }
      }

      .discount-badge {
        position: absolute;
        top: 20px;
        right: 20px;
        background: #00ff88;
        color: #000;
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: bold;
        font-size: 14px;
      }

      .hot-badge {
        position: absolute;
        top: 20px;
        left: 20px;
        background: #00d4ff;
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: bold;
        font-size: 12px;
      }

      .course-info {
        flex: 1;
        z-index: 2;

        .course-title {
          margin-bottom: 25px;

          h1, h2, h3 {
            margin: 0;
            line-height: 1.2;
          }

          h1 {
            font-size: 2.5rem;
            font-weight: 900;
            color: #ffd700;
          }

          h2 {
            font-size: 1.8rem;
            font-weight: 800;
          }

          h3 {
            font-size: 1rem;
            font-weight: 600;
            opacity: 0.9;
          }
        }

        .course-features {
          list-style: none;
          padding: 0;
          margin: 0;

          li {
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 500;
            opacity: 0.95;
          }
        }

        .register-btn {
          margin-top: 20px;
          background: #00ff88;
          border: none;
          color: #000;
          font-weight: bold;
          padding: 12px 24px;
          border-radius: 8px;

          &:hover {
            background: #00e077;
          }
        }
      }

      .course-illustration {
        flex-shrink: 0;
        width: 200px;
        height: 200px;
        position: relative;
        z-index: 1;

        .logo-h {
          position: absolute;
          top: 20px;
          left: 20px;
          width: 50px;
          height: 50px;
          background: #00ff88;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: bold;
          color: #000;
        }

        .refresh-icon {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .character-c, .character-python {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 120px;
          height: 120px;

          .laptop {
            width: 40px;
            height: 30px;
            background: #333;
            border-radius: 4px;
            position: absolute;
            bottom: 40px;
            left: 20px;

            &::after {
              content: '';
              width: 35px;
              height: 20px;
              background: #4a90e2;
              position: absolute;
              top: 5px;
              left: 2.5px;
              border-radius: 2px;
            }
          }

          .person {
            width: 30px;
            height: 40px;
            background: #ffd4a3;
            border-radius: 15px 15px 8px 8px;
            position: absolute;
            bottom: 50px;
            right: 30px;

            &::before {
              content: '';
              width: 20px;
              height: 20px;
              background: #8b4513;
              border-radius: 50%;
              position: absolute;
              top: -10px;
              left: 5px;
            }
          }

          .chair {
            width: 60px;
            height: 20px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 10px;
            position: absolute;
            bottom: 20px;
            left: 10px;
          }

          .plant {
            width: 15px;
            height: 25px;
            background: #4caf50;
            border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
            position: absolute;
            bottom: 15px;
            right: 10px;
          }
        }

        &.python-illustration {
          .python-logos {
            position: absolute;
            top: 10px;
            right: 10px;

            .python-logo {
              width: 30px;
              height: 30px;
              background: #ffd43b;
              border-radius: 50%;
              margin-bottom: 10px;
              position: relative;

              &::after {
                content: '🐍';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 16px;
              }
            }

            .ai-chip {
              background: rgba(255, 255, 255, 0.2);
              padding: 4px 8px;
              border-radius: 8px;
              font-size: 12px;
              font-weight: bold;
              text-align: center;
            }
          }

          .character-python {
            .person {
              background: #ffd4a3;

              &::before {
                background: #d4af37;
              }
            }

            .desk {
              width: 80px;
              height: 25px;
              background: #8b4513;
              border-radius: 8px;
              position: absolute;
              bottom: 20px;
              left: 5px;
            }

            .accessories {
              position: absolute;
              bottom: 45px;
              right: 10px;

              &::before {
                content: '☕';
                position: absolute;
                font-size: 12px;
              }

              &::after {
                content: '📱';
                position: absolute;
                right: -15px;
                font-size: 12px;
              }
            }
          }
        }
      }
    }

    .card-content {
      padding: 25px;

      h4 {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin: 0 0 20px 0;
        line-height: 1.4;
      }

      .course-stats {
        display: flex;
        gap: 20px;
        margin-bottom: 20px;

        .stat {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #666;

          .el-icon {
            font-size: 16px;
          }
        }
      }

      .price-section {
        display: flex;
        align-items: center;
        gap: 15px;

        .current-price {
          font-size: 20px;
          font-weight: bold;
          color: #e74c3c;
        }

        .original-price {
          font-size: 16px;
          color: #999;
          text-decoration: line-through;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .course-page {
    padding: 15px;

    .course-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }

    .course-card {
      .card-header {
        height: 240px;
        padding: 20px;
        flex-direction: column;
        text-align: center;

        .course-illustration {
          width: 150px;
          height: 150px;
          margin-top: 20px;
        }
      }

      .card-content {
        padding: 20px;

        .course-stats {
          flex-direction: column;
          gap: 10px;
        }
      }
    }
  }
}
</style>