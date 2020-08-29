// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import routes from './base/router'
import store from './vuex/store'
import Vuex from 'vuex'
import echarts from 'echarts'
// import cube from 'cube-ui'

//全局配置导入
Vue.config.productionTip = false;

//引入自定义权限校验指令
import permission from './common/permission'

//自定义全局方法引用
import { parseTime, addDateRange, resetForm, randomNum} from './common/utils'
import utilApi from './common/utils'
import systemApi from './base/api/system'
// import Mock from './mock'
// Mock.bootstrap();

//自定义全局方法挂载
Vue.prototype.parseTime = parseTime             //日期格式化
Vue.prototype.addDateRange = addDateRange       //添加时间范围
Vue.prototype.resetForm = resetForm             //重置表单字段
Vue.prototype.$echarts = echarts             //echarts挂载为全局组件
Vue.prototype.randomNum = randomNum           //重置表单字段



// 在Vue中全局使用mintui
Vue.use(ElementUI)
Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(permission)

//将vue-resource在vue中绑定，自动在vue对象实例上注入一个$http对象就可以使用ajax方法了
import vueResource from 'vue-resource';
let Base64 = require('js-base64').Base64;
let sysConfig = require('@/../config/sysConfig')
let openAuthenticate = sysConfig.openAuthenticate
let openAuthorize = sysConfig.openAuthorize

Vue.use(vueResource);
/* eslint-disable no-new */
const router = new VueRouter({
  routes:routes
})

router.beforeEach((to, from, next) => {
  if(openAuthenticate){
    //!***********身份校验***************
    let activeUser
    let uid
    try{
      activeUser = utilApi.getActiveUser()
      uid = utilApi.getCookie("uid")
    }catch(e){
      //alert(e)
    }
    if(activeUser && uid /*&& uid == activeUser.uid*/) {
      next();
    }else if(to.path =='/login' || to.path =='/logout'){
      next();
    }else if(uid){
      //请求获取jwt
      systemApi.getjwt().then((res)=>{
        if(res.success){
          let jwt = res.jwt;
          utilApi.setCookie("jwt", res.jwt, 1200)
          let activeUser = utilApi.checkActiveUser(jwt)
          if(activeUser){
            utilApi.setSession("activeUser",JSON.stringify(activeUser))
          }
          next();

        }else{
          ElementUI.MessageBox.confirm(
            '登录状态已过期，您可以继续留在该页面，或者重新登录',
            '系统提示',
            {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'warning'
            }
          ).then(() => {
            router.push({ path: "/login" })
            })
        }
      })
    }else{
      //跳转到统一登陆
      ElementUI.MessageBox.confirm(
        '登录状态已过期，您可以继续留在该页面，或者重新登录',
        '系统提示',
        {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        router.push({ path: "/login" })
      })
    }
  }else{
    next();
  }

});
router.afterEach((to, from, next) => {
  if(openAuthorize){
    let activeUser
    try{
      activeUser = utilApi.getActiveUser();
    }catch(e){
      //alert(e)
    }
    if(activeUser && to.path !== '/login') {
      //权限校验
      let requiresAuth = to.meta.requiresAuth;
      let permission =to.meta.permission;
      if(requiresAuth && permission){
        utilApi.checkAuthorities(router,permission);
      }
    }
  }

});

import axios from 'axios'
import { Message } from 'element-ui';

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求向header添加jwt
  let jwt = utilApi.getJwt()
  if(jwt){
    config.headers['Authorization'] = 'Bearer '+jwt
    config.headers['ip'] = utilApi.getCookie('ip');
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});
// 响应拦截
axios.interceptors.response.use(data => {
  if(data && data.data){
    if(data.data.code && data.data.code ==='10001' || data.data.code ===10001){
      router.push({ path: "/login" })
    }else if(data.data.code && data.data.code === 10002 || data.data.code === '10002'){
      Message.error('演示账号！不允许增删改');
      return
    }else if(data.data.code && data.data.code ==='10003' || data.data.code ===10003){
      Message.error('认证被拒绝，请重新登录重试！');
      return
    }
  }
  return data
})

var app = new Vue({
  el: '#app',
  router,
  store,
  // template: '<App/>',
  // components: { App }
  render: c => c(App)
})
