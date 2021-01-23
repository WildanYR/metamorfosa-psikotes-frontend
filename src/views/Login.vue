<template>
  <div>
    <p v-if="isLoading">Loading...</p>
    <input type="text" placeholder="email" v-model="loginData.email">
    <input type="password" placeholder="password" v-model="loginData.password">
    <button @click="login">Login</button>
  </div>
</template>

<script>
import axios from 'axios'
import API from '../config.api'
export default {
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
          this.$router.push('/alat-tes')
        })
        .catch(e => {
          console.log(e.response)
        })
        .finally(() => this.isLoading = false)
    }
  }
}
</script>

<style>

</style>