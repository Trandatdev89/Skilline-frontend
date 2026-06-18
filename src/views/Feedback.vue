<template>
  <div class="feedback-page">
    <section class="hero">

      <h1>Hàng nghìn học viên đã phát triển sự nghiệp cùng chúng tôi</h1>

      <p>
        Những phản hồi chân thực từ học viên sau khi hoàn thành các khóa học
        trên nền tảng.
      </p>
    </section>

    <section class="stats">
      <div class="stat-card">
        <h2>120.000+</h2>
        <p>Học viên</p>
      </div>

      <div class="stat-card">
        <h2>4.8/5</h2>
        <p>Đánh giá trung bình</p>
      </div>

      <div class="stat-card">
        <h2>95%</h2>
        <p>Hài lòng với khóa học</p>
      </div>

      <div class="stat-card">
        <h2>3.400+</h2>
        <p>Khóa học chất lượng</p>
      </div>
    </section>

    <section class="featured">
      <el-card shadow="never">
        <div class="featured__quote">
          ❝
        </div>

        <p class="featured__content">
          Nhờ các khóa học thực tế và lộ trình rõ ràng, tôi đã chuyển ngành
          thành công sang lập trình Backend chỉ sau 8 tháng học tập.
        </p>

        <div class="featured__author">
          <el-avatar :size="60">NA</el-avatar>

          <div>
            <h4>Nguyễn Anh</h4>
            <span>Backend Developer</span>
          </div>
        </div>
      </el-card>
    </section>
    <section class="feedback-list">
      <el-card
          v-for="item in feedbacks"
          :key="item.name"
          shadow="hover"
          class="feedback-card"
      >
        <div class="feedback-card__header">
          <el-avatar>
            {{ item.name.charAt(0) }}
          </el-avatar>

          <div>
            <h4>{{ item.name }}</h4>
            <span>{{ item.role }}</span>
          </div>
        </div>

        <el-rate
            :model-value="item.rating"
            disabled
        />

        <p>
          {{ item.content }}
        </p>
      </el-card>
    </section>

    <section class="videos">
      <div class="section-title">
        <h2>Câu chuyện thành công</h2>
        <p>Lắng nghe chia sẻ từ học viên của chúng tôi</p>
      </div>

      <div class="video-grid">
        <div
            v-for="i in 3"
            :key="i"
            class="video-placeholder"
        >
          <el-icon size="48">
            <VideoPlay />
          </el-icon>

          <span>Video Feedback {{ i }}</span>
        </div>
      </div>
    </section>

    <section class="cta">
      <h2>Bạn sẽ là câu chuyện thành công tiếp theo?</h2>

      <p>
        Hãy bắt đầu hành trình học tập và phát triển kỹ năng ngay hôm nay.
      </p>

      <el-button type="primary" size="large" color="#F48C06">
        <RouterLink to="/course" style="text-decoration: none">
          <span style="color: white !important;">Khám phá khóa học</span>
        </RouterLink>
      </el-button>
    </section>
  </div>
</template>

<script setup lang="ts">
  const feedbacks = [
    {
      name: 'Nguyễn Văn A',
      role: 'Backend Developer',
      rating: 5,
      content:
          'Khóa học rất dễ hiểu, giảng viên nhiệt tình và có nhiều bài tập thực tế giúp tôi nâng cao kỹ năng nhanh chóng.'
    },
    {
      name: 'Trần Thị B',
      role: 'UI/UX Designer',
      rating: 5,
      content:
          'Nội dung được cập nhật thường xuyên, giao diện học tập thân thiện và hỗ trợ học viên rất tốt.'
    },
    {
      name: 'Lê Văn C',
      role: 'Marketing Executive',
      rating: 5,
      content:
          'Sau khi hoàn thành khóa học tôi đã áp dụng được ngay vào công việc và cải thiện hiệu suất đáng kể.'
    },
    {
      name: 'Phạm Văn D',
      role: 'Data Analyst',
      rating: 5,
      content:
          'Lộ trình học rõ ràng, bài giảng chất lượng và cộng đồng học viên rất năng động.'
    }
  ]
</script>

<style scoped lang="scss">
  .feedback-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 24px 80px;
  }

  .hero {
    text-align: center;
    margin-bottom: 80px;

    &__tag {
      display: inline-block;
      padding: 8px 16px;
      border-radius: 999px;
      background: #f5f7fa;
      margin-bottom: 20px;
    }

    h1 {
      font-size: 52px;
      font-weight: 700;
      line-height: 1.2;
      max-width: 850px;
      margin: auto;
    }

    p {
      color: #666;
      margin-top: 20px;
      max-width: 700px;
      margin-left: auto;
      margin-right: auto;
    }
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 80px;
  }

  .stat-card {
    text-align: center;
    padding: 32px;
    border-radius: 20px;
    background: #fafafa;
    border: 1px solid #ebeef5;

    h2 {
      color: #F48C06;
      font-size: 36px;
      margin-bottom: 8px;
    }

    p {
      color: #777;
    }
  }

  .featured {
    margin-bottom: 80px;

    .el-card {
      padding: 50px;
      border-radius: 24px;
      background: #f8fafc;
    }

    &__quote {
      font-size: 60px;
      line-height: 1;
      margin-bottom: 20px;
      color: #F48C06;
    }

    &__content {
      font-size: 22px;
      line-height: 1.8;
      margin-bottom: 30px;
    }

    &__author {
      display: flex;
      align-items: center;
      gap: 16px;

      span {
        color: #888;
      }
    }
  }

  .feedback-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    margin-bottom: 80px;
  }

  .feedback-card {
    border-radius: 20px;

    &__header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 16px;

      h4 {
        margin: 0;
      }

      span {
        color: #888;
        font-size: 14px;
      }
    }

    p {
      margin-top: 16px;
      color: #666;
      line-height: 1.8;
    }
  }

  .videos {
    margin-bottom: 80px;
  }

  .section-title {
    text-align: center;
    margin-bottom: 30px;

    h2 {
      margin-bottom: 10px;
    }

    p {
      color: #777;
    }
  }

  .video-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .video-placeholder {
    height: 240px;
    border-radius: 20px;
    border: 1px dashed #dcdfe6;
    background: #fafafa;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;

    cursor: pointer;
    transition: 0.3s;

    &:hover {
      transform: translateY(-4px);
    }
  }

  .cta {
    text-align: center;
    padding: 60px;
    border-radius: 24px;
    background: #f8fafc;

    h2 {
      margin-bottom: 16px;
    }

    p {
      color: #666;
      margin-bottom: 24px;
    }
  }

  @media (max-width: 768px) {
    .stats,
    .feedback-list,
    .video-grid {
      grid-template-columns: 1fr;
    }

    .hero h1 {
      font-size: 36px;
    }

    .featured .el-card {
      padding: 24px;
    }

    .featured__content {
      font-size: 18px;
    }
  }
</style>