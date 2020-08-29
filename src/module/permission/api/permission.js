import http from './../../../base/api/public'
import querystring from 'querystring'
let sysConfig = require('@/../config/sysConfig')


export default {
  //等待通知
  pull(){
    return http.requestQuickGet('/server/pull')
  }
}

