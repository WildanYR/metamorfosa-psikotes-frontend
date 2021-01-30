<template>
  <div class="flex justify-center items-center">
    <Loading v-if="isLoading"></Loading>
    <div class="bg-white px-14 py-10 rounded-xl max-w-xl w-1/2">
      <div class="w-full flex flex-col items-center space-y-7">
        <img src="../assets/logo.png" class="w-48">
        <h2 class="text-md text-gray-500">daftarkan akun baru untuk memulai tes</h2>
      </div>
      <div class="mt-10">
        <p class="text-gray-700">Email</p>
        <input type="text" placeholder="masukkan email" v-model="registerData.email" @keydown.enter="register" class="py-2 w-full border-b-2 border-yellow-special focus:border-blue-special focus:outline-none">
      </div>
      <div class="mt-5">
        <p class="text-gray-700">Password</p>
        <input type="password" placeholder="masukkan password" v-model="registerData.password" @keydown.enter="register" class="py-2 w-full border-b-2 border-yellow-special focus:border-blue-special focus:outline-none">
      </div>
      <div class="mt-5">
        <p class="text-gray-700">Nama Lengkap</p>
        <input type="text" placeholder="masukkan nama lengkap" v-model="registerData.nama_lengkap" @keydown.enter="register" class="py-2 w-full border-b-2 border-yellow-special focus:border-blue-special focus:outline-none">
      </div>
      <div class="mt-5 flex">
        <div>
          <p class="text-gray-700">Tempat Lahir</p>
          <input type="text" placeholder="masukkan tempat" v-model="registerData.tempat_lahir" @keydown.enter="register" class="py-2 w-full border-b-2 border-yellow-special focus:border-blue-special focus:outline-none">
        </div>
        <div class="ml-2">
          <p class="text-gray-700">Tanggal Lahir</p>
          <input type="text" placeholder="31-12-1997" v-model="registerData.tanggal_lahir" @keydown.enter="register" class="py-2 w-full border-b-2 border-yellow-special focus:border-blue-special focus:outline-none">
        </div>
      </div>
      <div class="mt-5">
        <p class="text-gray-700">Jenis Kelamin</p>
        <!-- <input type="text" placeholder="masukkan nama lengkap" v-model="registerData.nama_lengkap" @keydown.enter="register" class="py-2 w-full border-b-2 border-yellow-special focus:border-blue-special focus:outline-none"> -->
        <v-select v-model="registerData.jenis_kelamin" :options="['laki-laki', 'perempuan']"></v-select>
      </div>
      <div class="mt-5">
        <p class="text-gray-700">Alamat</p>
        <input type="text" placeholder="masukkan alamat" v-model="registerData.alamat" @keydown.enter="register" class="py-2 w-full border-b-2 border-yellow-special focus:border-blue-special focus:outline-none">
      </div>
      <div class="mt-5">
        <p class="text-gray-700">Agama</p>
        <input type="text" placeholder="masukkan agama" v-model="registerData.agama" @keydown.enter="register" class="py-2 w-full border-b-2 border-yellow-special focus:border-blue-special focus:outline-none">
      </div>
      <div class="mt-5">
        <p class="text-gray-700">Pendidikan Terakhir</p>
        <input type="text" placeholder="masukkan pendidikan terakhir" v-model="registerData.pendidikan_terakhir" @keydown.enter="register" class="py-2 w-full border-b-2 border-yellow-special focus:border-blue-special focus:outline-none">
      </div>
      <div class="mt-10 flex justify-between">
        <button @click="$router.push('/login')" class="text-sm text-blue-special focus:outline-none focus:text-yellow-special hover:text-yellow-special">sudah punya akun?</button>
        <button @click="register" class="bg-yellow-500 py-3 px-5 rounded text-white font-semibold hover:bg-yellow-600 focus:outline-none focus:bg-blue-900">Daftar</button>
      </div>

    </div>
  </div>
</template>

<script>
import axios from 'axios'
import API from '../config.api'
import Loading from '../components/Loading.vue'
import VSelect from 'vue-select'
export default {
  components: {Loading, 'v-select': VSelect},
  data(){
    return {
      isLoading: false,
      registerData: {
        email: '',
        password: '',
        nama_lengkap: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        jenis_kelamin: '',
        alamat: '',
        agama: '',
        pendidikan_terakhir: ''
      }
    }
  },
  methods: {
    register(){
      const condition = !(this.registerData.email || this.registerData.password || this.registerData.nama_lengkap || this.registerData.tempat_lahir || this.registerData.tanggal_lahir || this.registerData.jenis_kelamin || this.registerData.alamat || this.registerData.agama || this.registerData.pendidikan_terakhir)
      if(condition) alert('lengkapi data')
      else{
        this.isLoading = true
        axios.post(`${API.URL}/register`, this.registerData)
          .then(res => {
            localStorage.setItem('token', res.data.doc.token)
            this.$router.push('/list-tes')
          })
          .catch(e => {
            console.log(e)
            alert('error: '+e.response.data.message)
          })
          .finally(() => this.isLoading = false)
      }
    }
  }
}
</script>

<style>

</style>