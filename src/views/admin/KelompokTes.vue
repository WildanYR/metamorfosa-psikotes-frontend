<template>
  <div>
    <Loading v-if="isLoading"></Loading>
    <ModalForm v-if="modal.show" :title="modal.type + ' Kelompok Tes'" @confirm="modalConfirm" @cancel="modal.show = false; resetSelected();">
      <p v-if="modal.type == 'Delete'" class="mx-4">yakin ingin menghapus data?</p>
      <div v-else>
        <div class="w-full px-4">
          <label class="block text-xl sm:text-sm font-medium text-gray-700">Nama</label>
          <input type="text" v-model="kelompokTesData.nama" class="mt-1 py-1 px-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm text-lg sm:text-sm border border-gray-300 rounded">
        </div>
        <div class="w-full px-4">
          <label class="block text-xl sm:text-sm font-medium text-gray-700">Waktu</label>
          <input type="number" v-model="kelompokTesData.waktu" class="mt-1 py-1 px-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm text-lg sm:text-sm border border-gray-300 rounded">
        </div>
        <div class="w-full px-4">
          <label class="block text-xl sm:text-sm font-medium text-gray-700">Jenis Soal</label>
          <v-select v-model="kelompokTesData.jenis_soal" :options="['pilihan_ganda', 'pilihan_ganda_sejajar', 'uraian', 'angka', 'opini', 'custom']"></v-select>
        </div>
        <div class="w-full px-4">
          <label class="block text-xl sm:text-sm font-medium text-gray-700">Petunjuk</label>
          <TextEditor v-model="kelompokTesData.petunjuk"></TextEditor>
        </div>
      </div>
    </ModalForm>
    <h1 class="text-4xl text-center mt-10 font-semibold">Daftar Kelompok Tes</h1>
    <div class="container mx-5">
      <button @click="showModal('Tambah')" class="bg-blue-500 hover:bg-blue-700 text-white p-3 rounded-lg">Tambah Data</button>
      <div class="flex flex-wrap items-center mt-8">
        <div v-for="(kelompok, index) in kelompok_tes" :key="index" class="rounded-2xl border-2 border-gray-200 bg-white m-4">
          <button @click="selectSoal(kelompok.kelompok_tes_id, kelompok.jenis_soal)" class="flex flex-col justify-center items-center px-5 pt-5 pb-2">
            <svg class="w-28 text-blue-special" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
            <p class="text-orange-special text-2xl font-semibold">{{kelompok.nama}}</p>
            <p class="text-gray-500 text-xl font-semibold">{{kelompok.waktu}} Menit</p>
            <p class="text-gray-500 text-xl">{{kelompok.jenis_soal}}</p>
          </button>
          <div class="flex items-center">
            <button class="m-0 p-2 rounded-bl-2xl bg-yellow-200 w-full" @click="kelompokTesData = kelompok; showModal('Edit', kelompok.kelompok_tes_id)">Edit</button>
            <button class="m-0 p-2 rounded-br-2xl bg-red-200 w-full" @click="showModal('Delete', kelompok.kelompok_tes_id)">Delete</button>
          </div>
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
import TextEditor from '../../components/TextEditor.vue'
import VSelect from 'vue-select'

export default {
  components: {
    ModalForm,
    Loading,
    'v-select': VSelect,
    TextEditor
    },
  data(){
    return {
      isLoading: false,
      modal: {
        show: false,
        type: 'Tambah'
      },
      kelompok_tes: [],
      selected_kelompok_tes_id: 0,
      kelompokTesData: {
        nama: '',
        waktu: 0,
        jenis_soal: '',
        petunjuk: ''
      },
    }
  },
  methods: {
    selectSoal(id, jenis_soal){
      this.$router.push(`/admin/soal/${id}/${jenis_soal}`)
    },
    resetSelected(){
      this.selected_kelompok_tes_id = 0
      this.kelompokTesData= {
        nama: '',
        waktu: 0,
        jenis_soal: '',
        petunjuk: ''
      }
    },
    showModal(type, id){
      this.modal.show = true
      this.modal.type = type
      if(id) this.selected_kelompok_tes_id = id
    },
    modalConfirm(){
      if(this.modal.type === 'Tambah') this.add()
      else if(this.modal.type === 'Edit') this.edit()
      else this.destroy()
      this.modal.show = false
    },
    handleImage(command){
      const src = prompt('Enter the url of your image here')
      if (src !== null) {
        command({ src })
      }
    },
    get(){
      this.isLoading = true
      const headers = {Authorization: 'Bearer ' + localStorage.getItem('token')}
      axios.get(`${API.URL}/kelompok-tes?alat_tes_id=${this.$route.params.alat_tes_id}`, {headers})
        .then(res => {
          this.kelompok_tes = res.data.doc.kelompok_tes
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
      axios.post(`${API.URL}/kelompok-tes`, {...this.kelompokTesData, alat_tes_id: this.$route.params.alat_tes_id}, {headers})
        .then(() => {
          this.get()
        })
        .catch(e => {
          console.log(e)
          alert('error: '+e.response.data.message)
        })
        .finally(() => this.isLoading = false)
    },
    edit(){
      this.modal.show = false
      this.isLoading = true
      const headers = {Authorization: 'Bearer ' + localStorage.getItem('token')}
      axios.put(`${API.URL}/kelompok-tes/${this.selected_kelompok_tes_id}`, this.kelompokTesData, {headers})
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
      this.modal.show = false
      this.isLoading = true
      const headers = {Authorization: 'Bearer ' + localStorage.getItem('token')}
      axios.post(`${API.URL}/kelompok-tes/d/${this.selected_kelompok_tes_id}`, {}, {headers})
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
    }
  },
  mounted(){
    this.get()
  },
}
</script>