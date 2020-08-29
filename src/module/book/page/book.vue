<template>
  <div class = "app-container">
    <el-row :gutter="20">
      <!--履历本列表数据-->
      <el-col :span="5" :xs="24">
        <div class = "aside-container">
          <el-input
            size="mini"
            placeholder="搜索履历本"
            v-model="queryParams.bookName"
            prefix-icon = "el-icon-search"
            clearable>
          </el-input>
        </div>
        <div class = "aside-container">
          <el-table v-loading="bookLoading" :data="bookList" current-change="selectBook(currRow, oldRow)" width="180" highlight-current-row>
            <el-table-column label="履历本" align="center" prop="bookName" :show-overflow-tooltip="true" @click=""></el-table-column>
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
                  @click="handleUpdateBook(scope.row)"
                >修改</el-button>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDeleteBook(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="success" plain @click="addBook">新建履历本</el-button>
        </div>
      </el-col>
      <!--履历本信息数据-->
      <el-col :span="19" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
          <el-form-item label="装备名" prop="ename">
            <el-input
              v-model="queryParams.ename"
              placeholder="请输入装备名称"
              clearable
              size="small"
              style="width: 160px"
              @keyup.enter.native="handleQuery">
            </el-input>
          </el-form-item>
          <el-form-item label="创建者" prop="createBy">
            <el-input
              v-model="queryParams.createBy"
              placeholder="请输入创建者"
              clearable
              size="small"
              style="width: 160px"
              @keyup.enter.native="handleQuery"></el-input>
          </el-form-item>
          <el-form-item label="履历类型" prop="type">
            <el-select
              v-model="queryParams.type"
              placeholder="用户状态"
              clearable
              size="small"
              style="width: 160px"
            >
              <el-option
                v-for="dict in typeOptions"
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
              value-format="yyyy-MM-dd HH:mm:ss"
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

        <el-table v-loading="loading" :data="recordList" @selection-change="handleSelectionChange" width="100">
          <el-table-column type="selection" width="40" align="center"></el-table-column>
          <el-table-column label="履历id" align="center" prop="rid" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="绑定装备" align="center" prop="eid" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="履历类型" align="center" prop="type" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="状态时间" align="center" prop="time" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-tag type="danger" v-if="scope.row.time === 0">未结束</el-tag>
              <el-tag type="success" v-else>{{scope.row.time}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="开始时间" align="center" prop="beginTime" width="160" >
            <template slot-scope="data">
              <span>{{ data.row.beginTime.substr(0, 16)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="结束时间" align="center" prop="endTime" width="160" >
            <template slot-scope="scope">
              <span v-if="scope.row.endTime">{{ scope.row.endTime.substr(0, 16)}}</span>
              <span v-else><template>
                  <el-popconfirm
                    title="结束该履历状态吗？"
                    @onConfirm="endStatus(scope.row)"
                    confirmButtonText='结束'
                    cancelButtonText='取消'
                    icon="el-icon-info"
                    iconColor="red">
                    <el-button slot="reference">结束</el-button>
                  </el-popconfirm>
                </template></span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime" width="160" >
            <template slot-scope="data">
              <span>{{data.row.createTime.substr(0, 16)}}</span>
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
                v-if="scope.row.userId !== 1"
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
      </el-col>
    </el-row>

    <!-- 添加或修改履历记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="400px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="绑定装备" prop="eid">
          <template>
            <el-select v-model="form.eid" placeholder="请选择装备">
              <el-option
                v-for="item in equipList"
                :key="item.eid"
                :label="item.name"
                :value="item.eid">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="动用类型" prop="type">
          <el-select
            v-model="form.type"
            placeholder="请选择动用类型"
            clearable
            size="small"
            style="width: 160px"
          >
            <el-option
              v-for="dict in typeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="使用者" prop="user">
          <el-input v-model="form.user" placeholder="请输入使用者"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="beginTime">
          <el-date-picker
            v-model="form.beginTime"
            align="right"
            type="datetime"
            placeholder="选择日期"
            value-format="yyyy-MM-dd HH:mm:ss"
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

  import api from '../api/book.js'

    export default {
      name: "book",
      data() {
        return {
          //履历记录遮罩层
          loading: false,
          // 左侧履历本列表遮罩层
          bookLoading: false,
          //选中数组
          ids: [],
          // 非单个禁用
          single: true,
          // 非多个禁用
          multiple: true,
          //当前页
          currentPage: 1,
          //总页码数
          total: 0,
          //当前选中履历本id
          currentBookId: '',
          //弹出层标题
          title: '',
          //弹出层数据（履历记录）
          form:{bid:'001'},
          //弹出层数据（履历本）
          open: false,
          //请求参数
          queryParams:{
            pageNum: 1,
            pageSize: 5,
            bid: undefined,
            ename: undefined,
            type: undefined,
          },
          //履历记录列表
          recordList: [{
            rid: '001',
            createBy: 'dlice',
            type:'使用',
            beginTime:'',
            endTime: '',
            createTime: ''
          }],
          equipList:[],
          //时间范围
          dateRange:[],
          //履历本列表
          bookList: [{
            bid: '001',
            bookName: '163火炮'
          },{
            bid: '002',
            bookName: 'DF41'
          }],
          //装备状态数据字典
          typeOptions:[
            {
            dictValue: "1",
            dictLabel: "使用"
          },{
            dictValue: "2",
            dictLabel: "封存",
          },{
            dictValue: "3",
            dictLabel: "维修",
          },{
            dictValue: "4",
            dictLabel: "故障",
          },{
            dictValue: "5",
            dictLabel: "启封",
          }],
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
          activeUser:{},
          // 表单校验
          rules: {
            eid: [
              { required: true, message: "装备名称不能为空", trigger: "blur" }
            ],
            user: [
              { required: true, message: "装备编号不能为空", trigger: "blur" }
            ],
            life: [
              { required: true, message: "使用者不能为空", trigger: "blur" }
            ],
            type: [
              { required: true, message: "动用类型不能为空", trigger: "blur" }
            ]
          }
        }
      },
      created() {
        this.getBook();
        this.getList();
        this.getEquip();
        //this.activeUser = this.getActiveUser()
      },
      methods:{
        /** 查询当前用户的履历本 */
        getBook(){
          this.bookLoading = true;
          //根据当前用户查询履历本，暂时用假数据
          api.getbook('001')
            .then(res => {
              if(res.success){
                this.bookList = res.bookList;
                this.currentBookId = this.bookList[0].bid
              }else if(res.code == 11111){
                this.$message({
                  type: 'waring',
                  message: '您还没有履历本！'
                });
              }else {
                this.$message({
                  type: 'error',
                  message: '获取履历本失败！由于 --> ' + res.message
                });
              }
              this.bookLoading = false
            })
        },
        getEquip(){
          api.listEquip({pageNum:1, pageSize: 100}, this.dateRange).then(
            res => {
              this.equipList = res.equipList;
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

        //搜索按钮操作
        handleQuery(){
          this.queryParams.pageNum = 1;
          this.getList();
        },
        //重置按钮操作
        resetQuery() {
          this.dateRange = [];
          this.resetForm("queryForm");
          this.getList();
        },
        // 取消按钮
        cancel() {
          this.open = false;
          this.reset();
        },
        // 表单重置
        reset() {
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

        /** 查询当前履历本履历记录 */
        getList() {
          this.loading = true;
          this.queryParams.bid = this.currentBookId
          this.resetqueryParams();
          api.listRecord(this.addDateRange(this.queryParams, this.dateRange)).then(
            res => {
              this.recordList = res.recordList;
              this.total = res.total;
              this.loading = false;
            }
          );
        },
        /** 新增按钮操作 */
        handleAdd() {
          this.reset();
          this.open = true;
          this.title = "添加履历记录";
        },
        /** 提交按钮 */
        submitForm: function() {
          this.$refs["form"].validate(valid => {
            if (valid) {
              this.form.bid = this.currentBookId || '001'
              api.addRecord(this.form).then(res => {
                console.log(this.form.beginTime)
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
          });
        },
        //履历本选中
        selectBook(currRow, oldRow) {
          this.currentBookId = currRow;
          this.getList();
        },
        //删除按钮操作
        handleDelete(row){
          const num= row.ids?1:this.ids.length
          var rids = [];
          if(row.rid){
            rids[0] = row.rid
          }else rids = this.ids

          api.delRecord(rids).then(res => {
            if(res.success){
              this.$message({
                type: 'success',
                message: '成功删除'
              });
            }else {
              this.$message({
                type: 'success',
                message: '删除失败，请稍后重试'
              });
            }
          })
        },

        // 多选框选中数据
        handleSelectionChange(selection) {
          this.ids = selection.map(item => item.rid);
          this.single = selection.length != 1;
          this.multiple = !selection.length;
          console.log(this.ids)
        },
//履历本操作
        addBook(){
          this.$prompt('请输入履历本名', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
            inputErrorMessage: '履历本名不能为空'
          }).then(({ value }) => {
            api.addBook(value, '001').then(res => {
              if(res.success){
                this.$message({
                  type: 'success',
                  message: '成功添加履历本： ' + value
                });
                this.getBook()
              }else {
                this.$message({
                  type: 'error',
                  message: '添加失败，由于： ' + res.message + '。请稍后重试'
                });
              }
            })
          })
        },
        handleUpdateBook(row){
          this.$prompt('请输入履历本名', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
            inputErrorMessage: '履历本名不能为空'
          }).then(({ value }) => {
            api.updateBook(row.bid, value).then(res => {
              if(res.success){
                this.$message({
                  type: 'success',
                  message: '成功修改履历本名为： ' + value
                });
                this.getBook()
              }else {
                this.$message({
                  type: 'error',
                  message: '修改失败，由于： ' + res.message + '。请稍后重试'
                });
              }
            })
          })
        },
        handleDeleteBook(row){
          this.$confirm('此操作将永久删除该履历本及其包含的履历信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            api.delBook(row.bid).then(res =>{

              if(res.success){
                this.$message({
                  type: 'success',
                  message: '成功删除履历本：' + row.bookName
                });
                this.getBook()
              }else {
                this.$message({
                  type: 'error',
                  message: '删除失败，由于： ' + res.message + '。请稍后重试'
                });
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
        endStatus(row){
          api.endStatus(row.rid).then(res => {
            if(res.success) {
              this.$message({
                type: 'success',
                message: '成功结束该记录 '
              });
              this.getList();
            }
          })
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
          if(this.queryParams.enum === '')this.queryParams.enum=undefined
          if(this.queryParams.type === '')this.queryParams.type=undefined
          if(this.queryParams.bid === '')this.queryParams.bid=undefined
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
      }
    }
</script>

<style scoped>

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .app-container{
    line-height: 40px;
    text-align: left;

  }

  .box-card {
    width: 480px;
  }
</style>
