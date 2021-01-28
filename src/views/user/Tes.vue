<template>
  <div class="flex">
    <Loading v-if="$store.state.isLoading"></Loading>
    <div class="p-4 flex-grow">
      <div class="w-full px-4 mt-4">
        <p class="block text-xl font-bold text-gray-700">soal</p>
        <TextEditor :editable="false" v-model="soals[selectedSoalIndex].soal"></TextEditor>
      </div>
      <div v-if="$route.params.jenis_soal === 'pilihan_ganda'" class="w-full px-4 mt-10">
        <p class="block text-xl font-bold text-gray-700">Opsi</p>
        <RadioTes value="A" @updateSelected="saveJawaban" :active="soals[selectedSoalIndex].jawaban === 'A'"><TextEditor :editable="false" v-model="soals[selectedSoalIndex].opsi[0].text"></TextEditor></RadioTes>
        <RadioTes value="B" @updateSelected="saveJawaban" :active="soals[selectedSoalIndex].jawaban === 'B'"><TextEditor :editable="false" v-model="soals[selectedSoalIndex].opsi[1].text"></TextEditor></RadioTes>
        <RadioTes value="C" @updateSelected="saveJawaban" :active="soals[selectedSoalIndex].jawaban === 'C'"><TextEditor :editable="false" v-model="soals[selectedSoalIndex].opsi[2].text"></TextEditor></RadioTes>
        <RadioTes value="D" @updateSelected="saveJawaban" :active="soals[selectedSoalIndex].jawaban === 'D'"><TextEditor :editable="false" v-model="soals[selectedSoalIndex].opsi[3].text"></TextEditor></RadioTes>
        <RadioTes value="E" @updateSelected="saveJawaban" :active="soals[selectedSoalIndex].jawaban === 'E'"><TextEditor :editable="false" v-model="soals[selectedSoalIndex].opsi[4].text"></TextEditor></RadioTes>
      </div>
      <div v-else-if="$route.params.jenis_soal === 'uraian'" class="w-full px-4 mt-10">
        <p class="block text-xl font-bold text-gray-700">tuliskan jawaban dibawah</p>
        <input type="text" v-model="inputUraian" class="p-2 border-2 border-gray-300 rounded-md w-full">
      </div>
      <div v-else-if="$route.params.jenis_soal === 'angka'" class="w-full px-4 mt-10">
        <p class="block text-xl font-bold text-gray-700">Opsi</p>
        <MultiAngka v-model="inputAngka"></MultiAngka>
      </div>
      <div v-else-if="$route.params.jenis_soal === 'opini'" class="w-full px-4 mt-10">
        <p class="block text-xl font-bold text-gray-700">Opsi</p>
        <RadioTes value="A" @updateSelected="saveJawaban" :active="soals[selectedSoalIndex].jawaban === 'A'">Tidak Setuju</RadioTes>
        <RadioTes value="B" @updateSelected="saveJawaban" :active="soals[selectedSoalIndex].jawaban === 'B'">Ragu-Ragu</RadioTes>
        <RadioTes value="C" @updateSelected="saveJawaban" :active="soals[selectedSoalIndex].jawaban === 'C'">Setuju</RadioTes>
      </div>
      <div v-else class="w-full px-4 mt-10">
        <p class="block text-xl font-bold text-gray-700">Opsi</p>
        <RadioTes value="A" @updateSelected="saveJawaban" :active="soals[selectedSoalIndex].jawaban === 'A'">Ya</RadioTes>
        <RadioTes value="A" @updateSelected="saveJawaban" :active="soals[selectedSoalIndex].jawaban === 'A'">Tidak</RadioTes>
      </div>
      <div class="flex justify-center items-center bg-gray-200 p-3 mt-5 rounded-md">
        <button>Ragu-Ragu</button>
        <button>Ragu-Ragu</button>
      </div>
    </div>
    <div class="p-4 max-w-sm">
      <div class="text-center space-y-2">
        <h2 class="text-3xl font-bold">{{alat_tes}}</h2>
        <h3 class="text-xl font-medium">{{kelompok_tes}}</h3>
        <p>timer</p>
      </div>
      <p class="border-b-2 my-5"></p>
      <div>
        <h3 class="text-xl font-medium mb-5">Nomor Soal:</h3>
        <div class="flex flex-wrap mx-2 justify-center">
          <button v-for="n in soals.length" :key="n" @click="selectedSoalIndex = n-1" :class="[selectedSoalIndex === n-1?'bg-yellow-special':'']" class="p-3 rounded-xl bg-gray-200 font-bold text-xl m-1">{{n &lt; 10?'0'+n:n}}</button>
        </div>
      </div>
      <button @click="upsetSoal" class="p-4 mt-5 rounded-md bg-blue-special text-white font-bold hover:bg-blue-700 w-full">Submit Soal</button>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import Loading from '../../components/Loading.vue'
import RadioTes from '../../components/RadioTes.vue'
import MultiAngka from '../../components/MultiAngka.vue'
export default {
  components: {Loading, RadioTes, MultiAngka},
  data(){
    return {
      selectedSoalIndex: 0,
      timeout: null
    }
  },
  methods: {
    saveJawaban(jawaban){
      this.$store.commit('setJawaban', {index: this.selectedSoalIndex, jawaban})
    },
  },
  computed: {
    inputUraian: {
      get(){return this.soals[this.selectedSoalIndex].jawaban?this.soals[this.selectedSoalIndex].jawaban:''},
      set(val){
        if (this.timeout) clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.$store.commit('setJawaban', {index: this.selectedSoalIndex, jawaban: val})
        }, 500)
      }
    },
    inputAngka: {
      get(){return this.soals[this.selectedSoalIndex].jawaban?this.soals[this.selectedSoalIndex].jawaban:'' },
      set(val){
        this.$store.commit('setJawaban', {index: this.selectedSoalIndex, jawaban: val})
      }
    },
    ...mapGetters({
      soals: 'getSoals',
      alat_tes: 'getAlatTes',
      kelompok_tes: 'getKelompokTes',
    })
  },
}
</script>

<style>

</style>