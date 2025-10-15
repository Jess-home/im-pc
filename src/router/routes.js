// 所有路由配置
const routes = [
  {
    path: '/',
    redirect: 'login'
  },
  {
    name: 'login',
    component: () => import('@/view/login'),
    meta: {
      title: '首页',
      showSide: false,
      isFull: true
    }
  },
  {
    name: 'reg',
    component: () => import('@/view/reg'),
    meta: {
      title: '注册',
      showSide: false
    }
  },
  {
    name: 'chat',
    component: () => import('@/view/chat'),
    meta: {
      title: '聊天列表',
      showSide: true
    }
  },
  {
    name: 'friend',
    component: () => import('@/view/friend'),
    meta: {
      title: '聊天列表',
      showSide: true
    }
  },
  {
    name: 'groups',
    component: () => import('@/view/chat'),
    meta: {
      title: '群聊',
      showSide: true
    }
  },
  {
    name: 'tags',
    component: () => import('@/view/tags'),
    meta: {
      title: '标签',
      showSide: true
    }
  },
  {
    name: 'my',
    component: () => import('@/view/my'),
    meta: {
      title: '收藏',
      showSide: true
    }
  }
]

// add route path
routes.forEach(route => {
  route.path = route.path || '/' + (route.name || '')
})

export default routes
