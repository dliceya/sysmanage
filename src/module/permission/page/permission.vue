<template>
  <div>
  <el-row>
    <el-col :span="3">心跳轮询：</el-col>
    <el-col :span="7">
      轮询间隔:
      <el-input v-model="time" placeholder="轮询间隔" style = "width: 200px"></el-input>
    </el-col>
    <el-col :span="10">
      操作：
      <el-button type="primary" @click="pull()">开始接收通知</el-button>
      <el-button type="primary" @click="stopPull()">停止接收通知</el-button>
    </el-col>
  </el-row>
  <br />
  <br />
  <el-input
    type="textarea"
    :rows="2"
    placeholder="请输入内容"
    style = "width: 600px"
    v-model="textarea">
  </el-input>

  <br />
  <hr />
  <br />
  <br />
  <el-row>
    <el-col :span="3">WebSocket：</el-col>
    <el-col :span="6">我的名字：<el-input v-model="from" placeholder="我的名字" style = "width: 200px"></el-input></el-col>
    <el-col :span="3"><el-button type="primary" @click="connection">连接服务器</el-button></el-col>
    <el-col :span="6">发送给：<el-input v-model="to" placeholder="对方名字" style = "width: 200px"></el-input></el-col>
    <el-col :span="3"><el-button type="primary" @click="sendMessage">发送</el-button></el-col>
    <el-col :span="3"><el-button type="primary" @click="closeSocket">关闭连接</el-button></el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-input
        type="textarea"
        :rows="15"
        placeholder="请输入内容"
        style = "width: 600px"
        v-model="toMess">
      </el-input>
    </el-col>
    <el-col :span="12">
      <el-input
        type="textarea"
        :rows="15"
        placeholder="等待接收"
        style = "width: 600px"
        v-model="fromMess">
      </el-input>
    </el-col>
  </el-row>
  </div>
</template>

<script>
  import api from '../api/permission'

    export default {
        name: "permission",
        data() {
          return {
            //timer
            time: 5,
            isNotice: undefined,
            textarea: '暂无通知...',

            //WebSocket
            from: '',
            to:'',
            fromMess:'',
            toMess:'',
            websocket: undefined,
          }
        },
      methods: {
        //timer
        pull(){
          this.isNotice = setInterval(this.pullMessage, this.time * 1000);
        },
        stopPull(){
          clearInterval(this.isNotice);
          this.isNotice = undefined
        },
        pullMessage(){
          api.pull()
            .then(res => {
              if(res.success === true){
                if(this.textarea === '暂无通知...'){
                  this.textarea = res.message;
                } else {
                  this.textarea = this.textarea + '=====>' + res.message;
                }
              }
            })
        },
        //WebSocket
        closeSocket(){
          if(this.websocket!=null){
            this.websocket.close();
            this.websocket = undefined;
          }
        },
        connection(){
          var element = this;
          var socket = undefined;
          if('WebSocket' in window){//支持不支持websocket
            if(socket === undefined) {
              var socket = new WebSocket("wss://www.dlice.xyz/websocket/" + this.from);
              element.websocket = socket;
            } else{
              element.$message({
                type: 'success',
                message: '服务器已连接!'
              });
            }
          }else{
            alert('当前设备不支持WebSocket');
          }
          socket.onopen = function(){
            element.$message({
              type: 'success',
              message: '服务器连接成功!'
            });
          }
          socket.onmessage = function(event){
            element.fromMess = element.fromMess + '\n' + event.data;
          }
          socket.onerror = function(){
            element.$message({
              type: 'error',
              message: '服务器异常!'
            });
          }
          socket.onclose = function(){
            element.$message({
              type: 'error',
              message: '连接已关闭!'
            });
          }
          window.onbeforeunload = function(){ //当浏览器的页面窗口关闭的时候,此处应该关闭链接防止服务器出现异常
            if(socket!=null){
              socket.close();
            }
          }
        },
        sendMessage(){
          if(this.websocket !== undefined){
            this.fromMess = this.fromMess + '\n' + this.from + ': ' + this.toMess;
            var data = '{"toUser":"'+this.to+'","toMessage":"'+this.toMess+'"}';
            this.websocket.send(data);
          }
        }
      }
    }
</script>
