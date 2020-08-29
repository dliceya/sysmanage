import http from '@/base/api/public'

export default {
  list(query){
    return http.requestPost('ucenter/online', query)
  },

  makeLogout(token) {
    return http.requestQuickGet('auth/logout?token=' + token)
  }
}
