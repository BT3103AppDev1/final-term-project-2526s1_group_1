import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/global.css'

const app = createApp(App)

app.use(router)
app.use(createPinia()) // Optional: for state management
app.mount('#app')