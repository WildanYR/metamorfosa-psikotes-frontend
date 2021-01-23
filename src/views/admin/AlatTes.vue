<template>
  <div>
    <p v-if="isLoading">Loading...</p>
    <div>
      <input type="text" placeholder="nama" v-model="alatTesData.nama">
      <button @click="add">Tambah</button>
    </div>
    <ul>
      <li v-for="(alat, index) in alat_tes" :key="index">{{alat.nama}}</li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'
import API from '../../config.api'
export default {
  data(){
    return {
      isLoading: false,
      alat_tes: [],
      alatTesData: {
        nama: ''
      }
    }
  },
  methods: {
    get(){
      this.isLoading = true
      const headers = {Authorization: 'Bearer ' + localStorage.getItem('token')}
      axios.get(`${API.URL}/alat-tes`, {headers})
        .then(res => {
          this.alat_tes = res.data.doc.alat_tes
        })
        .catch(e => {
          console.log(e.response)
          alert('error')
        })
        .finally(() => this.isLoading = false)
    },
    add(){
      this.isLoading = true
      const headers = {Authorization: 'Bearer ' + localStorage.getItem('token')}
      axios.post(`${API.URL}/alat-tes`, this.alatTesData, {headers})
        .then(() => {
          this.get()
          this.alatTesData.nama = ''
        })
        .catch(e => {
          console.log(e.response)
          alert('error')
        })
        .finally(() => this.isLoading = false)
    }
  },
  mounted(){
    this.get()
  }
}
</script>

<style>

</style>