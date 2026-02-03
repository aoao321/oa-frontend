<template>
  <div class="app-container">
    <!-- 搜索区 -->
    <div class="search-div">
      <el-form label-width="80px" size="small" inline>
        <el-form-item label="操作人">
          <el-input v-model="searchObj.operName" placeholder="请输入操作人" />
        </el-form-item>

        <el-form-item label="模块">
          <el-input v-model="searchObj.title" placeholder="请输入模块名称" />
        </el-form-item>

        <el-form-item label="类型">
          <el-select v-model="searchObj.businessType" placeholder="请选择">
            <el-option label="新增" :value="1" />
            <el-option label="修改" :value="2" />
            <el-option label="删除" :value="3" />
            <el-option label="其它" :value="0" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-search"
            @click="fetchData"
          >
            搜索
          </el-button>
          <el-button size="mini" icon="el-icon-refresh" @click="resetData">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 列表 -->
    <el-table :data="list" border stripe style="width: 100%; margin-top: 10px">
      <el-table-column prop="title" label="模块" />
      <el-table-column prop="businessType" label="操作类型" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.businessType === 1" type="success"
            >新增</el-tag
          >
          <el-tag v-else-if="scope.row.businessType === 2" type="warning"
            >修改</el-tag
          >
          <el-tag v-else-if="scope.row.businessType === 3" type="danger"
            >删除</el-tag
          >
          <el-tag v-else type="info">其它</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="method" label="请求方法" width="120" />
      <el-table-column prop="requestMethod" label="请求方式" width="100" />
      <el-table-column prop="operName" label="操作人" width="120" />
      <el-table-column prop="operIp" label="IP地址" width="140" />
      <el-table-column prop="createTime" label="操作时间" width="160" />
    </el-table>

    <!-- 分页 -->
    <el-pagination
      style="margin-top: 15px; text-align: right"
      background
      layout="prev, pager, next, total"
      :current-page="page"
      :page-size="limit"
      :total="total"
      @current-change="changePage"
    />
  </div>
</template>

<script>
import api from "@/api/system/sysOperLog";

export default {
  data() {
    return {
      searchObj: {},
      page: 1,
      limit: 10,
      total: 0,
      list: [],
    };
  },

  created() {
    this.fetchData();
  },

  methods: {
    fetchData() {
      api.findPage(this.page, this.limit, this.searchObj).then((res) => {
        this.list = res.data.list || res.data.records;
        this.total = res.data.total;
      });
    },

    resetData() {
      this.searchObj = {};
      this.page = 1;
      this.fetchData();
    },

    changePage(page) {
      this.page = page;
      this.fetchData();
    },
  },
};
</script>

<style scoped>
.search-div {
  margin-bottom: 10px;
}
.tools-div {
  margin-bottom: 10px;
}
</style>
