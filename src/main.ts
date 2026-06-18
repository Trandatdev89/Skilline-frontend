import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/style/app.scss'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'


import App from './App.vue'
import router from './router/route.ts'
import ElementPlus from 'element-plus'
import 'video.js/dist/video-js.css'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(ElementPlus)
app.use(router)

app.mount('#app')

