import router from "./router";
import store from "./store";
import { getToken } from "@/utils/auth";
import { Message } from "element-ui";
import NProgress from "nprogress"; // 水平进度条提示: 在跳转路由时使用
import "nprogress/nprogress.css"; // 水平进度条样式
import getPageTitle from "@/utils/get-page-title"; // 获取应用头部标题的函数
import Layout from "@/layout";
import ParentView from "@/components/ParentView";
const _import = require("./router/_import_" + process.env.NODE_ENV); // 获取组件的方法

NProgress.configure({ showSpinner: false }); // NProgress Configuration
const whiteList = ["/login"]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  // set page title
  document.title = getPageTitle(to.meta.title);

  // 在这里打印当前变量状态，方便调试
  const hasToken = getToken();
  console.log("hasToken:", hasToken);

  const hasGetUserInfo = store.getters.name;
  console.log("hasGetUserInfo:", hasGetUserInfo);

  console.log("to.path:", to.path);

  console.log("menus:", store.getters.menus);

  if (hasToken) {
    if (to.path === "/login") {
      next({ path: "/" });
      NProgress.done();
    } else {
      if (hasGetUserInfo) {
        next();
      } else {
        try {
          await store.dispatch("user/getInfo"); // 请求获取用户信息
          if (store.getters.menus.length < 1) {
            global.antRouter = [];
          }
          const menus = filterAsyncRouter(store.getters.menus); // 过滤路由
          console.log("filtered menus:", menus);
          router.addRoutes(menus); // 动态添加路由
          let lastRou = [{ path: "*", redirect: "/404", hidden: true }];
          router.addRoutes(lastRou);
          global.antRouter = menus; // 传递给全局变量，做菜单渲染用
          next({
            ...to,
            replace: true,
          });
        } catch (error) {
          console.log(error);
          await store.dispatch("user/resetToken");
          Message.error(error || "Has Error");
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
}); // 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap) {
  const accessedRouters = asyncRouterMap.filter((route) => {
    if (route.component) {
      if (route.component === "Layout") {
        route.component = Layout;
      } else if (route.component === "ParentView") {
        route.component = ParentView;
      } else {
        try {
          route.component = _import(route.component); // 导入组件
        } catch (error) {
          debugger;
          console.log(error);
          route.component = _import("dashboard/index"); // 导入组件
        }
      }
    }
    if (route.children && route.children.length > 0) {
      route.children = filterAsyncRouter(route.children);
    } else {
      delete route.children;
    }
    return true;
  });
  return accessedRouters;
}
