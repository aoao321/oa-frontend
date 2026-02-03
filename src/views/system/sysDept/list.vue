<template>
  <div class="app-container">
    <!-- 搜索区 -->
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="部门名称">
              <el-input
                v-model="searchObj.deptName"
                placeholder="请输入部门名称"
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
      <el-button type="success" icon="el-icon-plus" size="mini" @click="add()">
        添 加
      </el-button>
    </div>

    <!-- 列表 -->
    <el-table
      :data="deptList"
      row-key="id"
      border
      stripe
      default-expand-all
      style="width: 100%; margin-top: 10px"
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="name" label="部门名称" />
      <el-table-column prop="leader" label="负责人" width="120" />
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          <el-switch :value="scope.row.status === 1" disabled />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="160" />
      <el-table-column prop="updateTime" label="修改时间" width="160" />

      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="success"
            icon="el-icon-plus"
            size="mini"
            @click="add(scope.row)"
            title="添加下级部门"
          />
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="edit(scope.row)"
            title="修改"
          />
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeById(scope.row.id)"
            title="删除"
            :disabled="scope.row.children && scope.row.children.length > 0"
          />
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
      <el-form ref="dataForm" :model="sysDept" label-width="100px" size="small">
        <el-form-item label="上级部门" v-if="!sysDept.id">
          <el-input v-model="sysDept.parentName" disabled />
        </el-form-item>

        <el-form-item label="部门名称">
          <el-input v-model="sysDept.name" />
        </el-form-item>

        <el-form-item label="负责人">
          <el-input v-model="sysDept.leader" />
        </el-form-item>

        <el-form-item label="状态">
          <el-radio-group v-model="sysDept.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button size="small" @click="dialogVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="saveOrUpdate">
          确定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/system/sysDept";

const defaultForm = {
  id: "",
  parentId: 0,
  parentName: "顶级部门",
  name: "",
  leader: "",
  sortValue: 1,
  status: 1,
};

export default {
  name: "SysDeptList",
  data() {
    return {
      searchObj: {
        deptName: "",
      },
      deptList: [],
      dialogVisible: false,
      dialogTitle: "",
      sysDept: { ...defaultForm },
    };
  },

  created() {
    this.fetchData();
  },

  methods: {
    fetchData() {
      api.findNodes(this.searchObj).then((res) => {
        this.deptList = res.data || [];
      });
    },

    resetData() {
      this.searchObj = { deptName: "" };
      this.fetchData();
    },

    add(row) {
      this.dialogVisible = true;
      this.dialogTitle = row ? "添加下级部门" : "添加部门";
      this.sysDept = { ...defaultForm };

      if (row) {
        this.sysDept.parentId = row.id;
        this.sysDept.parentName = row.name;
      }
    },

    edit(row) {
      this.dialogVisible = true;
      this.dialogTitle = "修改部门";
      this.sysDept = { ...row };
    },

    saveOrUpdate() {
      if (!this.sysDept.id) {
        api.save(this.sysDept).then(() => {
          this.$message.success("新增成功");
          this.dialogVisible = false;
          this.fetchData();
        });
      } else {
        api.updateById(this.sysDept).then(() => {
          this.$message.success("修改成功");
          this.dialogVisible = false;
          this.fetchData();
        });
      }
    },

    removeById(id) {
      this.$confirm("确认删除该部门吗？", "提示", {
        type: "warning",
      }).then(() => {
        api.removeById(id).then(() => {
          this.$message.success("删除成功");
          this.fetchData();
        });
      });
    },
  },
};
</script>
