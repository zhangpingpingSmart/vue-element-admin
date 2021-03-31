import request from '@/utils/request'

export function storeLogin(data) {
  return request(`/login/store`, 'post', {}, data)
}

export function storeRouters(storeId,data) {
  return request(`/menu/tree/${storeId}`, 'post', {}, data)
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
