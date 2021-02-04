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
    <button @click="setTesAktif" :class="[tes_aktif==='1'?'bg-green-700 hover:bg-red-700':'bg-red-700 hover:bg-green-700']" class="text-white font-bold p-5 w-full">Tes saat ini sedang {{tes_aktif==='1'?'aktif':'tidak aktif'}}</button>
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
      alat_tes: [],
      selected_alat_tes_id: 0,
      alatTesData: {
        nama: ''
      },
      tes_aktif: '',
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
    }
  },
  mounted(){
    this.get()
  }
}
</script>

<style>

</style>