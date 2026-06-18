<template>
  <div :class="['stat-card', color]">
    <div class="stat-content">
      <h3>{{ value }} <span :class="direction">({{ change }})</span></h3>
      <p>{{ title }}</p>
    </div>
    <div class="stat-chart">
      <!-- Placeholder for mini chart -->
      <canvas :id="'miniChart-' + title" height="40"></canvas>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  color: String,
  title: String,
  value: String,
  change: String,
  direction: String
})
</script>

<style scoped>
.stat-card {
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  h3 {
    font-size: 20px;
    margin: 0;

    span {
      font-size: 14px;
      margin-left: 6px;
    }
  }

  p {
    margin: 4px 0 0;
    font-weight: 600;
    color: #666;
  }

  .stat-chart {
    margin-top: 10px;
  }
}

.stat-card.purple {
  border-left: 5px solid #7e57c2;
}
.stat-card.blue {
  border-left: 5px solid #42a5f5;
}
.stat-card.orange {
  border-left: 5px solid #ffa726;
}
.stat-card.red {
  border-left: 5px solid #ef5350;
}

.up {
  color: #4caf50;
}
.down {
  color: #e53935;
}
</style>
