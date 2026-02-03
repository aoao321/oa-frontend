import request from "@/utils/request";

export default {
  findPage(page, limit, params) {
    return request({
      url: `/admin/system/sysPost/findPage/${page}/${limit}`,
      method: "get",
      params,
    });
  },

  save(data) {
    return request({
      url: "/admin/system/sysPost/save",
      method: "post",
      data,
    });
  },

  updateById(data) {
    return request({
      url: "/admin/system/sysPost/update",
      method: "put",
      data,
    });
  },

  removeById(id) {
    return request({
      url: `/admin/system/sysPost/remove/${id}`,
      method: "delete",
    });
  },

  updateStatus(id, status) {
    return request({
      url: `/admin/system/sysPost/updateStatus/${id}/${status}`,
      method: "put",
    });
  },
};
