import request from '@/utils/request'
import Cookies from "js-cookie";

const userKey = 'user'

export function storeLogin(data) {
  return request(`/login/store`, 'post', {}, data)
}

export function storeRouters(storeId,data) {
  return request(`/menu/tree/${storeId}`, 'post', {}, data)
}

export function getInfo(User) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { User }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

export function getUser() {
  return Cookies.get(userKey)
}

export function setUser(user) {
  return Cookies.set(userKey, user)
}

export function removeUser() {
  return Cookies.remove(userKey)
}
