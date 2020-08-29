<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="登录地址" prop="ipaddr">
        <el-input
          v-model="queryParams.loginLocation"
          placeholder="请输入登录地址"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"></el-input>
      </el-form-item>
      <el-form-item label="用户名称" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-switch
      style="display: block"
      v-model="queryParams.status"
      active-color="#13ce66"
      active-text="在线用户"
      active-value="1"
      @change="getList()"
      inactive-value="0"
      inactive-text="登录日志">
    </el-switch>



    <el-table
      v-loading="loading"
      :data="listOnline"
      style="width: 100%;"
    >
      <el-table-column label="序号" type="index" align="center">
          <span>00</span>
      </el-table-column>
      <el-table-column label="会话编号" align="center" prop="tokenId" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="登录名称" align="center" prop="userName" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="部门名称" align="center" prop="deptName"></el-table-column>
      <el-table-column label="主机" align="center" prop="ipaddr" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="登录地点" align="center" prop="loginLocation"></el-table-column>
      <el-table-column label="浏览器" align="center" prop="browser"></el-table-column>
      <el-table-column label="操作系统" align="center" prop="os"></el-table-column>
      <el-table-column label="登录时间" align="center" prop="loginTime" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.loginTime.substr(0, 16) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleForceLogout(scope.row)"
          >强退</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
  import api from "../api/online";

  export default {
    name: "online",
    data() {
      return {
        // 遮罩层
        loading: true,
        // 总条数
        total: 0,
        index1: 1,
        // 表格数据
        listOnline: [],
        // 查询参数
        queryParams: {
          loginLocation: undefined,
          userName: undefined,
          status: '1',
          pageNum: 1,
          pageSize: 10,
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询登录日志列表 */
      getList() {
        this.loading = true;
        api.list(this.queryParams).then(res => {
          this.listOnline = res.onlineList;
          this.total = res.total;
          this.loading = false;
        });
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      //分页大小改变
      handleSizeChange(val){
        this.queryParams.pageSize = val
        this.getList()
      },
      //当前页码改变
      handleCurrentChange(val){
        this.queryParams.pageNum = val
        this.getList()
      },
      /** 强退按钮操作 */
      handleForceLogout(row) {
        var element = this;
        element.$confirm('是否确认强退名称为"' + row.userName + '"的用户?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          api.makeLogout(row.tokenId).then(res=>{
            console.log(row.tokenId)
            console.log(row)
            if(res.success){
              element.$notify({
                title: '成功',
                message: '用户：' + row.userName + 'Token：' +  row.tokenId +  '已被强制退出',
                type: 'warning'
              });
              element.getList();
            }else{
              element.$notify({
                title: '失败',
                message: '用户：' + row.userName + 'Token：' +  row.tokenId +  '强制退出失败，请稍后重试！',
                type: 'error'
              });
              element.getList();
            }
          }).catch(res=>{
            element.$notify.warning({
              title: '退出失败',
              message: res.message,
              duration: 0
            });
          })
        })
      }
    }
  };
</script>
<style>
  .app-container{
    text-align: left;
  }
</style>
