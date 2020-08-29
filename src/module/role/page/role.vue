<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          v-model="queryParams.roleName"
          placeholder="请输入角色名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"></el-input>
      </el-form-item>
      <el-form-item label="权限代码" prop="roleCode">
        <el-input
          v-model="queryParams.roleCode"
          placeholder="请输入权限代码"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="角色状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd  HH:mm:ss"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>

    </el-row>

    <el-table v-loading="loading" :data="roleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"></el-table-column>

      <el-table-column label="角色名称" prop="roleName" :show-overflow-tooltip="true" width="150"></el-table-column>
      <el-table-column label="角色代码" prop="roleCode" :show-overflow-tooltip="true" width="150"></el-table-column>
      <el-table-column label="状态" align="center" width="100" prop="status">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="1"
            inactive-value="0"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime.substr(0, 16) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" :show-overflow-tooltip="true" width="200"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-circle-check"
            @click="handlePermission(scope.row)"
          >权限修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="5"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色代码" prop="roleCode">
          <el-input v-model="form.roleCode" placeholder="请输入角色代码"></el-input>
        </el-form-item>

        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色数据权限对话框 -->
    <el-dialog :title="title" :visible.sync="openPermission" width="500px">
      <el-form :model="permission" label-width="80px" ref="form">
        <el-form-item label="角色名称">
          <treeselect
            :multiple="true"
            :options="permissionTree"
            :normalizer="normalizer"
            placeholder="选择要授予该角色的权限"
            v-model="permission.permissionList"></treeselect>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDataScope">确 定</el-button>
        <el-button @click="cancelDataScope">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  import api from '../api/role'
  import treeUtil from '@/common/utils'
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";

  export default {
    name: "role",
    components: { Treeselect },
    data() {
      return {
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 总条数
        total: 3,
        //当前页
        currentPage: 1,
        // 角色表格数据
        roleList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 是否显示弹出层（数据权限）
        openPermission: false,
        //系统权限树
        permissionTree:{},
        //授权弹出表单参数
        permission:{},
        // 日期范围
        dateRange: [],
        // 状态数据字典
        statusOptions: [{
          dictValue: '0',
          dictLabel: '停用'
        },{
          dictValue: '1',
          dictLabel: '启用'
        }],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 5,
          roleName: undefined,
          roleKey: undefined,
          status: undefined
        },
        // 表单参数
        form: {},
        defaultProps: {
          children: "children",
          label: "label"
        },
        // 表单校验
        rules: {
          roleName: [
            { required: true, message: "角色名称不能为空", trigger: "blur" }
          ],
          roleKey: [
            { required: true, message: "角色代码不能为空", trigger: "blur" }
          ],
          roleSort: [
            { required: true, message: "角色顺序不能为空", trigger: "blur" }
          ]
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询角色列表 */
      getList() {
        this.resetqueryParams();
        this.loading = true;
        api.listRole(this.addDateRange(this.queryParams, this.dateRange)).then(
          response => {
            this.roleList = response.roleList;
            this.total = response.total;
            this.loading = false;
          }
        );
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

      // 角色状态修改
      handleStatusChange(row) {
        let text = row.status === "1" ? "启用" : "停用";
        this.$confirm('确认要"' + text + '""' + row.roleName + '"角色吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return api.changeRoleStatus(row.rid, row.status);
        }).then((res) => {
          if(res === true){
            this.$message({
              type: 'success',
              message: text + '成功'
            });
          }else {
            this.$message({
              type: 'error',
              message: text + '失败：' + res.message
            });
          }

        }).catch(function() {
          row.status = row.status === "0" ? "1" : "0";
        });

      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 取消按钮（数据权限）
      cancelDataScope() {
        this.openPermission = false;
        this.resetPermission();
      },
      // 表单重置
      reset() {
        this.form = {
          rid: undefined,
          roleName: undefined,
          roleKey: undefined,
          roleSort: 0,
          status: "0",
          menuIds: [],
          deptIds: [],
          remark: undefined
        };
        this.resetForm("form");
      },
      resetPermission(){
        this.permission = {
          rid: undefined,
          permissionList: [],
        }
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.dateRange = [];
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.rid)
        this.single = selection.length!=1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加角色";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const rid = row.rid || this.ids[0]  + '';
        api.getRole(rid+'').then(res => {
          this.form = res
          this.open = true;
          this.title = "修改角色"
        });
      },
      /** 分配数据权限操作 */
      handlePermission(row) {
        //获取权限下拉树
        api.getPermissionList().then(res => {
          if(res){
            //获取当前角色权限并默认选中
            api.getCurrent(row.rid).then(res => {
              this.permission.permissionList = res;
            })
            this.resetPermission();
            this.openPermission = true;
            this.permission.rid = row.rid
            this.title = "分配数据权限";
            this.permissionTree= treeUtil.removeChild2(res)
          }else {
            this.$message({
              type: 'error',
              message: '获取系统权限树失败，请稍后重试'
            });
          }
        })

      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.rid != undefined) {
              api.updateRole(this.form).then(res => {
                if (res) {
                  this.$message({
                    type: 'success',
                    message: '修改成功'
                  });
                  this.open = false;
                  this.getList();
                } else {
                  this.$message({
                    type: 'error',
                    message: res.message
                  });
                }
              });
            } else {
              api.addRole(this.form).then(res => {
                if (res.success) {
                  this.$message({
                    type: 'success',
                    message: '新增成功'
                  });
                  this.openPermission = false;
                  this.getList();
                } else {
                  this.$message({
                    type: 'error',
                    message: '新增失败' + res.message
                  });
                }
              });
            }
          }
        });
      },
      /** 提交按钮（数据权限） */
      submitDataScope: function() {
        console.log(this.permission)
        api.auth(this.permission)
          .then(res => {
            if(res){
              this.$message({
                type: 'success',
                message: '授权成功, 该用户下次登录时权限修改生效'
              });
            }else {
              this.$message({
                type: 'error',
                message: '授权失败，请稍后重试'
              });
            }
          })
      },
      //重置请求参数
      resetqueryParams(){
        if(this.queryParams.username === '')this.queryParams.username=undefined
        if(this.queryParams.phone === '')this.queryParams.phone=undefined
        if(this.queryParams.status === '')this.queryParams.status=undefined
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const num= row.rid?1:this.ids.length
        var rids = new Array();
        if(row.rid){
          rids[0] = row.rid
        }else rids = this.ids

        this.$confirm('确认删除这' + num + '项数据吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return api.delRole(rids);
        }).then(res => {
          if(res)
            this.getList();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(function() {});
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有角色数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportRole(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
      },
      normalizer(node) {
        return {
          id: node.pid,
          label: node.remark,
          children: node.child,
        }
      }
    }
  };
</script>

<style>
  .app-container{
    text-align: left;
  }
</style>
