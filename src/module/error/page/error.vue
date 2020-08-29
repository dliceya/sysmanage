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
          value-format="yyyy-MM-dd  HH:mm:ss"
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
    name: "error",
    created() {
      this.getEquip()
    },

    data() {
      return {
        data: {},
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

            api.error(this.form.name).then(res => {
              this.data = res;
            });

            this.loading = true;
            setTimeout(() => {
              this.loading = false;
              this.showEcharts();
            }, 2000);

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
          xAxis: {
            type: 'category',
              data: this.data.date,
              name: '时间',
          },
          yAxis: {
            type: 'value',
              name: '持续时长'
          },
          series: [{
            data: this.data.time,
            type: 'bar',
            stack: "业务",
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(220, 220, 220, 0.8)'
            },
            label: {   // 图形上的文本标签
              show: true,
              position: 'insideTop', // 相对位置
              rotate: 0,  // 旋转角度
              color: '#eee'
            }
          }]
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
