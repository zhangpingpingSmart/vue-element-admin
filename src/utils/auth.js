import Cookies from 'js-cookie'

const TokenKey = 'token'
const MenusKey = 'menus'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getMenus() {
  return Cookies.get(MenusKey)
}

export function setMenus(menus) {
  return Cookies.set(MenusKey, menus)
}

export function removeMenus() {
  return Cookies.remove(MenusKey)
}
