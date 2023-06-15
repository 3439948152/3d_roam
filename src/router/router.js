
import login from '../views/user/login_1.vue'
const EmptyRouterView = () => import("@/views/routerViews/emptyRouterViews.vue");
const routes = [
  {
    path:'/user',
    component: EmptyRouterView,
    meta: {
      title: '用户'
    },
    children:[
      {
        path:'login',
        name: 'user_login',
        component:()=>import("@/views/user/login_1.vue"),
      },
      {
        path:'register',
        name:'user_register',
        component:()=>import("@/views/user/register_1.vue")
      }
    ]
  },
  {
    path: "/camera",
    component: EmptyRouterView,
    meta: {
      title: "延河组-长6长7分界",
    },
    children: [

      {
        path: "mapfly",
        name: "camera_mapfly",
        component: () => import("@/views/camera/map_fly.vue"),
        meta: {
          title: "漫游",
          activePath: "/camera/mapfly",
        },
      },
    ],
  },
  {
    path: "/mark",
    component: EmptyRouterView,
    meta: {
      title: "延河组-长7长8分界",
    },
    children: [

      {
        path: "xyz",
        name: "mark_xyz",
        component: () => import("@/views/mark/xyz.vue"),
        meta: {
          title: "漫游",
          activePath: "/mark/xyz",
        },
      },
    ],
  },
  {
    path: "/renderServe",
    component: EmptyRouterView,
    meta: {
      title: "延河组-张家滩",
    },
    children: [

      {
        path: "3dtiles",
        name: "renderServe_3dtiles",
        component: () => import("@/views/renderServe/3dtiles.vue"),
        meta: {
          title: "漫游",
          activePath: "/renderServe/3dtiles",
        },
      },
    ],
  },

  {
    path: "/geometry",
    component: EmptyRouterView,
    meta: {
      title: "自定义漫游",
    },
    children: [
      {
        path: "fly",
        name: "geometry_fly",
        component: () => import("@/views/geometry/fly.vue"),
        meta: {
          title: "保存路线",
          activePath: "/geometry/fly",
        },
      },
      {
        path: "DrawCurve",
        name: "geometry_DrawCurve",
        component: () => import("@/views/geometry/DrawCurve.vue"),
        meta: {
          title: "曲线",
          activePath: "/geometry/DrawCurve",
        },
      },

      {
        path: "draw",
        name: "geometry_draw",
        component: () => import("@/views/geometry/draw.vue"),
        meta: {
          title: "自定义漫游",
          activePath: "/geometry/draw",
        },
      },
    ],
  },


];

export default routes;
