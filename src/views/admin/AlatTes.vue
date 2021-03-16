<template>
  <div>
    <Loading v-if="isLoading"></Loading>
    <ModalForm v-if="modal.show" :title="modal.type + ' Alat Tes'" @confirm="modalConfirm" @cancel="modal.show = false; resetSelected();">
      <p v-if="modal.type == 'Delete'" class="mx-4">yakin ingin menghapus data?</p>
      <div v-else class="w-full px-4">
        <label class="block text-xl sm:text-sm font-medium text-gray-700">Nama</label>
        <input type="text" v-model="alatTesData.nama" class="mt-1 py-1 px-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm text-lg sm:text-sm border border-gray-300 rounded">
      </div>
    </ModalForm>
    <ModalForm v-if="modalSesi" title="Pilih Sesi" @confirm="changeSesi()" @cancel="new_sesi = ''; sesi_selected_id = $store.state.sesi_aktif.sesi_id; modalSesi = false">
      <div class="mb-3">
        <label class="block text-xl sm:text-sm font-medium text-gray-700">tambah sesi baru</label>
        <input type="text" v-model="new_sesi" placeholder="nama sesi" class="inline-block mt-1 py-1 px-2 focus:ring-blue-500 focus:border-blue-500 block shadow-sm text-lg sm:text-sm border border-gray-300 rounded">
        <button @click="addSesi(); new_sesi = ''" class="inline-block ml-2 text-white font-semibold p-2 text-sm rounded bg-blue-500 hover:bg-blue-900">tambah sesi</button>
      </div>
      <h3 class="text-center text-xl font-semibold text-gray-700">daftar sesi</h3>
      <div class="mt-1 mb-5 w-full border border-gray-200"></div>
      <div class="w-full px-4 flex flex-wrap">
        <div v-for="(ss, index) in sesi" :key="index" class="m-2 flex cursor-pointer">
          <div @click="sesi_selected_id = ss.sesi_id" class="p-2 rounded-l" :class="[ss.sesi_id == sesi_selected_id?'bg-blue-600 text-white':'bg-gray-200']">
            <p>{{ss.nama}}</p>
          </div>
          <button @click="deleteSesi(ss.sesi_id)" class="p-2 text-gray-200 bg-red-500 rounded-r">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
              <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
          </button>
        </div>
      </div>
    </ModalForm>
    <ModalForm v-if="modalAkun" title="ubah akun admin" @confirm="ubahAkun()" @cancel="modalAkun = false; resetAkun()">
      <div class="w-full px-4 mt-3">
        <label class="block text-xl sm:text-sm font-medium text-gray-700">email</label>
        <input type="text" v-model="new_akun.email" class="mt-1 py-1 px-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm text-lg sm:text-sm border border-gray-300 rounded">
      </div>
      <div class="w-full px-4 mt-3">
        <label class="block text-xl sm:text-sm font-medium text-gray-700">password saat ini</label>
        <input :type="ganti_akun.show_password?'text':'password'" v-model="new_akun.password" class="mt-1 py-1 px-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm text-lg sm:text-sm border border-gray-300 rounded">
      </div>
      <div class="w-full px-4 mt-3">
        <label class="block text-xl sm:text-sm font-medium text-gray-700">password baru</label>
        <input :type="ganti_akun.show_password?'text':'password'" v-model="new_akun.new_password" class="mt-1 py-1 px-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm text-lg sm:text-sm border border-gray-300 rounded">
      </div>
      <div class="px-4 mt-3">
        <button @click="ganti_akun.show_password = !ganti_akun.show_password" class="text-sm p-2 rounded-lg" :class="[ganti_akun.show_password?'bg-gray-200 hover:bg-gray-400':'bg-blue-500 hover:bg-blue-700 text-white']">{{ganti_akun.show_password?'sembunyikan password':'tampilkan password'}}</button>
      </div>
    </ModalForm>
    <div class="mt-5 flex flex-wrap justify-center space-x-5">
      <div @click="setTesAktif" class="text-center text-white rounded p-7 cursor-pointer" :class="[tes_aktif=='1'?'bg-green-500 border-b-4 border-green-600 hover:bg-green-600':'bg-red-500 border-b-4 border-red-600 hover:bg-red-600']">
        <p class="font-semibold text-lg">status tes</p>
        <p>{{tes_aktif==='1'?'tes sedang dilaksanakan':'tes tidak dilaksanakan'}}</p>
      </div>
      <div v-if="$store.state.sesi_aktif" @click="modalSesi = true" class="text-center text-white rounded p-7 bg-purple-500 border-b-4 border-purple-600 hover:bg-purple-600 cursor-pointer">
        <p class="font-semibold text-lg">sesi tes</p>
        <p>{{$store.state.sesi_aktif.nama}}</p>
      </div>
      <div @click="modalAkun = true" class="text-center text-white rounded p-7 bg-yellow-500 border-b-4 border-yellow-600 hover:bg-yellow-600 cursor-pointer">
        <p class="font-semibold text-lg">ubah akun admin</p>
        <p>{{$store.state.user.email}}</p>
      </div>
    </div>

    <div class="container mx-5">
      <h1 class="text-4xl text-center mt-10 font-semibold">Daftar Alat Tes</h1>
      <button @click="showModal('Tambah')" class="bg-blue-500 hover:bg-blue-700 text-white p-3 rounded-lg">Tambah Data</button>
      <div class="flex flex-wrap items-center mt-8">
        <div v-for="(alat, index) in alat_tes" :key="index" class="rounded-2xl border-2 border-gray-200 bg-white m-4">
          <button @click="selectKelompokTes(alat.alat_tes_id)" class="flex flex-col justify-center items-center px-5 pt-5 pb-2">
            <svg class="w-28 text-blue-special" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <p class="text-orange-special text-2xl font-semibold">{{alat.nama}}</p>
          </button>
          <div class="flex items-center">
            <button class="m-0 p-2 bg-yellow-200 w-full" @click="alatTesData.nama = alat.nama; showModal('Edit', alat.alat_tes_id)">Edit</button>
            <button class="m-0 p-2 bg-red-200 w-full" @click="showModal('Delete', alat.alat_tes_id)">Delete</button>
          </div>
          <button class="m-0 p-2 rounded-b-2xl bg-blue-200 w-full" @click="$router.push('/admin/hasil/'+alat.alat_tes_id)">Hasil Tes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import API from '../../config.api'
