<template>
  <div class="app-container">
    <!-- 搜索区 -->
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="岗位名称">
              <el-input
                v-model="searchObj.name"
                placeholder="请输入岗位名称"
                style="width: 95%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="display: flex">
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="fetchData"
          >
            搜索
          </el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetData">
            重置
          </el-button>
        </el-row>
      </el-form>
    </div>

    <!-- 工具条 -->
    <div class="tools-div">
      <el-button type="success" icon="el-icon-plus" size="mini" @click="add">
        添 加
      </el-button>
    </div>

    <!-- 列表 -->
    <el-table
      :data="postList"
      border
      stripe
      style="width: 100%; margin-top: 10px"
    >
      <el-table-column prop="name" label="岗位名称" />
      <el-table-column prop="postCode" label="岗位编码" width="120" />

      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            @change="changeStatus(scope.row)"
          />
        </template>
      </el-table-column>

      <el-table-column prop="createTime" label="创建时间" width="160" />
      <el-table-column prop="updateTime" label="修改时间" width="160" />

      <el-table-column label="操作" width="160" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="edit(scope.row)"
          />
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeById(scope.row.id)"
          />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      style="margin-top: 15px; text-align: right"
      layout="total, prev, pager, next"
      :current-page="page"
      :page-size="limit"
      :total="total"
      @current-change="pageChange"
    />

    <!-- 弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
      <el-form :model="sysPost" label-width="100px" size="small">
        <el-form-item label="岗位名称">
          <el-input v-model="sysPost.name" />
        </el-form-item>

        <el-form-item label="岗位编码">
          <el-input v-model="sysPost.postCode" />
        </el-form-item>

        <el-form-item label="状态">
          <el-radio-group v-model="sysPost.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button size="small" @click="dialogVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="saveOrUpdate"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/system/sysPost";

const defaultForm = {
  id: "",
  name: "",
  code: "",
  sortValue: 1,
  status: 1,
};

export default {
  data() {
    return {
      searchObj: {},
      page: 1,
      limit: 10,
      total: 0,
      postList: [],

      dialogVisible: false,
      dialogTitle: "",
      sysPost: { ...defaultForm },
    };
  },

  created() {
    this.fetchData();
  },

  methods: {
    fetchData() {
      api.findPage(this.page, this.limit, this.searchObj).then((res) => {
        this.postList = res.data.list || res.data;
        this.total = res.data.total || this.postList.length;
      });
    },

    resetData() {
      this.searchObj = {};
      this.fetchData();
    },

    pageChange(p) {
      this.page = p;
      this.fetchData();
    },

    add() {
      this.dialogVisible = true;
      this.dialogTitle = "添加岗位";
      this.sysPost = { ...defaultForm };
    },

    edit(row) {
      this.dialogVisible = true;
      this.dialogTitle = "修改岗位";
      this.sysPost = { ...row };
    },

    saveOrUpdate() {
      const apiCall = this.sysPost.id
        ? api.updateById(this.sysPost)
        : api.save(this.sysPost);
      apiCall.then(() => {
        this.$message.success("操作成功");
        this.dialogVisible = false;
        this.fetchData();
      });
    },

    removeById(id) {
      this.$confirm("确认删除该岗位吗？", "提示", { type: "warning" }).then(
        () => {
          api.removeById(id).then(() => {
            this.$message.success("删除成功");
            this.fetchData();
          });
        }
      );
    },

    changeStatus(row) {
      api.updateStatus(row.id, row.status).then(() => {
        this.$message.success("状态修改成功");
        this.fetchData();
      });
    },
  },
};
</script>
