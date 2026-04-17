import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createTerminal } from 'vue-web-terminal'

import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(createTerminal())

app.mount('#app')
