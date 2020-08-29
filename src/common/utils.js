let SIGN_REGEXP = /([yMdhsm])(\1*)/g;
let DEFAULT_PATTERN = 'yyyy-MM-dd';

import jwtDecode from 'jwt-decode'
import { Message } from 'element-ui';
import Cookies from 'js-cookie'

// 转换字符串，undefined,null等转化为""
export function praseStrEmpty(str) {
  if (!str || str == "undefined" || str == "null") {
    return "";
  }
  return str;
}

// 表单重置
export function resetForm(refName) {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields();
  }
}

//生成固定范围的随机数
export function randomNum(minNum,maxNum){
  return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
}

//格式化日期格式
export function parseTime(time, pattern) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
  let date = new  Date(time);
  //date.setTime(parseInt(BigInt(date.getTime()) + BigInt(8 * 60 * 60 * 1000 * 0)));
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

// 添加日期范围
export function addDateRange(params, dateRange) {
  var search = params;
  search.beginTime = null;
  search.endTime = null;
  if (null != dateRange && '' != dateRange) {
    search.beginTime = this.dateRange[0];
    search.endTime = this.dateRange[1];
  }
  return search;
}



function padding(s, len) {
  var len = len - (s + '').length;
  for (var i = 0; i < len; i++) {
    s = '0' + s;
  }
  return s;
};

export default {
  // getActiveUser:function(){
  //   let activeUserStr = this.getUserSession("activeUser");
  //   return JSON.parse(activeUserStr);
  // },
  getActiveUser: function(){
    let uid = this.getCookie("uid")
    if(uid){
      let activeUserStr = this.getUserSession("activeUser");
      var activeUser = JSON.parse(JSON.parse(activeUserStr))
      return activeUser
    }else{
      this.delUserSession("activeUser")
    }
  },
//获取jwt令牌
  getJwt : function(){
    let activeUser = this.getActiveUser()
    if(activeUser){
      return activeUser.jwt
    }
  },
  //解析jwt令牌
  getUserFromJwt(jwt){
    if(!jwt){
      return
    }
    return checkActiveUser(jwt);
  },
  checkActiveUser:function(jwt){
    if (jwt ) {
      var jwtDecodeVal = jwtDecode(jwt);
      if (jwtDecodeVal) {
        let activeUser={}
        console.log(jwtDecodeVal)
        activeUser.uid = jwtDecodeVal.uid || '';
        activeUser.username = jwtDecodeVal.username || '';
        activeUser.power = jwtDecodeVal.power || '';
        activeUser.pid = jwtDecodeVal.pid || '';
        activeUser.authorities = jwtDecodeVal.authorities || '';
        activeUser.qq = jwtDecodeVal.qq || '';
        activeUser.menus = jwtDecodeVal.menus || '';
        this.setSession("activeUser",JSON.stringify(activeUser))
        return this.getUserSession("activeUser")
      }

    }
    return null;
  },
  checkAuthorities: function(router,permission){
    if(permission !='Login' && permission !='Logout'){//校验权限
      let activeUser = this.getActiveUser()
      let authorities = activeUser.authorities;
      if (!authorities) {
        this.$confirm('您没有获取操作授权信息，是否重新登录？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '请重新登录!'
          });
          //跳转到登录页面
          this.$router.push({ path: "/login" });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '您可以稍后重新登录，但可能无法进行任何操作'
          });
        });

      }
      var ret1 = authorities.find((value, index, arr) => {
        return value == permission;
      })
      if (!ret1) {
        this.$notify({
          title: '无法更改！',
          message: '您没有被授权进行此操作',
          type: 'error'
        });
      }
    }
  },
  checkmenu(routeValue,authorities){
    if(routeValue.meta && routeValue.meta.permission){
      let permission = routeValue.meta.permission
      // console.log(routeValue);
      var ret1 = authorities.find((value, index, arr) => {
        return value == permission;
      })
      if (!ret1) {
        //将菜单 隐藏
        routeValue.hidden = true
      }
    }
  },

  getCookie: function (name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
      return (arr[2]);
    else
      return null;
  },

  setCookie: function (c_name, value, expiredays) {
    var exdate = new Date();
    var time = exdate.getTime();
    time = BigInt(time) + BigInt(1200 * 1000);
    exdate.setTime(parseInt(time));

    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toUTCString());
  },
  delCookie: function (name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    document.cookie = name + "=" + cval + ";expires=" + exp.toUTCString();
  },
  setSession: function (key, value) {
    return sessionStorage.setItem(key, value);
  },
  getUserSession: function (key) {
    return sessionStorage.getItem(key);
  },
 delUserSession: function (key) {
    return sessionStorage.removeItem(key)
  },
  getQueryStringByName: function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    var context = "";
    if (r != null)
      context = r[2];
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined" ? "" : context;
  },



  formatDate: function (date, pattern) {
    pattern = pattern || DEFAULT_PATTERN;
    return pattern.replace(SIGN_REGEXP, function ($0) {
      switch ($0.charAt(0)) {
        case 'y':
          return padding(date.getFullYear(), $0.length);
        case 'M':
          return padding(date.getMonth() + 1, $0.length);
        case 'd':
          return padding(date.getDate(), $0.length);
        case 'w':
          return date.getDay() + 1;
        case 'h':
          return padding(date.getHours(), $0.length);
        case 'm':
          return padding(date.getMinutes(), $0.length);
        case 's':
          return padding(date.getSeconds(), $0.length);
      }
    });
  },
  parseDate: function (dateString, pattern) {
    var matchs1 = pattern.match(SIGN_REGEXP);
    var matchs2 = dateString.match(/(\d)+/g);
    if (matchs1.length == matchs2.length) {
      var _date = new Date(1970, 0, 1);
      for (var i = 0; i < matchs1.length; i++) {
        var _int = parseInt(matchs2[i]);
        var sign = matchs1[i];
        switch (sign.charAt(0)) {
          case 'y':
            _date.setFullYear(_int);
            break;
          case 'M':
            _date.setMonth(_int - 1);
            break;
          case 'd':
            _date.setDate(_int);
            break;
          case 'h':
            _date.setHours(_int);
            break;
          case 'm':
            _date.setMinutes(_int);
            break;
          case 's':
            _date.setSeconds(_int);
            break;
        }
      }
      return _date;
    }
    return null;
  },
  removeChild(tree) {
    tree.forEach(one => one.child.forEach(two => two.child.forEach(item =>delete item.child)));
    return tree
  },

  removeChild2(tree) {
    tree.forEach(one => one.child.forEach(item =>delete item.child));
    return tree
  },

}
