import axios from 'axios'
import { Message } from 'element-ui'
import { router } from '../router/router'
import token from './token'
import cookie from './cookie'

setTimeout(() => {
  token()
}, 3500000)

// axios 配置
const ajaxUrl = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'testing' ? process.env.API_ROOT : undefined
axios.defaults.baseURL = ajaxUrl
// axios 配置
axios.defaults.timeout = 10000
// axios.defaults.withCredentials = true

let cancel = {}
let promiseArr = {}

// http request 拦截器
axios.interceptors.request.use(
  config => {
    // config.headers['Access-Control-Allow-Credentials'] = true
    if (promiseArr[config.url]) {
      // promiseArr[config.url]('操作取消')
      promiseArr[config.url] = cancel
    } else {
      promiseArr[config.url] = cancel
    }
    // 若是有做鉴权token , 就给头部带上token
    if (cookie.get('token')) {
      config.headers.Authorization = cookie.cookieToken()
    }
    return config
  },
  error => {
    return Promise.reject(error.data.error.message)
  }
)

// 返回状态判断(添加响应拦截器)
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = '错误请求'
          break
        case 401:
          router.push('/login')
          error.message = '未授权，请重新登录'
          break
        case 403:
          router.push('/403')
          error.message = '拒绝访问'
          break
        case 404:
          error.message = '请求错误,未找到该资源'
          break
        case 405:
          error.message = '请求方法未允许'
          break
        case 408:
          error.message = '请求超时'
          break
        case 500:
          error.message = '服务器端出错'
          break
        case 501:
          error.message = '网络未实现'
          break
        case 502:
          error.message = '网络错误'
          break
        case 503:
          error.message = '服务不可用'
          break
        case 504:
          error.message = '网络超时'
          break
        case 505:
          error.message = 'http版本不支持该请求'
          break
        default:
          error.message = `连接错误${error.response.status}`
      }
    }
    if (error.message) {
      Message.error(error.message)
    }
    return Promise.reject(error.response)
  }
)

export default axios
