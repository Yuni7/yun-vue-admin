import router from './router'
import Router from 'vue-router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { addRouter } from './utils/addRouter'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

var getRouter
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  const hasLogin = getRouterList('login_static')
  console.log('hasToken:', hasToken) // 是否已获取token
  console.log('hasLogin:', hasLogin) // 登录状态
  if (hasToken && hasLogin === 1) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')

          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
      if (!getRouter) {
        console.log('路由信息不存在')
        
        const hasRouterData = getRouterList('router')
        if (hasRouterData) {
          console.log('路由信息存在 说明已经请求到路由 直接解析路由信息')
          getRouter = hasRouterData
          await gotoRouter(to, next)
        } else {
          console.log('localStorage不存在路由信息 需要重新请求路由信息 并解析路由')
          setRouterList(to, next)
        }
      } else {
        console.log('路由信息存在 直接通过')
        next()
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

function gotoRouter(to, next) {
  try {
    getRouter = addRouter(getRouter) // 解析路由
    const newRouters = router.options.routes.concat(getRouter) // 连接获取到的路由
    // newRouters.push({ path: '/404', redirect: '/404', hidden: true}) // 最后添加404页面
    console.log('路由：', newRouters)
    // router.options.routes = newRouters
    router.matcher = new Router().matcher
    router.addRoutes(newRouters) // 动态添加路由
    store.commit('SET_ROUTER', newRouters) // 将路由数据传递给VUEX，做侧边栏菜单渲染工作
    console.log('路由：测试')
    next({ to, replace: true })
  } catch (error) {
    console.log('路由：测试catch')
    localStorage.setItem('login_static', 0)
    store.dispatch('user/resetToken')
    Message.error(error || 'Has Error')
    next(`/login?redirect=${to.path}`)
    NProgress.done()
  }
}

function setRouterList(to, next) {
  store.dispatch('user/getInfo').then(data => { // 请求路由数据
    console.log("请求路由数据  写入localStorage")
    console.log("data.menulis")
    console.log(data.menulist)

  //   const routerTable = [
  //   {
  //     'id': 1,
  //     'name': 'Example',
  //     'path': '/example',
  //     'component': 'Layout',
  //     'redirect': '/example/table',
  //     // 'mate':{title:'Example',icon: 'example'},
  //     'title': 'Table',
  //     'icon': 'table',
  //     'children': null
  //   }
  // ]
  //  console.log("routerTable")
  //  console.log(routerTable)

    localStorage.setItem('router', JSON.stringify(data.menulist))

    getRouter = getRouterList('router') // 拿到路由
    gotoRouter(to, next)
  })
}

function getRouterList(name) {
  // return JSON.parse(localStorage.getItem(name))
  // console.log("getRouterList  :")
  // console.log(JSON.parse(localStorage.getItem(name)))
  // return localStorage.getItem(name)
  return JSON.parse(localStorage.getItem(name))
}
