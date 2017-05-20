import * as axios from 'axios'

let vm = null

export const HOST = 'http://backend.linhao.me'
// export const HOST = 'http://localhost:3000'

export const http = axios.create({
  baseURL: HOST
})

http.interceptors.response.use((response) => {
  return response.data
}, (error) => {
  if (error.response.status === 401) {
    vm.$router.push({path: 'login', query: {next: vm.$route.path}})
  }
  return error
})

export const api = {
  initVm (vue) {
    vm = vue
  },
  // ==== 用户相关 ====
  setToken (token, noPrefix) {
    let prefix = 'JWT '
    if (noPrefix) {
      prefix = ''
    }
    let jwt = token ? prefix + token : ''
    http.defaults.headers.common['Authorization'] = jwt
    localStorage.setItem('token', jwt)
  },
  login (username, password) {
    return http.post('users/login', {username, password})
  },
  getCurrentUser () {
    return http.post('users/current')
  },
  getAllUsers (page, length) {
    return http.get('users', {params: {page, length}})
  },
  toggleUser (userId, state) {
    return http.post(`users/${userId}/active`, {
      active: state
    })
  },
  regUser (username, password, confirm, avatar) {
    return http.post('users', {
      username, password, confirm, avatar
    })
  },
  removeUser (userId) {
    return http.delete('users/' + userId)
  },
  checkUsername (username) {
    return http.post('users/exist', {username})
  },
  setRole (userId, isAdmin) {
    return http.post(`users/${userId}/admin`, {
      admin: isAdmin
    })
  },
  getAllAvatars () {
    return http.get('images/avatars')
  },
  getAllCovers () {
    return http.get('images/covers')
  },
  // ==== 歌单相关 ====
  getAllLists (page, length) {
    return http.get('lists', {
      params: { page, length }
    })
  },
  getAllListsOfUser (userId, page, length) {
    return http.get(`users/${userId}/lists`, {
      params: { page, length }
    })
  },
  createListForUser (userId, name, desc, cover) {
    return http.post(`users/${userId}/lists`, {name, desc, cover})
  },
  deleteList (listId) {
    return http.delete('lists/' + listId)
  },
  editList (listId, name, desc) {
    let param = {desc}
    name && (param.name = name)
    return http.put(`/lists/${listId}`, param)
  },
  addSongToList (listId, id, platform) {
    return http.post(`lists/${listId}/songs`, {id, platform})
  }
}
