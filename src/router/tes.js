import AppWrapper from '../wrappers/AppWrapper.vue'
import AlatTes from '../views/user/AlatTes.vue'
import Tes from '../views/user/Tes.vue'
import Selesai from '../views/user/Selesai.vue'

const route = {
  path: '',
  component: AppWrapper,
  children: [
    { path: '/alat-tes', component: AlatTes },
    { path: '/tes', component: Tes },
    { path: '/selesai', component: Selesai }
  ]
}

export default route