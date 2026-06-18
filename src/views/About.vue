<template>
  <div class="about">
    <!-- Hero -->
    <section class="hero">
      <div class="hero__content">
        <span class="hero__tag">Về chúng tôi</span>

        <h1>
          Nơi kiến thức trở thành
          <span>hành trình phát triển</span>
        </h1>

        <p>
          Chúng tôi xây dựng nền tảng học trực tuyến giúp học viên tiếp cận
          kiến thức chất lượng từ các chuyên gia hàng đầu, học tập mọi lúc,
          mọi nơi và phát triển sự nghiệp bền vững.
        </p>

        <div class="hero__actions">
          <el-button type="primary" size="large" color="#F48C06">
            <RouterLink to="/course" style="text-decoration: none">
              <span style="color: white !important;">Khám phá khóa học</span>
            </RouterLink>
          </el-button>

          <el-button size="large">
            Tìm hiểu thêm
          </el-button>
        </div>
      </div>

      <div class="hero__image">
        <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
            alt=""
        />
      </div>
    </section>

    <!-- Stats -->
    <section class="stats">
      <div class="stat-card">
        <h2>120K+</h2>
        <p>Học viên đã đăng ký</p>
      </div>

      <div class="stat-card">
        <h2>3.400+</h2>
        <p>Khóa học chất lượng</p>
      </div>

      <div class="stat-card">
        <h2>850+</h2>
        <p>Giảng viên chuyên môn cao</p>
      </div>

      <div class="stat-card">
        <h2>4.8 ★</h2>
        <p>Đánh giá trung bình</p>
      </div>
    </section>

    <!-- Features -->
    <section class="section">
      <div class="section-header">
        <h2>Điều gì làm chúng tôi khác biệt?</h2>
        <p>
          Trải nghiệm học tập hiện đại, cá nhân hóa và tập trung vào kết quả.
        </p>
      </div>

      <div class="feature-grid">
        <el-card shadow="hover">
          <h3>Học tập linh hoạt</h3>
          <p>Học mọi lúc mọi nơi trên mọi thiết bị.</p>
        </el-card>

        <el-card shadow="hover">
          <h3>Giảng viên chuyên gia</h3>
          <p>Được hướng dẫn bởi những người có kinh nghiệm thực tế.</p>
        </el-card>

        <el-card shadow="hover">
          <h3>Chứng chỉ uy tín</h3>
          <p>Gia tăng giá trị hồ sơ và cơ hội nghề nghiệp.</p>
        </el-card>

        <el-card shadow="hover">
          <h3>Dự án thực tế</h3>
          <p>Áp dụng kiến thức vào các bài tập thực chiến.</p>
        </el-card>

        <el-card shadow="hover">
          <h3>Lộ trình rõ ràng</h3>
          <p>Từ cơ bản đến nâng cao với hướng dẫn chi tiết.</p>
        </el-card>

        <el-card shadow="hover">
          <h3>Cộng đồng hỗ trợ</h3>
          <p>Trao đổi kinh nghiệm và nhận hỗ trợ từ cộng đồng.</p>
        </el-card>
      </div>
    </section>

    <!-- Instructors -->
    <section class="section">
      <div class="section-header">
        <h2>Giảng viên nổi bật</h2>
        <p>Những chuyên gia được học viên đánh giá cao.</p>
      </div>

      <div class="teacher-list">
        <div class="teacher-card">
          <el-avatar :size="70">NM</el-avatar>
          <h4>Nguyễn Minh</h4>
          <span>Frontend Developer</span>
        </div>

        <div class="teacher-card">
          <el-avatar :size="70">TA</el-avatar>
          <h4>Trần Anh</h4>
          <span>Data Scientist</span>
        </div>

        <div class="teacher-card">
          <el-avatar :size="70">PH</el-avatar>
          <h4>Phạm Hưng</h4>
          <span>UI/UX Designer</span>
        </div>

        <div class="teacher-card">
          <el-avatar :size="70">LT</el-avatar>
          <h4>Lê Thu</h4>
          <span>Marketing Expert</span>
        </div>
      </div>
    </section>

    <!-- Timeline -->
    <section class="section">
      <div class="section-header">
        <h2>Hành trình học tập</h2>
      </div>

      <el-timeline>
        <el-timeline-item timestamp="Bước 1">
          Chọn khóa học phù hợp với mục tiêu của bạn.
        </el-timeline-item>

        <el-timeline-item timestamp="Bước 2">
          Học thông qua video, bài tập và tài liệu.
        </el-timeline-item>

        <el-timeline-item timestamp="Bước 3">
          Thực hành với dự án thực tế.
        </el-timeline-item>

        <el-timeline-item timestamp="Bước 4">
          Nhận chứng chỉ và nâng cao sự nghiệp.
        </el-timeline-item>
      </el-timeline>
    </section>

    <!-- CTA -->
    <section class="cta">
      <h2>Sẵn sàng bắt đầu hành trình học tập?</h2>

      <p>
        Tham gia cộng đồng học viên và phát triển kỹ năng ngay hôm nay.
      </p>

      <div class="cta__actions">
        <el-button type="primary" size="large" color="#F48C06">
          <RouterLink to="/course" style="text-decoration: none">
            <span style="color: white !important;">Khám phá khóa học</span>
          </RouterLink>
        </el-button>

        <el-button size="large">
          Trở thành giảng viên
        </el-button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
  .about {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 24px 80px;
  }

  .hero {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 60px;
    align-items: center;
    margin-bottom: 80px;

    &__tag {
      display: inline-block;
      padding: 8px 14px;
      border-radius: 999px;
      background: #f4f4f5;
      font-size: 14px;
      margin-bottom: 20px;
    }

    h1 {
      font-size: 52px;
      line-height: 1.15;
      margin-bottom: 24px;
      font-weight: 700;

      span {
        color: #F48C06;
      }
    }

    p {
      color: #666;
      font-size: 16px;
      line-height: 1.8;
      margin-bottom: 30px;
    }

    &__actions {
      display: flex;
      gap: 16px;
    }

    &__image img {
      width: 100%;
      border-radius: 24px;
      object-fit: cover;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
    }
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 90px;
  }

  .stat-card {
    text-align: center;
    padding: 32px 20px;
    border-radius: 20px;
    background: #fafafa;
    border: 1px solid #ebeef5;

    h2 {
      font-size: 36px;
      color: #F48C06;
      margin-bottom: 10px;
    }

    p {
      color: #777;
    }
  }

  .section {
    margin-bottom: 90px;
  }

  .section-header {
    text-align: center;
    margin-bottom: 40px;

    h2 {
      font-size: 36px;
      margin-bottom: 12px;
    }

    p {
      color: #777;
    }
  }

  .feature-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;

    h3 {
      margin-bottom: 10px;
    }

    p {
      color: #666;
      line-height: 1.7;
    }
  }

  .teacher-list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }

  .teacher-card {
    text-align: center;
    padding: 30px 20px;
    border: 1px solid #ebeef5;
    border-radius: 20px;
    transition: 0.3s;

    &:hover {
      transform: translateY(-6px);
    }

    h4 {
      margin-top: 16px;
      margin-bottom: 8px;
    }

    span {
      color: #777;
      font-size: 14px;
    }
  }

  .cta {
    text-align: center;
    padding: 60px;
    border-radius: 28px;
    background: linear-gradient(
        135deg,
        rgba(64, 158, 255, 0.08),
        rgba(64, 158, 255, 0.02)
    );

    h2 {
      font-size: 36px;
      margin-bottom: 16px;
    }

    p {
      color: #666;
      margin-bottom: 24px;
    }

    &__actions {
      display: flex;
      justify-content: center;
      gap: 16px;
    }
  }

  @media (max-width: 768px) {
    .hero,
    .stats,
    .feature-grid,
    .teacher-list {
      grid-template-columns: 1fr;
    }

    .hero h1 {
      font-size: 38px;
    }

    .cta {
      padding: 40px 20px;
    }
  }
</style>