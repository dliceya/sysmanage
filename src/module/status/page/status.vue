<template>
  <div class = "app-container">
    <h2 style="text-align: center">装备状态视图</h2>
    <el-form ref="queryForm" :model="form" :inline="true" label-width="100px" :rules="rules">

      <el-form-item label="请选择装备" prop="name">
        <el-select  placeholder="请选择装备" v-model="form.name">
          <el-option
            v-for="item in equipList"
            :key="item.eid"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="装备编号" prop="num">
        <el-input
          v-model="form.num"
          placeholder="请输入装备编号"
          clearable
          size="small"
          style="width: 160px"
          @keyup.enter.native="handleQuery"></el-input>
      </el-form-item>

      <el-form-item label="记录范围">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 250px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <br>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <div id="charts" style="text-align: center;width: 600px;height:400px;" v-loading="loading"></div>

  </div>
</template>

<script>
  import api from "../api/status";

  export default {
    name: "status",
    created() {
      this.getEquip()
    },

    data() {
      return {
        equipList:[],
        dateRange:[],
        form: {},
        loading: false,

        rules: {
          name: [
            { required: true, message: "装备不能为空", trigger: "blur" }
          ],
          num: [
            { required: true, message: "装备编号不能为空", trigger: "blur" }
          ],
        }
      }
    },
    methods:{
      getEquip(){
        api.listEquip({pageNum:1, pageSize: 100}, this.dateRange).then(
          res => {
            this.equipList = res.equipList;
          }
        );
      },
      handleQuery: function () {
        this.$refs["queryForm"].validate(valid => {
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
            this.loading = true
            setTimeout(() => {
              this.loading = false;
            }, 2000);
            this.showEcharts()
          }
        })
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
          series : [
            {
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              data:[
                {value:this.randomNum(500, 800), name:'使用'},
                {value:this.randomNum(200, 300), name:'在修'},
                {value:this.randomNum(50, 100), name:'封存'},
              ]
            }
          ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
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
