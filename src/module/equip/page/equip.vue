<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="装备名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入装备名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery">
        </el-input>
      </el-form-item>
      <el-form-item label="装备编号" prop="eNum">
        <el-input
          v-model="queryParams.enum"
          placeholder="请输入装备编号"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery">
        </el-input>
      </el-form-item>
      <el-form-item label="装备类型" prop="type">
        <el-input
          v-model="queryParams.type"
          placeholder="请输入装备类型"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery">
        </el-input>
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

    <el-table v-loading="loading" :data="equipList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"></el-table-column>

      <el-table-column label="装备编号" prop="enum" :show-overflow-tooltip="true" width="150"></el-table-column>
      <el-table-column label="装备名" prop="name" :show-overflow-tooltip="true" width="200"></el-table-column>
      <el-table-column label="装备类型" prop="type" :show-overflow-tooltip="true" width="150"></el-table-column>
      <el-table-column label="生产部门" prop="byId" :show-overflow-tooltip="true" width="150"></el-table-column>
      <el-table-column label="装备寿命" prop="life" :show-overflow-tooltip="true" width="150"></el-table-column>

      <el-table-column label="交付日期" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime.substr(0, 16) }}</span>
        </template>
      </el-table-column>
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

    <!-- 添加或修改装备对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="400px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="装备名" prop="name">
          <el-input v-model="form.name" placeholder="请输入装备名"></el-input>
        </el-form-item>
        <el-form-item label="装备编号" prop="enum">
          <el-input v-model="form.enum" placeholder="请输入装备编号"></el-input>
        </el-form-item>
        <el-form-item label="装备类型" prop="type">
          <el-input v-model="form.type" placeholder="请输入装备类型"></el-input>
        </el-form-item>
        <el-form-item label="预估寿命" prop="life">
          <el-input v-model="form.life" placeholder="请输入装备预估寿命"></el-input>
        </el-form-item>
        <el-form-item label="生产部门"  width="400px" prop="byId">
          <treeselect v-model="form.byId" :options="deptTree" :normalizer="normalizer" placeholder="请选择归属部门"  />
        </el-form-item>

        <el-form-item label="生产日期" prop="createTime">
          <el-date-picker
            v-model="form.createTime"
            align="right"
            type="date"
            value-format="yyyy-MM-dd  HH:mm:ss"
            placeholder="选择日期"
            :picker-options="pickerOptions">
          </el-date-picker>
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

  import api from '../api/equip'
  import treeUtil from '@/common/utils'
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";

  export default {
    name: "equip",
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

        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,

        // 日期范围
        dateRange: [],

        //日期选择快捷选项
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        // 数据范围选项

        // 部门下拉树
        deptTree: [],

        // 装备列表
        equipList: [],

        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          name: undefined,
          enum: undefined,
          type: undefined
        },
        // 表单参数
        form: {

        },
        // 表单校验
        rules: {
          name: [
            { required: true, message: "装备名称不能为空", trigger: "blur" }
          ],
          enum: [
            { required: true, message: "装备编号不能为空", trigger: "blur" }
          ],
          life: [
            { required: true, message: "预估寿命不能为空", trigger: "blur" }
          ],
          type: [
            { required: true, message: "装备类型不能为空", trigger: "blur" }
          ]
        }
      };
    },
    created() {
      this.getList();
      //this.getMenuParent()
      this.getTreeselect()
    },
    methods: {
      /** 查询履历本列表 */
      getList() {
        this.loading = true;
        this.resetqueryParams();
        api.listEquip(this.addDateRange(this.queryParams, this.dateRange)).then(
          res => {
            this.equipList = res.equipList;
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
      // 取消按钮
      cancel() {
        this.open = false;
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
        this.ids = selection.map(item => item.eid)
        this.single = selection.length!=1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加装备";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const eid = row.eid || this.ids[0]  + '';
        api.getEquipByid(eid+'').then(res => {
          this.form = res
          this.open = true;
          this.title = "修改角色"
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.eid !== undefined) {
              api.updateEquip(this.form).then(res => {
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
              api.addEquip(this.form).then(res => {
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
        const num= row.eid?1:this.ids.length
        var eids = [];
        if(row.eid){
          eids[0] = row.eid
        }else eids = this.ids

        this.$confirm('确认删除这' + num + '项数据吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return api.delEquip(eids);
        }).then(res => {
          if(res)
            this.getList();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(function() {});
      },
      normalizer(node) {
        return {
          id: node.pid,
          label: node.deptName,
          children: node.child,
        }
      },
      //重置请求参数
      resetqueryParams(){
        if(this.queryParams.name === '')this.queryParams.pid=undefined
        if(this.queryParams.eNum === '')this.queryParams.username=undefined
        if(this.queryParams.type === '')this.queryParams.phone=undefined
      },
    }
  };
</script>

<style>
  .app-container{
    text-align: left;
  }
</style>
