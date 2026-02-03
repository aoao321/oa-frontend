import request from "@/utils/request";

export default {
  // 查询部门树
  findNodes(searchObj) {
    return request({
      url: "/admin/system/sysDept/findNodes",
      method: "get",
      params: searchObj,
    });
  },

  // 新增部门
  save(sysDept) {
    return request({
      url: "/admin/system/sysDept/save",
      method: "post",
      data: sysDept,
    });
  },

  // 根据id修改
  updateById(sysDept) {
    return request({
      url: "/admin/system/sysDept/update",
      method: "put",
      data: sysDept,
    });
  },

  // 删除部门
  removeById(id) {
    return request({
      url: `/admin/system/sysDept/remove/${id}`,
      method: "delete",
    });
  },
};
