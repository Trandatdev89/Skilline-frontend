<template>
  <footer class="footer">
    <div class="footer__container">
      <div class="footer__top">
        <div class="footer__brand">
          <img :src="logo" alt="Skilline">

          <p>
            Nền tảng học trực tuyến giúp hàng nghìn học viên phát triển kỹ năng
            và nâng cao sự nghiệp.
          </p>
        </div>

        <div class="footer__links">
          <h4>Khám phá</h4>

          <a href="#">Khóa học</a>
          <a href="#">Giảng viên</a>
          <a href="#">Blog</a>
          <a href="#">Feedback</a>
        </div>

        <div class="footer__links">
          <h4>Hỗ trợ</h4>

          <a href="#">FAQ</a>
          <a href="#">Liên hệ</a>
          <a href="#">Điều khoản</a>
          <a href="#">Chính sách bảo mật</a>
        </div>

        <div class="footer__newsletter">
          <h4>Đăng ký nhận tin</h4>

          <p>
            Nhận thông tin về khóa học mới và ưu đãi mới nhất.
          </p>

          <div class="footer__form">
            <input
                style="border-radius: 5px"
                placeholder="Nhập email của bạn"
                size="large"
            />

            <el-button
                color="#F48C06"
                type="primary"
                size="large"
            >
              <span style="color: white">Đăng ký</span>
            </el-button>
          </div>
        </div>
      </div>

      <div class="footer__divider"></div>

      <div class="footer__bottom">
        <span>© 2026 Skilline. All rights reserved.</span>

        <div class="footer__bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms</a>
          <a href="#">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
  import logo from '@/assets/img/logo.png'
</script>

<style scoped lang="scss">

  input {
    border-radius: 999px;
    border: 1px solid #999;
    padding: 10px 20px;
  }

  .footer {
    background: #111827;
    opacity: 0.96;
    color: white;
    margin-top: 80px;

    &__container {
      max-width: 1280px;
      margin: auto;
      padding: 70px 24px 30px;
    }

    &__top {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr 1.5fr;
      gap: 50px;
    }

    &__brand {
      img {
        width: 130px;
        margin-bottom: 20px;
      }

      p {
        color: #9ca3af;
        line-height: 1.8;
        max-width: 320px;
      }
    }

    &__links {
      display: flex;
      flex-direction: column;
      gap: 12px;

      h4 {
        margin-bottom: 12px;
        font-size: 18px;
      }

      a {
        color: #9ca3af;
        text-decoration: none;
        transition: 0.2s;

        &:hover {
          color: white;
        }
      }
    }

    &__newsletter {
      h4 {
        margin-bottom: 12px;
      }

      p {
        color: #9ca3af;
        line-height: 1.7;
        margin-bottom: 18px;
      }
    }

    &__form {
      display: flex;
      gap: 12px;
    }

    &__divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.08);
      margin: 40px 0 25px;
    }

    &__bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;

      span {
        color: #9ca3af;
        font-size: 14px;
      }
    }

    &__bottom-links {
      display: flex;
      gap: 24px;

      a {
        color: #9ca3af;
        text-decoration: none;
        font-size: 14px;

        &:hover {
          color: white;
        }
      }
    }
  }

  @media (max-width: 992px) {
    .footer {
      &__top {
        grid-template-columns: 1fr;
        gap: 35px;
      }

      &__form {
        flex-direction: column;
      }

      &__bottom {
        flex-direction: column;
        gap: 16px;
        text-align: center;
      }
    }
  }
</style>