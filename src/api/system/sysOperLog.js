import request from "@/utils/request";

export default {
  // 分页查询操作日志
  findPage(page, limit, searchObj) {
    return request({
      url: `/admin/system/sysOperLog/findPage/${page}/${limit}`,
      method: "post",
      data: searchObj,
    });
  },

  // 删除单条日志
  removeById(id) {
    return request({
      url: `/admin/system/sysOperLog/remove/${id}`,
      method: "delete",
    });
  },

  // 清空日志
  clearAll() {
    return request({
      url: `/admin/system/sysOperLog/clear`,
      method: "delete",
    });
  },
};