import ModalForm from '../../components/ModalForm.vue'
import Loading from '../../components/Loading.vue'
export default {
  components: {ModalForm, Loading},
  data(){
    return {
      isLoading: false,
      modal: {
        show: false,
        type: 'Tambah'
      },
      modalSesi: false,
      modalAkun: false,
      alat_tes: [],
      selected_alat_tes_id: 0,
      alatTesData: {
        nama: ''
      },
      tes_aktif: '',
      sesi: [],
      sesi_selected_id: 0,
      new_sesi: '',
      new_akun: {
        email: '',
        new_password: '',
        password: ''
      },
      ganti_akun: {
        show_password: false,
      }
    }
  },
  methods: {
    selectKelompokTes(id){
      this.$router.push(`/admin/kelompok-tes/${id}`)
    },
    resetSelected(){
      this.selected_alat_tes_id = 0
      this.alatTesData = {
        nama: ''
      }
    },
    showModal(type, id){
      this.modal.show = true
      this.modal.type = type
      if(id) this.selected_alat_tes_id = id
    },
    modalConfirm(){
      if(this.modal.type === 'Tambah') this.add()
      else if(this.modal.type === 'Edit') this.edit()
      else this.destroy()
      this.modal.show = false
    },
    get(){
      this.isLoading = true
      const headers = {Authorization: 'Bearer ' + localStorage.getItem('token')}
      axios.get(`${API.URL}/alat-tes`, {headers})
        .then(res => {
          this.alat_tes = res.data.doc.alat_tes
          return axios.get(`${API.URL}/app-fitur?nama=tes_aktif`, {headers})
        })
        .then(res => {
          this.tes_aktif = res.data.doc.app_fitur.value
        })
        .catch(e => {
          console.log(e)
          alert('error: '+e.response.data.message)
        })
        .finally(() => this.isLoading = false)
    },
    add(){
      this.isLoading = true
      const headers = {Authorization: 'Bearer ' + localStorage.getItem('token')}
      axios.post(`${API.URL}/alat-tes`, this.alatTesData, {headers})
        .then(() => {
          this.get()
        })
        .catch(e => {
          console.log(e)
          alert('error: '+e.response.data.message)
        })
        .finally(() => {
          this.isLoading = false
          this.alatTesData.nama = ''
        })
    },
    edit(){
      this.isLoading = true
      const headers = {Authorization: 'Bearer ' + localStorage.getItem('token')}
      axios.put(`${API.URL}/alat-tes/${this.selected_alat_tes_id}`, this.alatTesData, {headers})
        .then(() => {
          this.get()
        })
        .catch(e => {
          console.log(e)
          alert('error: '+e.response.data.message)
        })
        .finally(() => {
          this.isLoading = false
          this.resetSelected()
        })
    },
    destroy(){
      this.isLoading = true
      const headers = {Authorization: 'Bearer ' + localStorage.getItem('token')}
      axios.post(`${API.URL}/alat-tes/d/${this.selected_alat_tes_id}`, {}, {headers})
        .then(() => {
          this.get()
        })
        .catch(e => {
          console.log(e)
          alert('error: '+e.response.data.message)
        })
        .finally(() => {
          this.isLoading = false
          this.resetSelected()
        })
    },
    setTesAktif(){
      this.isLoading = true
      const value = this.tes_aktif==='1'?'0':'1'
      const headers = {Authorization: 'Bearer ' + localStorage.getItem('token')}
      axios.post(`${API.URL}/app-fitur`, {nama: 'tes_aktif', value}, {headers})
        .then(res => {
          this.tes_aktif = res.data.doc.app_fitur.value
        })
        .catch(e => {
          console.log(e)
          alert('error: '+e.response.data.message)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    getSesi(){
      this.isLoading = true
      const headers = {Authorization: 'Bearer ' + localStorage.getItem('token')}
      axios.get(`${API.URL}/sesi`, {headers})
        .then(res => {
          this.sesi = res.data.doc.sesi
          const sesiAktif = this.sesi.find(item => item.active)
          this.sesi_selected_id = sesiAktif.sesi_id
          this.$store.commit('setSesiAktif', sesiAktif)
        })
        .catch(e => {
          console.log(e)
          alert('error: '+e.response.data.message)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    addSesi(){
      this.isLoading = true
      const headers = {Authorization: 'Bearer ' + localStorage.getItem('token')}
      axios.post(`${API.URL}/sesi`, {nama: this.new_sesi}, {headers})
        .then(() => {
          this.getSesi()
        })
        .catch(e => {
          console.log(e)
          alert('error: '+e.response.data.message)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    changeSesi(){
      this.isLoading = true
      const headers = {Authorization: 'Bearer ' + localStorage.getItem('token')}
      axios.post(`${API.URL}/sesi/${this.sesi_selected_id}`, {}, {headers})
        .then(() => {
          this.getSesi()
        })
        .catch(e => {
          console.log(e)
          alert('error: '+e.response.data.message)
        })
        .finally(() => {
          this.isLoading = false
          this.modalSesi = false
        })
    },
    deleteSesi(sesi_id){
      if(sesi_id == this.$store.state.sesi_aktif.sesi_id) return alert('sesi aktif tidak dapat dihapus')
      const del = confirm('menghapus sesi juga akan menghapus data jawaban user dalam sesi yang dihapus, yakin ingin menghapus?')
      if(del){
        this.isLoading = true
        const headers = {Authorization: 'Bearer ' + localStorage.getItem('token')}
        axios.post(`${API.URL}/sesi/d/${sesi_id}`, {}, {headers})
          .then(() => {
            this.getSesi()
          })
          .catch(e => {
            console.log(e)
            alert('error: '+e.response.data.message)
          })
          .finally(() => {
            this.isLoading = false
          })
      }
    },

    resetAkun(){
      this.new_akun.email = this.$store.state.user.email
      this.new_akun.new_password = ''
      this.new_akun.password = ''
      this.ganti_akun.show_password = false
    },
    ubahAkun(){
      const del = confirm('anda yakin ingin mengubah akun admin?')
      if(del){
        this.isLoading = true
        const headers = {Authorization: 'Bearer ' + localStorage.getItem('token')}
        axios.put(`${API.URL}/user/admin`, this.new_akun, {headers})
          .then(() => {
            this.$store.dispatch('logout')
          })
          .catch(e => {
            console.log(e)
            alert('error: '+e.response.data.message)
          })
          .finally(() => {
            this.isLoading = false
          })
      }
    }

  },
  mounted(){
    this.new_akun.email = this.$store.state.user.email
    this.get()
    this.getSesi()
  },
}
</script>

<style>

</style>