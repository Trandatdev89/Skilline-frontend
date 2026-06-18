<template>
  <div class="dashboard">
    <section class="stats-grid">
      <StatCard color="purple" title="Khách hàng" value="12" change="-12.4%" direction="down" />
      <StatCard color="blue" title="Sản phẩm" value="10.4%" change="40.9%" direction="up" />
      <StatCard color="orange" title="Đơn hàng" value="2.49%" change="84.7%" direction="up" />
      <StatCard color="red" title="Thông tin" value="44" change="-23.6%" direction="down" />
    </section>

    <!-- Traffic Chart -->
    <section class="traffic-section">
      <div class="traffic-header">
        <h3>Thống kê doanh thu đơn hàng theo tháng</h3>
        <span class="sub">12 - 11- 2025</span>
        <div class="filter">
          <button :class="{ active: selected === 'Day' }" @click="selected = 'Day'">Day</button>
          <button :class="{ active: selected === 'Month' }" @click="selected = 'Month'">Month</button>
          <button :class="{ active: selected === 'Year' }" @click="selected = 'Year'">Year</button>
        </div>
      </div>
      <LineChart :selected="selected" />
    </section>

    <!-- Social Stats -->
    <section class="social-grid">
      <SocialCard platform="Facebook" followers="89K" posts="459" />
      <SocialCard platform="Twitter" followers="1.7K" posts="1.7K" />
      <SocialCard platform="LinkedIn" followers="500" posts="1.2K" />
      <SocialCard platform="Calendar" title="12+" posts="Appointments" />
    </section>

  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import SocialCard from './SocialCard.vue';
  import LineChart from './LineChart.vue';
  import StatCard from './StatCard.vue';

  const selected = ref('Month')
</script>

<style lang="scss" scoped>
  .dashboard {
    padding: 20px;
    background: #f5f6fa;
    font-family: 'Segoe UI', sans-serif;

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      .breadcrumb {
        color: #888;
        a {
          color: #3498db;
          text-decoration: none;
        }
      }
    }

    .stats-grid,
    .social-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .traffic-section,
    .traffic-sales,
    .user-table {
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      margin-bottom: 30px;
    }

    .traffic-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;

      .sub {
        color: #999;
        font-size: 14px;
      }

      .filter button {
        margin-left: 10px;
        padding: 5px 12px;
        border: none;
        border-radius: 6px;
        background: #e0e0e0;
        cursor: pointer;
        &.active {
          background: #5b6ef0;
          color: white;
        }
      }
    }
  }
</style>