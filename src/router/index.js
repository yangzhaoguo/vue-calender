import Vue from 'vue'
import Router from 'vue-router'
import Calendarpage from '@/components/calender/calendarpage'; // 酒店日历
Vue.use(Router);

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/Calendarpage',
      component: Calendarpage
    }
  ]
})
