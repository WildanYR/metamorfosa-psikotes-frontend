import jwt_decode from 'jwt-decode'
import store from '../store'
import AuthWrapper from '../wrappers/AuthWrapper.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

const route = {
  path: '',
  component: AuthWrapper,
  children: [
		{ path: "/login", component: Login },
		{ path: "/register", component: Register },
  ],
  beforeEnter: (to, from, next) => {
    const token = localStorage.getItem('token')
    if(token) {
      const user = jwt_decode(token)
      store.commit('setUser', user)
      if(user.role === 'admin') next('/admin/alat-tes')
      else next('/list-tes')
    }
    else next()
  }
}

export default route