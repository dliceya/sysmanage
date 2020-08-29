import http from './../../../base/api/public'
import querystring from 'querystring'
let sysConfig = require('@/../config/sysConfig')

export default {
  //登录方法
  login(postData) {
    return http.requestPost('auth/userlogin',postData)
  },

  //改密码
  reset(uid, pass){
    return request.requestQuickGet('ucenter/reset?uid=' + uid + '&password=' + pass)
  },

  //退出方法
  loginout() {
    return http.requestQuickGet('auth/logout?token=""')
  },

  //获取验证码
  getCodeImg() {
    return http.requestQuickGet('auth/captchaImage')
  },

  //获取系统菜单
  getMenuList(){
    return http.requestQuickGet('system/menu/menuList')
  },



}



