<template>
  <div>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { onMounted, watch, ref } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  selected: String
})

const chartCanvas = ref(null)
let chartInstance = null

const renderChart = () => {
  if (chartInstance) chartInstance.destroy()

  chartInstance = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          label: 'Visits',
          data: [190, 100, 160, 80, 200, 230, 120],
          borderColor: '#42a5f5',
          backgroundColor: 'rgba(66, 165, 245, 0.2)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Sales',
          data: [90, 60, 180, 140, 110, 180, 150],
          borderColor: '#4caf50',
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          fill: true,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })
}

onMounted(renderChart)
watch(() => props.selected, renderChart)
</script>

<style scoped>
canvas {
  width: 100% !important;
  max-height: 300px;
}
</style>