<template>
  <div class = "app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class = "aside-container">
          <el-input
            size="mini"
            placeholder="请输入部门名称"
            v-model="deptName"
            prefix-icon = "el-icon-search"
            clearable>
          </el-input>
        </div>
        <div class = "aside-container">
          <el-tree
            :filter-node-method="filterNode"
            :data="deptTree"
            accordion
            :props="defaultProps"
            highlight-current
            @node-click="handleNodeClick"
            ref="tree">
          </el-tree>
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
          <el-form-item label="用户名称" prop="username">
            <el-input
              v-model="queryParams.username"
              placeholder="请输入用户名称"
              clearable
              size="small"
              style="width: 160px"
              @keyup.enter.native="handleQuery"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input
              v-model="queryParams.phone"
              placeholder="请输入手机号码"
              clearable
              size="small"
              style="width: 160px"
              @keyup.enter.native="handleQuery"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="用户状态"
              clearable
              size="small"
              style="width: 160px"
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
          <el-col :span="1.5">
            <el-button
              type="info"
              icon="el-icon-upload2"
              size="mini"
              @click="handleImport"
            >导入</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
            >导出</el-button>
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange" width="100">
          <el-table-column type="selection" width="40" align="center"></el-table-column>
          <el-table-column label="用户名称" align="center" prop="username" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="用户昵称" align="center" prop="name" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="部门" align="center" prop="deptName"  :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="手机号码" align="center" prop="phone" width="120"></el-table-column>
          <el-table-column label="用户角色" align="center" prop="rid"></el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="data">
              <el-switch
                v-model="data.row.status"
                active-value="1"
                inactive-value="0"
                @change="handleStatusChange(data.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime" width="160">
            <template slot-scope="data">
              <span>{{ data.row.createTime.substr(0, 16)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="180"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改</el-button>
              <el-button
                v-if="scope.row.userId !== 1"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-key"
                @click="handleResetPwd(scope.row)"
              >重置</el-button>
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


      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" size="" class="dialog">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="name">
              <el-input v-model="form.name" placeholder="请输入用户昵称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归属部门" prop="pid">
              <treeselect v-model="form.pid" :options="deptTree" :normalizer="normalizer" placeholder="请选择归属部门"  />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号码" maxlength="11"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="qq" prop="qq">
              <el-input v-model="form.qq" placeholder="用于获取头像" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户名称" prop="username">
              <el-input v-model="form.username" placeholder="请输入用户名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.uid === undefined" label="用户密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入用户密码" type="password"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色">
              <el-select v-model="form.rid" placeholder="请选择">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.rid"
                  :label="item.roleName"
                  :value="item.rid"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  import api from "../api/user";

  import treeUtil from '@/common/utils'
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  export default {
    name: "uCenter",
    components: { Treeselect },
    watch: {
      deptName(val) {
        this.$refs.tree.filter(val);
      }
    },
    data() {
      return {
        // 遮罩层
        loading: false,
        //选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        deptName: '',
        dateRange: '',

        //总条数
        total: 0,
        //当前页
        currentPage: 1,
        // 是否显示弹出层
        open: false,
        // 部门树选项
        deptOptions: undefined,
        //弹出层标题
        title: '',
        form: {
          uid: undefined,
          pid: undefined,
          username: undefined,
          password: undefined,
          name: undefined,
          qq: undefined,
          rid: undefined,
          phone: undefined,
          email: undefined,
          status: '0',
          remark: undefined,

        },
        queryParams: {
          pageNum: 1,
          pageSize: 5,
          username: undefined,
          phone: undefined,
          status: undefined,
          pid: undefined
        },
        userList: [],
        statusOptions: [{
          dictValue: "1",
          dictLabel: "正常",
        },{
          dictValue: "0",
          dictLabel: "停用",
        }],
        roleOptions: [],
        defaultProps: {
          children: "child",
          label: "deptName"
        },
        deptTree: [],

        //弹出层表单校验规则
        // 表单校验
        rules: {
          username: [
            { required: true, message: "用户名称不能为空", trigger: "blur" }
          ],
          name: [
            { required: true, message: "用户昵称不能为空", trigger: "blur" }
          ],
          pid: [
            { required: true, message: "归属部门不能为空", trigger: "blur" }
          ],
          password: [
            { required: true, message: "用户密码不能为空", trigger: "blur" }
          ],
          email: [
            { required: true, message: "邮箱地址不能为空", trigger: "blur" },
            {
              type: "email",
              message: "'请输入正确的邮箱地址",
              trigger: ["blur", "change"]
            }
          ],
          phone: [
            { required: true, message: "手机号码不能为空", trigger: "blur" },
            {
              pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
              message: "请输入正确的手机号码",
              trigger: "blur"
            }
          ]
        }
      }
    },
    created(){
      // 初始化部门列表树
      this.getTreeselect();
      //初始化用户列表
      this.getList();
    },
    mounted(){
      //初始化系统角色列表
      this.getroleOptions()
    },
    methods: {
      /** 查询用户列表 */
      getList() {
        this.resetqueryParams();
        this.loading = true;
        api.listUser(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
            this.userList = res.userlist;
            this.total = res.total;
            this.loading = false;
          }
        )
          .catch(e => {
            this.$notify({
              title: '错误',
              message: '获取用户列表失败，请稍后刷新重试' + e.message,
              type: 'error'
            });
          })
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      //部门列表选中操作
      handleNodeClick(data){
        this.queryParams.pid = data.pid;
        this.getList();
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
      /** 查询部门下拉树结构 */
      getTreeselect() {
        api.deptTree()
          .then(res => {
            if(res.success){
              this.deptTree = treeUtil.removeChild(res.deptTree)
            }
            else{
              this.$notify({
                title: '错误',
                message: '获取部门列表失败，请稍后刷新重试',
                type: 'error'
              });
            }
          }).catch(e => {
          this.$notify({
            title: '错误',
            message: '网络错误，获取部门列表失败' + e.message,
            type: 'error'
          });
        });
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.deptName.indexOf(value) !== -1;
      },

      /** 重置按钮操作 */
      resetQuery() {
        this.dateRange = []
        this.resetForm("queryForm");
        this.queryParams.pid = null
        this.getList();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.uid);
        this.single = selection.length != 1;
        this.multiple = !selection.length;
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加用户" + this.ids;
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const uid = row.uid || this.ids[0] + '';
        api.getUser(uid).then(res => {
          this.form = res;
          this.form.password = '';
          this.open = true;
          this.title = "修改用户" + res.name;
        });
      },
      /** 重置密码按钮操作 */
      handleResetPwd(row) {
        this.$prompt('请输入"' + row.name + '"的新密码', "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }).then(({ value }) => {
          api.reset(row.uid, value).then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '修改成功!新的密码是' + value
              });
            } else {
              this.$message({
                type: 'error',
                message: res.message
              });
            }
          });
        }).catch(() => {});
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            //更新用户
            if (this.form.uid != undefined) {
              api.updateUser(this.form)
                .then(res => {
                  if(res.success){
                    this.$message({
                      type: 'success',
                      message: '修改成功!'
                    });
                    this.getList();
                    this.open = false;
                  }else {
                    this.$message({
                      type: 'error',
                      message: '系统错误!' + res.message
                    });
                  }

                }).catch(e =>{
                this.$message({
                  type: 'error',
                  message: '网络错误!' + res.message
                });
              })
              //添加用户
            } else {
              api.addUser(this.form)
                .then(res => {
                  if(res.success){
                    this.$message({
                      type: 'success',
                      message: '添加成功!'
                    });
                    this.getList();
                    this.open = false;
                  } else {
                    this.$message({
                      type: 'error',
                      message: res.message
                    });
                    this.open = false;
                  }
                })
                .catch(e => {
                  this.$message({
                    type: 'error',
                    message: '网络错误！添加用户失败 请稍后重试!'
                  });
                  this.open = false;
              })

              //       addUser(this.form).then(response => {
              //         if (response.code === 200) {
              //           this.msgSuccess("新增成功");
              //           this.open = false;
              //           this.getList();
              //         } else {
              //           this.msgError(response.msg);
              //         }
              //       });
              //     }
              //   }
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        var uids = new Array();
        if(row.uid){
          uids[0] = row.uid
        }else uids = this.ids
        this.$confirm('是否确认删除用户编号为"' + uids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return api.delUser(uids);
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
        // const queryParams = this.queryParams;
        // this.$confirm('是否确认导出所有用户数据项?', "警告", {
        //   confirmButtonText: "确定",
        //   cancelButtonText: "取消",
        //   type: "warning"
        // }).then(function() {
        //   return exportUser(queryParams);
        // }).then(response => {
        //   this.download(response.msg);
        // }).catch(function() {});
      },
      /** 导入按钮操作 */
      handleImport() {
        // this.upload.title = "用户导入";
        // this.upload.open = true;
      },
      // 用户状态修改
      handleStatusChange(row) {
        let text = row.status === "0" ? "启用" : "停用";
        this.$confirm('确认要"' + text + '""' + row.username + '"用户吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          //return changeUserStatus(row.userId, row.status);
          row.status = row.status === "0" ? "1" : "0";
          return true
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.status = row.status === "0" ? "1" : "0";
        });
      },
      //弹出层取消
      cancel() {
        this.open = false;

        this.reset();   //重置弹出层数据
      },
      //重置弹出层数据
      reset(){
        this.form = {
          uid: undefined,
          pid: undefined,
          username: undefined,
          password: undefined,
          name: undefined,
          qq: undefined,
          utype: undefined,
          phone: undefined,
          email: undefined,
          status: '0',
          remark: undefined,
          rid: undefined
        };
      },
      getroleOptions(){
        api.getRole()
          .then(res => {
            this.roleOptions = res.roleList;
          })
      },
      resetqueryParams(){
        if(this.queryParams.pid === '')this.queryParams.pid=undefined
        if(this.queryParams.username === '')this.queryParams.username=undefined
        if(this.queryParams.phone === '')this.queryParams.phone=undefined
        if(this.queryParams.status === '')this.queryParams.status=undefined
      },
      normalizer(node) {
        return {
          id: node.pid,
          label: node.deptName,
          children: node.child,
        }
      }
    },


  }
</script>

<style scoped>
  .dialog{
    line-height: 50px;
  }
  .app-container{
    line-height: 40px;
    text-align: left;
  }
  .el-form{
    text-align: left;
  }

</style>
