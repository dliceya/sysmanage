<template>
  <div class = "app-container">
    <ul>
      <li >请根据以下提示进行状态评估</li>
    </ul>
    <el-steps :active="active" finish-status="success">
      <el-step title="确认装备编号"></el-step>
      <el-step title="上传当前装备信息"></el-step>
      <el-step title="等待系统评估返回结果"></el-step>
    </el-steps>
    <el-row :gutter="20">
      <!--履历本列表数据-->
      <el-col :span="8" :xs="24">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
          <el-form-item label="装备编号" prop="num" >
            <el-input type="text" v-model="ruleForm.num" v-model.lazy='num' autocomplete="off"></el-input>
            <span>{{tip}}</span>
          </el-form-item>
          <el-form-item label="主模块状态" prop="mainStatus">
            <el-input type="text" v-model="ruleForm.mainStatus" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="从模块状态" prop="subStatus">
            <el-input type="text" v-model="ruleForm.subStatus" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="主模块温度" prop="tempratureMain">
            <el-input type="text" v-model="ruleForm.tempratureMain" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="从模块温度" prop="tempratureSub">
            <el-input type="text" v-model="ruleForm.tempratureSub" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="主模块输出电压" prop="voltageMainOut">
            <el-input type="text" v-model="ruleForm.voltageMainOut" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="主模块返回电压" prop="voltageMainBack">
            <el-input type="text" v-model="ruleForm.voltageMainBack" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="从模块输出电压" prop="voltageSubOut">
            <el-input type="text" v-model="ruleForm.voltageSubOut" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="从模块返回电压" prop="voltageSubBack">
            <el-input type="text" v-model="ruleForm.voltageSubBack" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">提交</el-button>
            <el-button @click="resetQuery()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!--履历本信息数据-->
      <el-col :span="16" :xs="24">
        <div id="charts" style="width: 600px;height:400px;"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import api from "../api/api";

  export default {
    name: "assess",
    watch: {
      num: function(val) {
        this.tip = '正在验证装备编号...'
        //调用后台接口验证用户名的合法性
        this.checkNum(val);
      }
    },

    data() {
      return {
        ruleForm:{},
        num: '',
        active: 0,
        //装备编号提示
        tip:'',


        rules: {
          voltageSubBack: [
            { required: true, message: "从模块返回电压不能为空", trigger: "blur" }
          ],
          mainStatus: [
            { required: true, message: "主模块状态不能为空", trigger: "blur" }
          ],
          subStatus: [
            { required: true, message: "从模块状态不能为空", trigger: "blur" }
          ],
          tempratureMain: [
            { required: true, message: "主模块温度不能为空", trigger: "blur" }
          ],
          tempratureSub: [
            { required: true, message: "从模块温度不能为空", trigger: "blur" }
          ],
          voltageMainOut: [
            { required: true, message: "主模块输出电压不能为空", trigger: "blur" }
          ],
          voltageMainBack: [
            { required: true, message: "主模块返回电压不能为空", trigger: "blur" }
          ],
          voltageSubOut: [
            { required: true, message: "从模块输出电压不能为空", trigger: "blur" }
          ],
        }
      }
    },
    methods:{
      checkNum(val){
        api.checkNum(val)
          .then(res => {
            if(res){
              this.tip = null;
              this.active++;
            }else {
              this.tip = '该装备不存在，请确认编号正确'
            }
          })
      },

      submitForm: function () {
        this.$refs["ruleForm"].validate(valid => {
          if (valid) {
            const status = this.randomNum(0, 10)
            var text = ''
            if (status > 8) {
              text = '良好'
            } else if (status > 5) {
              text = '较好'
            } else if (status > 2) {
              text = '请及时维修'
            } else {
              text = '不可用'
            }
            this.$confirm('该装备状态为：' + '" ' +text + ' "' + '点击继续查看该装备寿命视图', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.showEcharts()
            })
          }
        });
      },
      showEcharts(){
        var myChart = this.$echarts.init(document.getElementById('charts'));
        var date = [];
        date.push(this.randomNum(45000, 50000))
        date.push(this.randomNum(40000, 46000))
        date.push(this.randomNum(36000, 41000))
        date.push(this.randomNum(32000, 37000))
        date.push(this.randomNum(27000, 33000))
        date.push(this.randomNum(24000, 27000))
        date.push(this.randomNum(21000, 24000))

        // 指定图表的配置项和数据
        var option = {
          title: {
            text: '该装备寿命视图',
            subtext: '纯属虚构'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data:['寿命']
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['2010','2011','2012','2013','2014','2015','2016']
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            name: '寿命',
            type: 'line',
            smooth: true,
            data: date
          }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("ruleForm");
      },
    }
  }
</script>

<style scoped>
  .app-container{
    text-align: left;
  }
  #charts{
    left: 90px;
  }
</style>
