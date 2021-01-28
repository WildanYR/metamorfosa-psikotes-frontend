import jwt_decode from 'jwt-decode'
import store from '../store'
import AppWrapper from '../wrappers/AppWrapper.vue'
import AlatTes from '../views/admin/AlatTes.vue'
import KelompokTes from '../views/admin/KelompokTes.vue'
import InputSoal from '../views/admin/InputSoal.vue'

const route = {
  path: '/admin',
  component: AppWrapper,
  children: [
    { path: 'alat-tes', component: AlatTes },
    { path: 'kelompok-tes/:alat_tes_id', component: KelompokTes },
    { path: 'soal/:kelompok_tes_id/:jenis_soal', component: InputSoal },
  ],
  beforeEnter: (to, from, next) => {
    const token = localStorage.getItem('token')
    if(token) {
      if(!store.state.isLogin) {
        const user = jwt_decode(token)
        store.commit('setUser', user)
      }
      if(store.state.user.role !== 'admin') next('/list-tes')
      else next()
    }
    else next('/login')
  }
}

export default route