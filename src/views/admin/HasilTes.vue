<template>
  <div class="container mx-7">
    <Loading v-if="isLoading"></Loading>
    <h1 class="text-center text-2xl font-bold my-5">Hasil Tes</h1>
    <h2 class="text-xl font-semibold mb-3">Pilih User</h2>
    <v-select label="nama_lengkap" :options="userData" v-model="selectedUser" class="w-full"></v-select>
    <div class="mt-8">
      <h2 class="text-xl font-semibold mb-3">Biodata</h2>
      <table class="table-auto border-collapse border border-gray-500">
        <tbody>
          <tr>
            <th class="border border-gray-500 p-2">Email</th>
            <td class="border border-gray-500 p-2">:</td>
            <td class="border border-gray-500 p-2">{{selectedUser.email}}</td>
          </tr>
          <tr>
            <th class="border border-gray-500 p-2">Nama Lengkap</th>
            <td class="border border-gray-500 p-2">:</td>
            <td class="border border-gray-500 p-2">{{selectedUser.nama_lengkap}}</td>
          </tr>
          <tr>
            <th class="border border-gray-500 p-2">Tempat Lahir</th>
            <td class="border border-gray-500 p-2">:</td>
            <td class="border border-gray-500 p-2">{{selectedUser.tempat_lahir}}</td>
          </tr>
          <tr>
            <th class="border border-gray-500 p-2">Tanggal Lahir</th>
            <td class="border border-gray-500 p-2">:</td>
            <td class="border border-gray-500 p-2">{{selectedUser.tanggal_lahir}}</td>
          </tr>
          <tr>
            <th class="border border-gray-500 p-2">Jenis Kelamin</th>
            <td class="border border-gray-500 p-2">:</td>
            <td class="border border-gray-500 p-2">{{selectedUser.jenis_kelamin}}</td>
          </tr>
          <tr>
            <th class="border border-gray-500 p-2">Alamat</th>
            <td class="border border-gray-500 p-2">:</td>
            <td class="border border-gray-500 p-2">{{selectedUser.alamat}}</td>
          </tr>
          <tr>
            <th class="border border-gray-500 p-2">Agama</th>
            <td class="border border-gray-500 p-2">:</td>
            <td class="border border-gray-500 p-2">{{selectedUser.agama}}</td>
          </tr>
          <tr>
            <th class="border border-gray-500 p-2">Pendidikan Terakhir</th>
            <td class="border border-gray-500 p-2">:</td>
            <td class="border border-gray-500 p-2">{{selectedUser.pendidikan_terakhir}}</td>
          </tr>
          <tr>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex flex-wrap mt-8">
      <div v-for="(kelompok_tes, ktsIdx) in selectedUser.kelompok_tes" :key="'kts-'+ktsIdx" class="m-5">
        <h2 class="text-xl font-semibold mb-3">{{kelompok_tes.nama}}</h2>
        <table class="table-auto border-collapse border border-gray-500">
          <thead>
            <tr>
              <th class="border border-gray-500 p-1">No</th>
              <th class="border border-gray-500 p-1 hover:bg-blue-200 hover:cursor-pointer" @click="copyColumn(kelompok_tes.jawaban_user)">Jawaban</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(jawaban, jwbIdx) in kelompok_tes.jawaban_user" :key="'jwb-'+jwbIdx">
              <td class="border border-gray-500 p-1">{{jawaban.nomor}}</td>
              <td class="border border-gray-500 p-1 text-center">{{jawaban.jawaban}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from '../../components/Loading.vue'
import VSelect from 'vue-select'
import axios from 'axios'
import API from '../../config.api'
export default {
  components: {Loading, 'v-select': VSelect},
  data(){
    return {
      isLoading: false,
      userData: [],
      selectedUser: {}
    }
  },
  methods: {
    copyColumn(data){
      const jwbText = data.map(item => item.jawaban).join('\r\n')
      this.$copyText(jwbText)
        .then(() => {
          alert('jawaban copied')
        })
        .catch(e => {
          alert(`copy Error: ${e.toString()}`)
        })
      console.log(jwbText)
    }
  },
  mounted(){
    this.isLoading = true
    const headers = {Authorization: 'Bearer ' + localStorage.getItem('token')}
    axios.get(`${API.URL}/soal/jawaban/${this.$route.params.alat_tes_id}`, {headers})
      .then(res => {
        this.userData = res.data.doc.user
      })
      .catch(e => {
        alert('error: '+e.response.data.message)
        console.log(e)
      })
      .finally(() => {
        this.isLoading = false
      })
  }
}
</script>

<style>

</style>