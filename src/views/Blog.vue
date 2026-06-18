<template>
  <div class="blog-page">
    <section class="hero">
      <h1>Kiến thức, kinh nghiệm và xu hướng mới nhất</h1>

      <p>
        Khám phá những bài viết hữu ích từ chuyên gia để nâng cao kỹ năng và phát
        triển sự nghiệp.
      </p>

      <el-input
          placeholder="Tìm kiếm bài viết..."
          size="large"
          :prefix-icon="Search"
          class="search-box"
      />
    </section>

    <section class="featured">
      <div class="featured__image">
        <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
            alt=""
        />
      </div>

      <div class="featured__content">
        <span class="category">Nổi bật</span>

        <h2>
          Cách xây dựng lộ trình học lập trình hiệu quả trong năm 2026
        </h2>

        <p>
          Một hướng dẫn toàn diện giúp bạn học tập đúng hướng, tiết kiệm thời
          gian và đạt mục tiêu nghề nghiệp nhanh hơn.
        </p>

        <el-button type="primary"  color="#F48C06">
          <span style="color: white !important;">Đọc bài viết</span>
        </el-button>
      </div>
    </section>

    <section class="categories">
      <el-tag
          v-for="item in categories"
          :key="item"
          round
          effect="plain"
          size="large"
      >
        {{ item }}
      </el-tag>
    </section>

    <section class="blog-grid">
      <el-card
          v-for="blog in blogs"
          :key="blog.id"
          shadow="hover"
          class="blog-card"
      >
        <img
            :src="blog.image"
            class="blog-card__image"
            alt=""
        >

        <div class="blog-card__body">
          <span class="blog-card__category">
            {{ blog.category }}
          </span>

          <h3>{{ blog.title }}</h3>

          <div class="blog-card__meta">
            <span>{{ blog.author }}</span>
            <span>{{ blog.date }}</span>
          </div>

          <el-button link type="primary">
            Xem chi tiết →
          </el-button>
        </div>
      </el-card>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { Search } from '@element-plus/icons-vue'

  const categories = [
    'Tất cả',
    'Lập trình',
    'Thiết kế',
    'Marketing',
    'AI',
    'Kinh doanh'
  ]

  const blogs = [
    {
      id: 1,
      title: 'Lộ trình học Java Backend từ con số 0',
      category: 'Lập trình',
      author: 'Nguyễn Văn A',
      date: '12/06/2026',
      image:
          'https://images.unsplash.com/photo-1515879218367-8466d910aaa4'
    },
    {
      id: 2,
      title: '10 nguyên tắc UI/UX giúp sản phẩm chuyên nghiệp hơn',
      category: 'Thiết kế',
      author: 'Trần Thị B',
      date: '10/06/2026',
      image:
          'https://images.unsplash.com/photo-1559028012-481c04fa702d'
    },
    {
      id: 3,
      title: 'AI sẽ thay đổi ngành công nghệ như thế nào?',
      category: 'AI',
      author: 'Lê Văn C',
      date: '08/06/2026',
      image:
          'https://images.unsplash.com/photo-1677442136019-21780ecad995'
    },
    {
      id: 4,
      title: 'SEO cơ bản cho người mới bắt đầu',
      category: 'Marketing',
      author: 'Phạm Văn D',
      date: '05/06/2026',
      image:
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f'
    }
  ]
</script>

<style scoped lang="scss">
  .blog-page {
    max-width: 1200px;
    margin: auto;
    padding: 40px 24px 80px;
  }

  .hero {
    text-align: center;
    margin-bottom: 80px;

    &__tag {
      display: inline-block;
      background: #f4f4f5;
      padding: 8px 16px;
      border-radius: 999px;
      margin-bottom: 20px;
    }

    h1 {
      font-size: 52px;
      font-weight: 700;
      max-width: 800px;
      margin: auto;
      line-height: 1.2;
    }

    p {
      max-width: 700px;
      margin: 20px auto 30px;
      color: #666;
      line-height: 1.8;
    }
  }

  .search-box {
    max-width: 600px;
    margin: auto;
  }

  .featured {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: center;
    margin-bottom: 60px;

    &__image img {
      width: 100%;
      height: 400px;
      object-fit: cover;
      border-radius: 20px;
    }

    .category {
      color: #F48C06;
      font-weight: 600;
    }

    h2 {
      margin: 16px 0;
      font-size: 36px;
      line-height: 1.3;
    }

    p {
      color: #666;
      margin-bottom: 24px;
      line-height: 1.8;
    }
  }

  .categories {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 50px;
  }

  .blog-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  .blog-card {
    overflow: hidden;
    border-radius: 20px;

    &__image {
      width: 100%;
      height: 240px;
      object-fit: cover;
    }

    &__body {
      padding-top: 10px;
    }

    &__category {
      color: #F48C06;
      font-size: 14px;
      font-weight: 600;
    }

    h3 {
      margin: 12px 0;
      line-height: 1.4;
    }

    &__meta {
      display: flex;
      justify-content: space-between;
      color: #999;
      margin-bottom: 16px;
      font-size: 14px;
    }
  }

  .newsletter {
    margin-top: 80px;
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

    &__form {
      max-width: 600px;
      margin: auto;
      display: flex;
      gap: 12px;
    }
  }

  @media (max-width: 768px) {
    .featured,
    .blog-grid {
      grid-template-columns: 1fr;
    }

    .hero h1 {
      font-size: 36px;
    }

    .newsletter__form {
      flex-direction: column;
    }
  }
</style>