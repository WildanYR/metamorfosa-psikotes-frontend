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
    { path: 'soal/:kelompok_tes_id', component: InputSoal },
  ]
}

export default route