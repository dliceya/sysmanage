import http from '@/base/api/public'

export default {
  checkNum(val){
    return http.requestQuickGet('system/equip/check?num=' + val);
  }
}
