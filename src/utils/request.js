import axios from 'axios'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'

function showMessage(content, type = 'error', duration = 5000) {
  Message({
    message: content || '',
    type,
    duration
  })
}
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    config.headers = {}
    config.headers.I18N_LOCALE = 'zh_CN'
    if (getToken()) {
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const status = response.status
    const res = response.data
    if (status === 200) {
      if (res.status === 0 || res.status === '0') {
        return Promise.resolve(res)
      } else {
        showMessage(res.message)
        return Promise.reject(res)
      }
    } else {
      showMessage(res.message)
      return Promise.reject(res)
    }
  }
)

/**
 * 封装接口请求方法
 * @param url 域名后需补齐的接口地址
 * @param method 接口请求方式
 * @param params get 请求参数
 * @param data post 求参数
 */
const request = (url, method, params, data, headers) => {
  return service({
    url,
    method,
    params,
    data,
    headers
  })
}
export default request
