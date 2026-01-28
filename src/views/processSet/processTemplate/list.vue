<template>
  <div class="app-container">
    <!-- 工具条 -->
    <div class="tools-div">
      <el-button
        type="success"
        icon="el-icon-plus"
        size="mini"
        @click="add"
        :disabled="$hasBP('bnt.processTemplate.templateSet') === false"
        >添加审批设置</el-button
      >
    </div>

    <!-- 列表 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      border
      style="width: 100%; margin-top: 10px"
    >
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template> </el-table-column
      >iconPath
      <el-table-column prop="name" label="审批名称" />
      <el-table-column label="图标">
        <template slot-scope="scope">
          <img
            :src="scope.row.iconUrl"
            style="width: 30px; height: 30px; vertical-align: text-bottom"
          />
        </template>
      </el-table-column>

      <el-table-column prop="processTypeName" label="审批类型" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="updateTime" label="更新时间" />
      <el-table-column label="操作" width="250" align="center">
        <template slot-scope="scope">
          <el-button
            type="info"
            size="mini"
            @click="show(scope.row)"
            icon="el-icon-view"
            title="查看审批设置"
          ></el-button>

          <el-button
            v-if="scope.row.status == 0"
            type="warning"
            icon="el-icon-upload2"
            size="mini"
            @click="publish(scope.row.id)"
            :disabled="$hasBP('bnt.processTemplate.publish') === false"
            title="发布"
          ></el-button>

          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="edit(scope.row.id)"
            :disabled="$hasBP('bnt.processTemplate.templateSet') === false"
            title="修改"
          ></el-button>

          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeDataById(scope.row.id)"
            :disabled="$hasBP('bnt.processTemplate.remove') === false"
            title="删除"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      style="padding: 30px 0; text-align: center"
      layout="sizes, prev, pager, next, jumper, ->, total, slot"
      @current-change="fetchData"
      @size-change="changeSize"
    />
    <el-dialog
      title="查看审批设置"
      :visible.sync="formDialogVisible"
      width="35%"
    >
      <h3>基本信息</h3>

      <el-divider />
      <el-form
        ref="flashPromotionForm"
        label-width="150px"
        size="small"
        style="padding-right: 40px"
      >
        <el-form-item label="审批类型" style="margin-bottom: 0px">{{
          processTemplate.processTypeName
        }}</el-form-item>

        <el-form-item label="名称" style="margin-bottom: 0px">{{
          processTemplate.name
        }}</el-form-item>

        <el-form-item label="创建时间" style="margin-bottom: 0px">{{
          processTemplate.createTime
        }}</el-form-item>
      </el-form>

      <h3>表单信息</h3>

      <el-divider />
      <div>
        <form-create :rule="rule" :option="option"></form-create>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="formDialogVisible = false" size="small"
          >取 消</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/process/processTemplate";
import router from "@/router";

export default {
  data() {
    return {
      listLoading: true, // 数据是否正在加载
      list: null, // banner列表
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 10, // 每页记录数
      searchObj: {}, // 查询表单对象

      rule: [],
      option: {},
      processTemplate: {},
      formDialogVisible: false,
    };
  },
  // 生命周期函数：内存准备完毕，页面尚未渲染
  created() {
    this.fetchData();
  },
  // 生命周期函数：内存准备完毕，页面渲染成功
  mounted() {},
  methods: {
    // 当页码发生改变的时候
    changeSize(size) {
      this.limit = size;
      this.fetchData(1);
    },
    // 加载banner列表数据
    fetchData(page = 1) {
      // 异步获取远程数据（ajax）
      this.page = page;
      api
        .getPageList(this.page, this.limit, this.searchObj)
        .then((response) => {
          this.list = response.data.list;
          this.total = response.data.total;
          // 数据加载并绑定成功
          this.listLoading = false;
        });
    },
    // 重置查询表单
    resetData() {
      this.searchObj = {};
      this.fetchData();
    },
    // 根据id删除数据
    removeDataById(id) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return api.removeById(id);
        })
        .then((response) => {
          this.fetchData(this.page);
          this.$message.success(response.message);
        })
        .catch(() => {
          this.$message.info("取消删除");
        });
    },
    add() {
      console.log(`output->this.$route`, this.$route);
      this.$router.push("/processSet/templateSet");
    },
    show(row) {
      console.log("formProps:", row.formProps);
      console.log("formOptions:", row.formOptions);
      try {
        this.rule = JSON.parse(row.formProps || "{}");
        this.option = JSON.parse(row.formOptions || "{}");
        this.processTemplate = row;
        this.formDialogVisible = true;
      } catch (e) {
        this.$message.error("表单配置解析失败，请检查数据格式");
        console.error("JSON.parse error:", e);
      }
    },
    edit(id) {
      this.$router.push("/processSet/templateSet?id=" + id);
    },
    publish(id) {
      this.$confirm("确认要发布该审批模板吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return api.publish(id);
        })
        .then(() => {
          this.$message.success("发布成功");
          this.fetchData(this.page);
        })
        .catch(() => {
          this.$message.info("已取消发布");
        });
    },
  },
};
</script>
