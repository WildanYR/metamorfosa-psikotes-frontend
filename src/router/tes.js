import jwt_decode from 'jwt-decode'
import store from '../store'
import AppWrapper from '../wrappers/AppWrapper.vue'
import AlatTes from '../views/user/AlatTes.vue'
import Tes from '../views/user/Tes.vue'
import Petunjuk from '../views/user/Petunjuk.vue'

const route = {
  path: '',
  component: AppWrapper,
  children: [
    { path: '/list-tes', component: AlatTes },
    { path: '/tes', component: Tes },
    { path: '/petunjuk', component: Petunjuk }
  ],
  beforeEnter: (to, from, next) => {
    const token = localStorage.getItem('token')
    if(token) {
      if(!store.state.isLogin) {
        const user = jwt_decode(token)
        store.commit('setUser', user)
      }
      if(store.state.user.role === 'admin') next('/admin/alat-tes')
      else {
        if(to.path === '/list-tes' && store.state.isDoingTes) next('/petunjuk')
        else next()
      }
    }
    else next('/login')
  }
}

export default route