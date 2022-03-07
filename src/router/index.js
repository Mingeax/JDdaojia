import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [{
  path: '/',
  redirect: '/front-page/home'
}, {
  path: '/front-page',
  name: 'FrontPage',
  redirect: '/front-page/home',
  component: () => import(/* webpackChunkName: "front-page" */ '@/views/front-page/FrontPage.vue'),
  children: [
    {
      path: 'home',
      name: 'Home',
      component: () => import(/* webpackChunkName: "home" */ '@/views/front-page/home/Home.vue')
    }, {
      path: 'discovery',
      name: 'Discovery',
      component: () => import(/* webpackChunkName: "discovery" */ '@/views/front-page/discovery/Discovery.vue')
    }, {
      path: 'cart',
      name: 'Cart',
      component: () => import(/* webpackChunkName: "cart" */ '@/views/front-page/cart/Cart.vue')
    }, {
      path: 'order',
      name: 'Order',
      component: () => import(/* webpackChunkName: "order" */ '@/views/front-page/order/Order.vue')
    }, {
      path: 'mine',
      name: 'Mine',
      component: () => import(/* webpackChunkName: "mine" */ '@/views/front-page/mine/Mine.vue')
    }]
}, {
  path: '/login-register',
  name: 'LoginRegister',
  component: () => import(/* webpackChunkName: "login-register" */ '@/views/login-register/LoginRegister.vue'),
  beforeEnter: () => {
    const isLogin = sessionStorage.getItem('isLogin')
    if (+isLogin) {
      return {
        path: '/front-page',
        name: 'Home'
      }
    } else {
      return true
    }
  }
}, {
  path: '/shop/:id',
  name: 'Shop',
  component: () => import(/* webpackChunkName: "shop" */ '@/views/shop/Shop.vue')
}, {
  path: '/order-confirm/',
  name: 'OrderConfirm',
  component: () => import(/* webpackChunkName: "order-confirm" */ '@/views/order-confirm/OrderConfirm.vue')
}, {
  path: '/pay-page',
  name: 'PayPage',
  component: () => import(/* webpackChunkName: "pay-page" */ '@/views/pay-page/PayPage.vue')
}, {
  path: '/address-list',
  name: 'AddressList',
  component: () => import(/* webpackChunkName: "address-list" */ '@/views/address/AddressList.vue')
}, {
  path: '/operate-address/:type(edit|create)/:addressId(\\d+)?',
  // :type可以是 'edit' 或 'create' , 只有前者需要:addressId参数.
  name: 'OperateAddress',
  component: () => import(/* webpackChunkName: "operate-address" */ '@/views/address/OperateAddress.vue')
}, {
  path: '/order-detail/:orderId',
  name: 'OrderDetail',
  component: () => import(/* webpackChunkName: "order-detail" */ '@/views/order-detail/OrderDetail.vue')
}
]

// {
//   path: '/about',
//   name: 'About',
//   // route level code-splitting
//   // this generates a separate chunk (about.[hash].js) for this route
//   // which is lazy-loaded when the route is visited.
//   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
// }
// ]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(to => {
  // 登录守卫.
  const noLoginAccessibleNames = [
    'Home',
    'Discovery',
    'Cart',
    'Order',
    'Mine',
    'LoginRegister'
  ]

  switch (+sessionStorage.getItem('isLogin')) {
    case 1:
      return true
    case 0:
    case NaN:
      if (noLoginAccessibleNames.includes(to.name)) return true
      else return { name: 'LoginRegister', replace: true }
  }
})

export default router
