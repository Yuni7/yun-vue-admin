export default file => {
  return map[file] || null
}
const map = {
  'Layout': () => import('@/layout'),
  'table': () => import('@/views/table/index'),
  'tree': () => import('@/views/tree/index'),
  'form': () => import('@/views/form/index'),
  'menu1': () => import('@/views/nested/menu1/index'),
  'menu1-1': () => import('@/views/nested/menu1/menu1-1'),
  'menu1-2': () => import('@/views/nested/menu1/menu1-2'),
  'menu1-2-1': () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  'menu1-2-2': () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  'menu1-3': () => import('@/views/nested/menu1/menu1-3'),
  'menu2': () => import('@/views/nested/menu2/index')
}
