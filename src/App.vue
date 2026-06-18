<script setup lang="ts">
  import { RouterView } from 'vue-router'
  import { onMounted } from 'vue'
  import useAuthentication from '@/stores/Authentication'

  const authStore = useAuthentication()

  onMounted(async () => {
    await authStore.initialize()
  })
</script>

<template>
  <router-view />
</template>
