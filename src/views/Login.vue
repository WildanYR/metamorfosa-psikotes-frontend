<template>
  <div class="h-screen flex justify-center items-center">
    <Loading v-if="isLoading"></Loading>
    <div class="bg-white px-14 py-10 rounded-xl max-w-xl w-1/2">
      <div class="w-full flex flex-col items-center space-y-7">
        <img src="../assets/logo.png" class="w-48">
        <h2 class="text-md text-gray-500">silahkan masuk dengan akun anda</h2>
      </div>
      <div class="mt-10">
        <p class="text-gray-700">Email</p>
        <input type="text" placeholder="masukkan email" v-model="loginData.email" class="py-2 w-full border-b-2 border-blue-special focus:border-yellow-special focus:outline-none">
      </div>
      <div class="mt-5">
        <p class="text-gray-700">Password</p>
        <input type="password" placeholder="masukkan password" v-model="loginData.password" class="py-2 w-full border-b-2 border-blue-special focus:border-yellow-special focus:outline-none">
      </div>
      <div class="mt-10 flex justify-between">
        <button @click="$router.push('/register')" class="text-sm text-blue-special focus:outline-none focus:text-yellow-special hover:text-yellow-special">belum punya akun?</button>
        <button @click="login" class="bg-blue-special py-3 px-5 rounded text-white font-semibold hover:bg-blue-900 focus:outline-none focus:bg-blue-900">Masuk</button>
      </div>

    </div>
  </div>
</template>

<script>
import axios from 'axios'
import API from '../config.api'
import Loading from '../components/Loading.vue'
export default {
  components: {Loading},
  data(){
    return {
      isLoading: false,
      loginData: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    login(){
      this.isLoading = true
      axios.post(`${API.URL}/login`, this.loginData)
        .then(res => {
          localStorage.setItem('token', res.data.doc.token)
          this.$router.push('/list-tes')
        })
        .catch(e => {
          console.log(e.response)
          alert('error: '+e.response.data.message)
        })
        .finally(() => this.isLoading = false)
    }
  }
}
</script>

<style>

</style>