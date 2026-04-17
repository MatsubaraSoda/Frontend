import axios from 'axios'

// Vite 会根据你运行的命令自动加载对应的变量
// npm run dev -> 加载 .env.development
// npm run build -> 加载 .env.production
const baseURL = import.meta.env.VITE_API_BASE_URL

const service = axios.create({
  baseURL: baseURL,
  timeout: 5000,
})

service.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('网络异常：', error)
    return Promise.reject(error)
  },
)

export default service