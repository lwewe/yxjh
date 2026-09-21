import axios from 'axios'
import { Message } from 'element-ui'
import { GLOBAL_CONFIG } from '@/config/global'

// 创建 axios 实例
const request = axios.create({
  baseURL: GLOBAL_CONFIG.BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 添加 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }

    // 获取签名参数
    const timestamp = GLOBAL_CONFIG.getTimestamp()
    const sign = GLOBAL_CONFIG.generateSign()

    // 添加全局参数
    if (config.method === 'post' || config.method === 'put') {
      if (config.data instanceof FormData) {
        config.data.append('api_channel_no', GLOBAL_CONFIG.API_CHANNEL_NO)
        config.data.append('timestamp', timestamp)
        config.data.append('sign', sign)
      } else if (config.data instanceof URLSearchParams) {
        config.data.append('api_channel_no', GLOBAL_CONFIG.API_CHANNEL_NO)
        config.data.append('timestamp', timestamp)
        config.data.append('sign', sign)
      } else {
        config.data = {
          ...config.data,
          api_channel_no: GLOBAL_CONFIG.API_CHANNEL_NO,
          timestamp: timestamp,
          sign: sign
        }
      }
    } else if (config.method === 'get') {
      config.params = {
        ...config.params,
        api_channel_no: GLOBAL_CONFIG.API_CHANNEL_NO,
        timestamp: timestamp,
        sign: sign
      }
    }

    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data

    if (res.code === 200) {
      return res
    } else if (res.code === 401) {
      Message.error(res.msg || '登录已过期')
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      window.location.href = '/login'
      return Promise.reject(res)
    } else if (res.code === 402) {
      Message.error(res.msg || '令牌已过期')
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      window.location.href = '/login'
      return Promise.reject(res)
    } else if (res.code === 403) {
      Message.error(res.msg || '无权限访问')
      return Promise.reject(res)
    } else {
      Message.error(res.msg || '请求失败')
      return Promise.reject(res)
    }
  },
  error => {
    console.error('请求错误:', error)
    Message.error('网络请求失败，请稍后重试')
    return Promise.reject(error)
  }
)

export default request