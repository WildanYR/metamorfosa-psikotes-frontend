<template>
  <div class="flex">
    <Loading v-if="isLoading"></Loading>
    <div class="=mt-20 ml-20 flex-grow w-2/3">
      <h1 class="text-4xl font-bold">Input Soal</h1>
      <p class="border-b-2 my-5"></p>
      <div class="w-full px-4 mt-4">
        <p class="block text-xl font-bold text-gray-700">soal</p>
        <TextEditor v-model="soals[selectedSoalIndex].soal"></TextEditor>
      </div>
      <div v-if="$route.params.jenis_soal === 'pilihan_ganda'" class="w-full px-4 mt-10">
        <p class="block text-xl font-bold text-gray-700">Opsi</p>
        <ul class="list-disc">
          <li><TextEditor v-model="soals[selectedSoalIndex].opsi[0].text"></TextEditor></li>
          <li><TextEditor v-model="soals[selectedSoalIndex].opsi[1].text"></TextEditor></li>
          <li><TextEditor v-model="soals[selectedSoalIndex].opsi[2].text"></TextEditor></li>
          <li><TextEditor v-model="soals[selectedSoalIndex].opsi[3].text"></TextEditor></li>
          <li><TextEditor v-model="soals[selectedSoalIndex].opsi[4].text"></TextEditor></li>
        </ul>
      </div>
      <div v-else-if="$route.params.jenis_soal === 'custom'" class="w-full px-4 mt-10">
        <p class="block text-xl font-bold text-gray-700">Kelompok jawaban</p>
        <TextEditor v-model="soals[selectedSoalIndex].opsi[0].opsi"></TextEditor>
      </div>
    </div>
    <div class="p-4 w-1/3 max-w-sm">
      <div class="text-center space-y-2">
        <h2 class="text-3xl font-bold">{{alat_tes}}</h2>
        <h3 class="text-xl font-medium">{{kelompok_tes}}</h3>
      </div>
      <p class="border-b-2 my-5"></p>
      <div>
        <h3 class="text-xl font-medium mb-5">Nomor Soal:</h3>
        <div class="flex flex-wrap mx-2">
          <button v-for="n in soals.length" :key="n" @click="selectedSoalIndex = n-1" :class="[selectedSoalIndex === n-1?'bg-yellow-special':'']" class="p-3 rounded-xl bg-gray-200 font-bold text-xl m-1">{{n &lt; 10?'0'+n:n}}</button>
          <button @click="addNomorSoal" class="p-3 rounded-xl bg-gray-200 font-bold text-xl m-1">+</button>
        </div>
      </div>
      <button @click="upsetSoal" class="p-4 mt-5 rounded-md bg-blue-special text-white font-bold hover:bg-blue-700 w-full">Submit Soal</button>
      <button v-show="selectedSoalIndex === soals.length-1" @click="removeNomorSoal" class="p-4 mt-5 rounded-md bg-red-500 text-white font-bold hover:bg-red-700 w-full">Hapus Soal</button>
    </div>
  </div>
</template>

<script>
import API from '../../config.api'
import axios from 'axios'
import TextEditor from '../../components/TextEditor.vue'
import Loading from '../../components/Loading.vue'
export default {
  components: {TextEditor, Loading},
  data(){
    return {
      isLoading: false,
      alat_tes: '',
      kelompok_tes: '',
      soals: [
        {
          nomor: 1,
          soal: '',
          kelompok_tes_id: this.$route.params.kelompok_tes_id,
          opsi: this.$route.params.jenis_soal==='pilihan_ganda'?[
            {opsi: 'A',text: ''},{opsi: 'B',text: ''},{opsi: 'C',text: ''},{opsi: 'D',text: ''},{opsi: 'E',text: ''}
          ]:this.$route.params.jenis_soal==='custom'?[
            {opsi: '',text: ''}
          ]:null
        }
      ],
      selectedSoalIndex: 0
    }
  },
  methods: {
    addNomorSoal(){
      this.soals.push({
        nomor: this.soals.length+1,
        soal: '',
        kelompok_tes_id: this.$route.params.kelompok_tes_id,
        opsi: this.$route.params.jenis_soal==='pilihan_ganda'?[
          {opsi: 'A',text: ''},{opsi: 'B',text: ''},{opsi: 'C',text: ''},{opsi: 'D',text: ''},{opsi: 'E',text: ''}
        ]:this.$route.params.jenis_soal==='custom'?[
            {opsi: '',text: ''}
          ]:null
      })
      this.selectedSoalIndex = this.soals.length - 1
    },
    removeNomorSoal(){
      this.selectedSoalIndex = this.soals.length-2
      this.soals.splice(-1,1)
    },
    getSoal(){
      this.isLoading = true
      const headers = {Authorization: 'Bearer ' + localStorage.getItem('token')}
      axios.get(`${API.URL}/soal?kelompok_tes_id=${this.$route.params.kelompok_tes_id}`, {headers})
        .then(res => {
          const {soal} = res.data.doc
          if(soal.length) this.soals = soal
        })
        .catch(e => {
          alert('error: '+e.response.data.message)
          console.log(e)
        })
        .finally(() => this.isLoading = false)
    },
    upsetSoal(){
      this.isLoading = true
      const headers = {Authorization: 'Bearer ' + localStorage.getItem('token')}
      axios.post(`${API.URL}/soal/upset`, {soals: this.soals}, {headers})
        .then(() => {
          this.getSoal()
        })
        .catch(e => {
          alert('error: '+e.response.data.message)
          console.log(e)
        })
        .finally(() => this.isLoading = false)
    }
  },
  mounted(){
    this.isLoading = true
    const headers = {Authorization: 'Bearer ' + localStorage.getItem('token')}
    axios.get(`${API.URL}/kelompok-tes?kelompok_tes_id=${this.$route.params.kelompok_tes_id}`, {headers})
      .then(res => {
        const {nama, alat_tes_id} = res.data.doc.kelompok_tes[0]
        this.kelompok_tes = nama
        return axios.get(`${API.URL}/alat-tes?alat_tes_id=${alat_tes_id}`, {headers})
      })
      .then(res => {
        const {nama} = res.data.doc.alat_tes[0]
        this.alat_tes = nama
        this.getSoal()
      })
      .catch(e => {
        alert('error: '+e.response.data.message)
        console.log(e)
      })
      .finally(() => this.isLoading = false)
  }
}
</script>

<style>

</style>