<template>
  <div>
    <p v-if="isLoading">Loading...</p>
    <ul>
      <li v-for="(alat, index) in kelompok_tes" :key="index">{{alat.nama}}</li>
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
      kelompok_tes: [],
      kelompokTesData: {
        nama: '',
        waktu: 0,
        jenis_soal: '',
        petunjuk: ''
      }
    }
  },
  methods: {
    get(){
      this.isLoading = true
      const headers = {Authorization: 'Bearer ' + localStorage.getItem('token')}
      axios.get(`${API.URL}/kelompok-tes?alat_tes_id=${this.$route.params.alat_tes_id}`, {headers})
        .then(res => {
          this.kelompok_tes = res.data.doc.kelompok_tes
        })
        .catch(e => {
          console.log(e)
          alert('error')
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