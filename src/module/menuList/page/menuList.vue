<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="菜单名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入菜单名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"></el-input>
      </el-form-item>
      <el-form-item label="Vue组件" prop="component">
        <el-input
          v-model="queryParams.component"
          placeholder="请输入组件名"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="菜单状态"
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

    <el-table v-loading="loading" :data="menulist" @selection-change="handleSelectionChange" stripe>
      <el-table-column type="selection" width="55" align="center"></el-table-column>

      <el-table-column label="菜单名称" prop="name" :show-overflow-tooltip="true" width="150"></el-table-column>
      <el-table-column label="使用组件" prop="component" :show-overflow-tooltip="true" width="150"></el-table-column>
      <el-table-column label="父级菜单" prop="parent" :show-overflow-tooltip="true" width="150"></el-table-column>
      <el-table-column label="图标" prop="icon" :show-overflow-tooltip="true" width="150"></el-table-column>
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
      <el-table-column label="备注" prop="remark" :show-overflow-tooltip="true" width="150"></el-table-column>
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
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="菜单名" prop="name">
          <el-input v-model="form.name" placeholder="请输入菜单名"></el-input>
        </el-form-item>
        <el-form-item label="菜单组件" prop="component">
          <el-input v-model="form.component" placeholder="请输入菜单组件"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="form.icon" placeholder="请输入图标"></el-input>
        </el-form-item>
        <el-form-item label="父级菜单"  width="400px">
          <el-select v-model="form.parent" clearable placeholder="请选择父菜单，不选为主菜单" >
            <el-option
              v-for="item in parentList"
              :key="item.mid"
              :label="item.name"
              :value="item.mid">
            </el-option>
          </el-select>
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
  </div>
</template>

<script>

  import api from '../api/menuList'
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";

  export default {
    name: "menuList",
    components: { Treeselect },
    data() {
      return {
        // 遮罩层
        loading: false,
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
        menulist: [{
          name: '角色管理',
          component: 'uCenter',
          parent: '系统管理',
          icon: 'el-icon-user',
          status: "1",
          createTime: "2020-5-16"

        }],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 是否显示弹出层（数据权限）
        openDataScope: false,
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

        // 菜单列表
        parentList:[],
        // 部门列表
        deptOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
        },
        // 表单参数
        form: {

        },
        defaultProps: {
          children: "children",
          label: "label"
        },
        // 表单校验
        rules: {
          name: [
            { required: true, message: "菜单名称不能为空", trigger: "blur" }
          ],
          component: [
            { required: true, message: "使用组件不能为空", trigger: "blur" }
          ],
          icon: [
            { required: true, message: "菜单图标不能为空", trigger: "blur" }
          ]
        }
      };
    },
    created() {
      this.getList();
      this.getMenuParent()
    },
    methods: {
      /** 查询菜单列表 */
      getList() {
        this.loading = true;
        api.listMenu(this.addDateRange(this.queryParams, this.dateRange)).then(
          res => {
            this.menulist = res.menuList;
            this.total = res.total;
            this.loading = false;
          }
        );
      },
      //查询系统主菜单列表
      getMenuParent() {
        api.getMenuParent().then(res => {
          this.parentList = res
        })
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
        this.$confirm('确认要' + text + '“' + row.name + '”菜单吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return api.changeMenuStatus(row.mid, row.status);
        }).then(() => {
          this.$message({
            type: 'success',
            message: text + '成功'
          });
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
        this.openDataScope = false;
        this.reset();
      },
      // 表单重置
      reset() {
        if (this.$refs.menu != undefined) {
          this.$refs.menu.setCheckedKeys([]);
        }
        this.form = {
          rid: undefined,
          name: undefined,
          icon: undefined,
          parent: undefined,
          status: "0",
          remark: undefined
        };
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
        this.ids = selection.map(item => item.mid)
        this.single = selection.length!=1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加菜单";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const mid = row.mid || this.ids[0]  + '';
        api.getMenuByid(mid+'').then(res => {
          this.form = res
          this.open = true;
          this.title = "修改角色"
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.mid != undefined) {
              console.log(this.form)
              api.updateMenu(this.form).then(res => {
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
              api.addMenu(this.form).then(res => {
                if (res.success) {
                  this.$message({
                    type: 'success',
                    message: '新增成功'
                  });
                  this.open = false;
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

      /** 删除按钮操作 */
      handleDelete(row) {
        const num= row.mid?1:this.ids.length
        var mids = [];
        if(row.mid){
          mids[0] = row.mid
        }else mids = this.ids

        this.$confirm('确认删除这' + num + '项数据吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return api.delMenu(mids);
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
      }
    }
  };
</script>

<style>
  .app-container{
    text-align: left;
  }
</style>
