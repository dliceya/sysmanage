import http from './public'
let sysConfig = require('@/../config/sysConfig')
let apiUrl = sysConfig.xcApiUrlPre;

export default {
  getjwt() {
    return http.requestQuickGet('auth/userjwt')
  }
}



