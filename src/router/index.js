import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: '/project',
    name: 'project',
    meta:{
      title:"專案列表",
      icon:"el-icon-tickets",
      show:true
    },
    component: () => import('../views/project.vue'),
    children:[]
  },
  {
    path: '/viewList',
    name: 'viewList',
    meta:{
      title:"來訪查看",
      icon:"el-icon-tickets",
      show:false
    },
    component: () => import('../views/viewList.vue'),
    children:[]
  },
  {
    path: '/article',
    name: 'article',
    meta:{
      title:"文章列表",
      icon:"el-icon-edit-outline",
      show:true
    },
    component: () => import('../views/article.vue'),
    children:[]
  },
  {
    path: '/mail',
    name: 'mail',
    meta:{
      title:"收件匣",
      icon:"el-icon-edit-outline",
      show:true
    },
    component: () => import('../views/mail.vue'),
    children:[]
  },
  {
    path: '/chartList',
    name: 'chartList',
    meta:{
      title:"聊天室",
      icon:"el-icon-chat-dot-square",
      show:false
    },
    component: () => import('../views/chartList.vue'),
    children:[]
  },
  {
    path: '/login',
    name: 'login',
    meta:{
      title:"登入",
      icon:"",
      show:true
    },
    component: () => import('../views/login.vue'),
    children:[]
  },
  { path: '*', redirect: '/project',
    meta:{
      show:false
    }
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
