<template>
  <div>
    <Loading v-if="isLoading"></Loading>
    <h1 class="text-2xl text-center mt-10 font-semibold">pilih tes yang ingin dikerjakan</h1>
    <div v-if="!$store.state.isDoingTes" class="container mx-5">
      <div class="flex flex-wrap justify-center mt-8">
        <div v-for="(alat, index) in alat_tes" :key="index" class="rounded-lg border-2 border-gray-200 bg-white m-4">
          <div class="flex flex-col justify-center items-center px-5 pt-5">
            <svg class="w-28 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/>
              <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
            </svg>
            <p class="text-blue-special text-2xl font-semibold mt-2">{{alat.nama}}</p>
          </div>
          <button @click="kerjakanSoal(alat.alat_tes_id)" :class="[alat.dikerjakan?'bg-gray-300':'bg-blue-special text-white hover:bg-blue-900']" class="m-0 mt-2 p-2 rounded-b-lg w-full font-semibold focus:outline-none" :disabled="alat.dikerjakan">kerjakan</button>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-4xl font-bold text-red-500">Silahkan refresh browser</div>
  </div>
</template>

<script>
import axios from 'axios'
import API from '../../config.api'
import Loading from '../../components/Loading.vue'
export default {
  components: {Loading},
  data(){
    return {
      isLoading: false,
      alat_tes: [],
    }
  },
  methods:{
    kerjakanSoal(alat_tes_id){
      this.isLoading = true
      const headers = {Authorization: 'Bearer ' + localStorage.getItem('token')}
      axios.get(`${API.URL}/soal/tes/${alat_tes_id}`, {headers})
        .then(res => {
          const alat_tes = res.data.doc.alat_tes
          this.$store.commit('setSoal', alat_tes)
          this.$store.commit('setAlatTes', alat_tes_id)
          this.$store.commit('setTes', true)
          this.$store.commit('setKelompokTes', 0)
          this.$store.commit('setTimePassed', 0)
          this.$router.push('/petunjuk')
        })
        .catch(e => {
          console.log(e)
          alert('error: '+e.response.data.message)
        })
        .finally(() => {
          this.isLoading = false
          // this.$store.commit('setChangeSoal', false)
        })
    }
  },
  mounted(){
    this.isLoading = true
    const headers = {Authorization: 'Bearer ' + localStorage.getItem('token')}
    axios.get(`${API.URL}/alat-tes`, {headers})
      .then(res => {
        this.alat_tes = res.data.doc.alat_tes
        return axios.get(`${API.URL}/soal/alat-tes`, {headers})
      })
      .then(res => {
        const hasilTes = res.data.doc.alat_tes
        const temp = this.alat_tes.map(alat => {
          hasilTes.forEach(hasil => {
            if(alat.alat_tes_id === hasil.alat_tes_id) {
              alat.dikerjakan = true
            }
          })
          return alat
        })
        this.alat_tes = temp
      })
      .catch(e => {
        console.log(e)
        alert('error: '+e.response.data.message)
      })
      .finally(() => this.isLoading = false)
  }
}
</script>