import Vue from 'vue'
import Router from 'vue-router'
import User from '@/views/User'
import Login from '@/views/Login'
import Avatar from '@/views/Avatar'
import Cover from '@/views/Cover'
import List from '@/views/List'
import Qq from '@/views/Qq'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/user'
    },
    {
      path: '/user',
      component: User
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/avatar',
      component: Avatar
    },
    {
      path: '/cover',
      component: Cover
    },
    {
      path: '/list',
      component: List
    },
    {
      path: '/qq',
      component: Qq
    }
  ]
})
