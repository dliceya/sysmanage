<template>
  <div class="page bgc-f4f4f4">
    <!--路由返回-->
    <!--<lisa-header title="扫描二维码"></lisa-header>-->
    <br>
    <br>
    <br>
    <el-input v-model="tipMsg" placeholder="请输入内容"></el-input>
    <el-button type="primary" @click="openScan">开始识别</el-button>
    <el-button type="primary" @click="resetScan()">重试</el-button>
    <video ref="video" id="video" class="video vjs-fluid" autoplay></video>
  </div>
</template>

<script>
  import { MessageBox } from 'mint-ui'
  import { BrowserMultiFormatReader } from '@zxing/library'
  export default {
    name: 'qr-code-search',
    components: {},
    data() {
      return {
        codeReader: new BrowserMultiFormatReader(),
        textContent: null,
        tipMsg: '点击按钮开始识别',
      }
    },
    created() {
      // this.tipShow = true
      //this.openScan()
    },
    methods: {
      bellBtnClick(s) {
        if (navigator.vibrate) {
          navigator.vibrate(s);                 //震动秒数
        }else if (navigator.webkitVibrate) {
          navigator.webkitVibrate(s);
        }
      },
      resetScan(){
        this.codeReader.reset() // 重置
        this.textContent = null // 重置
        //this.codeReader.close();
        //this.openScan();
      },
      closeScan(){
        this.codeReader.close();
      },
      openScan() {
        const that = this;
        that.codeReader.getVideoInputDevices().then((videoInputDevices) => {
          that.tipMsg = '正在调用后置摄像头...'
          console.log('videoInputDevices', videoInputDevices);
          // 默认获取第一个摄像头设备id
          let firstDeviceId = videoInputDevices[0].deviceId;
          // 获取第一个摄像头设备的名称
          const videoInputDeviceslablestr = JSON.stringify(videoInputDevices[0].label);
          if (videoInputDevices.length > 1) {
            // 判断是否后置摄像头
            if (videoInputDeviceslablestr.indexOf('back') > -1) {
              firstDeviceId = videoInputDevices[0].deviceId;
            } else {
              firstDeviceId = videoInputDevices[1].deviceId;
            }
          }
          that.decodeFromInputVideoFunc(firstDeviceId)
        }).catch((err) => {
          that.tipShow = false
          console.error(err);
        });
      },
      decodeFromInputVideoFunc(firstDeviceId) {
        const that = this
        that.codeReader.decodeFromInputVideoDeviceContinuously(firstDeviceId, 'video', (result, err) => {
          that.tipMsg = '正在尝试识别...'
          // let nowContent = null
          that.textContent = null
          if (result) {
            that.bellBtnClick(300)
            that.textContent = result.text;
            var confirmText = ['"text":  '+ that.textContent, '"QrCode": ' + JSON.stringify(result)];
            const newDatas = [];
            const h = this.$createElement
            for (const i in confirmText) {
              newDatas.push(h('p', null, confirmText[i]))
            }
            that.$confirm(
              '提示',
              {
                title: '识别成功',
                message: h('div', null, newDatas),
                showCancelButton: true,
                confirmButtonText: '继续识别',
                cancelButtonText: '退出',
                type: 'warning'
              }
            ).then(() => {
              that.reset();
              that.$message({
                type: 'success',
                message: '开始识别!'
              });
            }).catch(() => {
              that.$message({
                type: 'info',
                message: '退出成功'
              });
            });

          }
          if (err && !(err)) {
            that.$alert('摄像头权限获取失败，请稍后重试', '错误', {
              confirmButtonText: '确定',
              callback: action => {
                that.$message({
                  type: 'info',
                  message: `摄像头权限获取失败`
                });
              }
            });
          }
        });
      },
    }
  }
</script>

<style scoped>
  /*vjs-fluid 自适video 长宽*/
  .video{
    top: 100px;
    border: 1px solid gray;
    margin-top: .5rem;
    width: 300px;
    height: 300px;
  }
  .tip{
    color: white;
    font-size: .16rem;
  }
  /* common */
  .bgc-f4f4f4{
    background-color: #363636;
  }
  .page{
    overflow-y: auto;
    position: relative;
  }
</style>
