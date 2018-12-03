
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '/index', component: () => import('pages/Index.vue') },
      { path: '', component: () => import('pages/user/login') },
      { path: '/profile', component: () => import('pages/user/profile') },
      { path: '/cadastro', component: () => import('pages/user/cadastro') },
      { path: '/addpost', component: () => import('pages/addPost') },
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
