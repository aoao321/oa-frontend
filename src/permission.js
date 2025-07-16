import router from "./router";
import store from "./store";
import { getToken } from "@/utils/auth";
import { Message } from "element-ui";
import NProgress from "nprogress"; // 页面顶部进度条
import "nprogress/nprogress.css";
import getPageTitle from "@/utils/get-page-title";
import Layout from "@/layout";
import ParentView from "@/components/ParentView";

// const _import = require("./router/_import_" + process.env.NODE_ENV);

const _import = require("./router/_import_development");

NProgress.configure({ showSpinner: false });

const whiteList = ["/login"];

router.beforeEach(async (to, from, next) => {
  NProgress.start();

  // 设置页面标题
  document.title = getPageTitle(to.meta.title);

  // 判断是否有token
  const hasToken = getToken();

  if (hasToken) {
    if (to.path === "/login") {
      next({ path: "/" });
      NProgress.done();
    } else {
      const hasGetUserInfo = store.getters.name;
      if (hasGetUserInfo) {
        next();
      } else {
        try {
          // 请求用户信息
          await store.dispatch("user/getInfo");
          const menus = store.getters.menus || [];

          if (menus.length < 1) {
            global.antRouter = [];
            next();
            NProgress.done();
            return;
          }
          const filteredMenus = filterAsyncRouter(menus);
          console.log(`output->fi`, filteredMenus);
          console.log(`output->to.path`, to.path);
          router.addRoutes(filteredMenus);

          // 添加404路由
          router.addRoutes([{ path: "*", redirect: "/404", hidden: true }]);

          global.antRouter = filteredMenus;

          next({ ...to, replace: true });
        } catch (error) {
          console.log(`output->router.routes`, error);
          await store.dispatch("user/resetToken");
          // Message.error(error || "Has Error");
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    // 无token且白名单允许的路径，直接放行
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});

function filterAsyncRouter(asyncRouterMap) {
  return asyncRouterMap.filter((route) => {
    if (route.component) {
      if (route.component === "Layout") {
        route.component = Layout;
      } else if (route.component === "ParentView") {
        route.component = ParentView;
      } else {
        try {
          route.component = _import(route.component);
        } catch (error) {
          console.error(error);
          route.component = _import("dashboard/index");
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
}

export default router;
