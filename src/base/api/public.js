require('es6-promise').polyfill()
import axios from 'axios'

axios.defaults.withCredentials = true //跨域
axios.defaults.timeout = 10000
axios.defaults.headers.post['Content-Type'] = 'application/x-www=form-urlencoded'
import utils from '../../common/utils'
if(utils.getCookie('jwt')){
  axios.defaults.headers['Authorization'] = 'Bearer '+ utils.getCookie('jwt')
}
//axios.defaults.headers['Authorization'] = ''
// 请求之前拦截
// axios.interceptors.request.use(config => {
//   // 判断token
//   //if (localStorage.token) {
//     config.headers.Authorization = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJxcSI6IjE1ODE1NjMyNSIsInVpZCI6IjAwMSIsInVzZXJfbmFtZSI6ImRsaWNlIiwic2NvcGUiOlsiYXBwIl0sInBpZCI6IjAwMSIsInBvd2VyIjoidGVzdCIsImV4cCI6MTU4OTk5MDU4MywiYXV0aG9yaXRpZXMiOlsic3lzdGVtOm1hbmFnZSIsInN5c3RlbTptZW51Omxpc3QiLCJzeXN0ZW06ZGVwdDphZGQiXSwianRpIjoiNDNlYmVjNjEtMGRhYy00ZTUzLWFkOGUtODUzNDAxNGFjZjZhIiwiY2xpZW50X2lkIjoiWGNXZWJBcHAiLCJ1c2VybmFtZSI6ImRsaWNlIn0.JwR4oUiJyfVJrcXXeScEfKlcgbauR_2NPbxzC7Ycsx1LavOzeOjMDcWkFCZnTpPr4yVKViNU08P_zRbVPXluYgvLLLRDZVRkQlrwFJK-wmJTpXq_fvUdBHg_4LuOxcCMOtYvh6J0_9Nh4U17QvyebmChXH1itfvL2i5Tf4dkQBRqbo35dbIyUva6bntopBu_s5ncJh2xAw4aeKNOYB8A5EAScKQSuxXCP4Oxy6di6AuUKU1_g9tvQh4lTCtro8pUeCqkl17YdaxM4c_jcDymn9NyBAfT01O8j0h92xb-wn1Ec6nz6HvekfSsxhkAgZaPLXfRpAPu1b-VfFrjqYilVQ'
//   //}
//   return config
// },error =>{
//   alert("参数错误", 'fail')
//   return Promise.reject(error)
// })

export default {
  //get请求
  requestGet (url, params) {
    return new Promise((resolve, reject) => {
      axios.get(url, params).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  //get请求不带参数
  requestQuickGet (url) {
    return new Promise((resolve, reject) => {
      axios.get(url).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  //post请求
  requestPost (url, params = {}) {
    return new Promise((resolve, reject) => {
      axios.post(url, params).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  //post请求
  requestPostForm (url, params = {}) {
    return new Promise((resolve, reject) => {
      axios.post(url, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }).then(res => {
        resolve(res.data)//注意res是axios封装的对象，res.data才是服务端返回的信息
      }).catch(error => {
        reject(error)
      })
    })
  },
  //put请求
  requestPut (url, params = {}) {
    return new Promise((resolve, reject) => {
      axios.put(url, params).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  //delete请求
  requestDelete (url, params = {}) {
    return new Promise((resolve, reject) => {
      axios.delete(url, params).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}
