import _import from '../router/_import'// 获取组件的方法

function addRouter(routerlist) {
  routerlist.forEach(e => {
    // 删除无用属性
    delete e.id
    e.component = _import(e.component) // 动态匹配组件
    if (e.redirect === '') {
      delete e.redirect
    }
    if (e.name === '') {
      delete e.name
    }
    if (e.icon !== '' && e.title !== '') { // 配置 菜单标题 与 图标
      e.meta = {
        title: e.title,
        icon: e.icon
      }
    } else if (e.icon === '' && e.title !== '') {
      e.meta = {
        title: e.title
      }
    }
    delete e.icon
    delete e.title
    if (e.children != null) {
      // 存在子路由就递归
      addRouter(e.children)
    }
  })
  // console.log(routerlist)
  return routerlist
}
export { addRouter }
