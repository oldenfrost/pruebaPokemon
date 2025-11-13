import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Game from '../pages/Game.vue'
import Final from '../pages/Final.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/game', name: 'Game', component: Game },
  { path: '/final', name: 'Final', component: Final }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

