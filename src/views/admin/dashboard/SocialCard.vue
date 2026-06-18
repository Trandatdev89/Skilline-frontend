<template>
  <div class="social-card" :class="platform.toLowerCase()">
    <div class="social-icon">
      <i :class="icon"></i>
    </div>
    <div class="social-content">
      <h4>{{ title || followers }}</h4>
      <p>{{ posts }} {{ postsLabel }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  platform: String,
  followers: String,
  posts: String,
  title: String
})

const icon = {
  Facebook: 'fab fa-facebook-f',
  Twitter: 'fab fa-twitter',
  LinkedIn: 'fab fa-linkedin-in',
  Calendar: 'fas fa-calendar-alt'
}[props.platform] || 'fas fa-chart-bar'

const postsLabel = props.platform === 'Calendar' ? '' : 'Posts'
</script>

<style scoped>
.social-card {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);

  .social-icon {
    font-size: 24px;
    margin-right: 15px;
  }

  .social-content h4 {
    margin: 0;
    font-size: 18px;
  }

  .social-content p {
    margin: 4px 0 0;
    color: #666;
  }
}

.facebook .social-icon { color: #3b5998; }
.twitter .social-icon { color: #1da1f2; }
.linkedin .social-icon { color: #0077b5; }
.calendar .social-icon { color: #f39c12; }
</style>

<!-- Make sure Font Awesome is loaded in your project for the icons -->