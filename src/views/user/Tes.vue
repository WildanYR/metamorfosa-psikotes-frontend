<template>
  <div class="flex">
    <Loading v-if="$store.state.isLoading"></Loading>
    <ModalForm v-if="modal.show" title="Apakah anda yakin ingin melanjutkan?" confirmClass="bg-yellow-400 hover:bg-red-700 text-white" @confirm="handleNext" @cancel="modal.show = false">
      <p>masih ada waktu sisa untuk mengerjakan</p>
      <p>sudah yakin ingin {{modal.type==='next'?'melanjutkan':'selesai mengerjakan'}}?</p>
    </ModalForm>
    <div class="mt-20 ml-20 flex-grow w-2/3">
      <div class="w-full px-4 mt-4">
        <p class="block text-xl font-bold text-gray-700 mb-3">soal no {{selectedSoalIndex+1}}</p>
        <TextEditor :editable="false" v-model="soals[selectedSoalIndex].soal"></TextEditor>
      </div>
      <div v-if="jenis_soal === 'pilihan_ganda'" class="w-full px-4 mt-7">
        <p class="block text-xl font-bold text-gray-700 mb-3">Opsi</p>
        <RadioTes value="A" @updateSelected="saveJawaban" :active="soals[selectedSoalIndex].jawaban === 'A'" v-show="soals[selectedSoalIndex].opsi[0].text"><TextEditor :editable="false" v-model="soals[selectedSoalIndex].opsi[0].text"></TextEditor></RadioTes>
        <RadioTes value="B" @updateSelected="saveJawaban" :active="soals[selectedSoalIndex].jawaban === 'B'" v-show="soals[selectedSoalIndex].opsi[1].text"><TextEditor :editable="false" v-model="soals[selectedSoalIndex].opsi[1].text"></TextEditor></RadioTes>
        <RadioTes value="C" @updateSelected="saveJawaban" :active="soals[selectedSoalIndex].jawaban === 'C'" v-show="soals[selectedSoalIndex].opsi[2].text"><TextEditor :editable="false" v-model="soals[selectedSoalIndex].opsi[2].text"></TextEditor></RadioTes>
        <RadioTes value="D" @updateSelected="saveJawaban" :active="soals[selectedSoalIndex].jawaban === 'D'" v-show="soals[selectedSoalIndex].opsi[3].text"><TextEditor :editable="false" v-model="soals[selectedSoalIndex].opsi[3].text"></TextEditor></RadioTes>
        <RadioTes value="E" @updateSelected="saveJawaban" :active="soals[selectedSoalIndex].jawaban === 'E'" v-show="soals[selectedSoalIndex].opsi[4].text"><TextEditor :editable="false" v-model="soals[selectedSoalIndex].opsi[4].text"></TextEditor></RadioTes>
      </div>
      <div v-else-if="jenis_soal === 'pilihan_ganda_sejajar'" class="w-full px-4 mt-7">
        <p class="block text-xl font-bold text-gray-700 mb-3">Opsi</p>
        <div class="flex flex-wrap justify-center">
          <RadioTes class="m-4" value="A" @updateSelected="saveJawaban" :active="soals[selectedSoalIndex].jawaban === 'A'" v-show="soals[selectedSoalIndex].opsi[0].text"><TextEditor :editable="false" v-model="soals[selectedSoalIndex].opsi[0].text"></TextEditor></RadioTes>
          <RadioTes class="m-4" value="B" @updateSelected="saveJawaban" :active="soals[selectedSoalIndex].jawaban === 'B'" v-show="soals[selectedSoalIndex].opsi[1].text"><TextEditor :editable="false" v-model="soals[selectedSoalIndex].opsi[1].text"></TextEditor></RadioTes>
          <RadioTes class="m-4" value="C" @updateSelected="saveJawaban" :active="soals[selectedSoalIndex].jawaban === 'C'" v-show="soals[selectedSoalIndex].opsi[2].text"><TextEditor :editable="false" v-model="soals[selectedSoalIndex].opsi[2].text"></TextEditor></RadioTes>
          <RadioTes class="m-4" value="D" @updateSelected="saveJawaban" :active="soals[selectedSoalIndex].jawaban === 'D'" v-show="soals[selectedSoalIndex].opsi[3].text"><TextEditor :editable="false" v-model="soals[selectedSoalIndex].opsi[3].text"></TextEditor></RadioTes>
          <RadioTes class="m-4" value="E" @updateSelected="saveJawaban" :active="soals[selectedSoalIndex].jawaban === 'E'" v-show="soals[selectedSoalIndex].opsi[4].text"><TextEditor :editable="false" v-model="soals[selectedSoalIndex].opsi[4].text"></TextEditor></RadioTes>
        </div>
      </div>
      <div v-else-if="jenis_soal === 'uraian'" class="w-full px-4 mt-10">
        <p class="block text-xl font-bold text-gray-700 mb-3">tuliskan jawaban dibawah</p>
        <input type="text" v-model="inputUraian" class="p-2 border-2 border-gray-300 rounded-md w-full">
      </div>
      <div v-else-if="jenis_soal === 'angka'" class="w-full px-4 mt-10">
        <p class="block text-xl font-bold text-gray-700 mb-3">Opsi</p>
        <MultiAngka v-model="inputAngka"></MultiAngka>
      </div>
      <div v-else-if="jenis_soal === 'opini'" class="w-full px-4 mt-10">
        <p class="block text-xl font-bold text-gray-700 mb-3">Opsi</p>
        <RadioTes value="A" @updateSelected="saveJawaban" :active="soals[selectedSoalIndex].jawaban === 'A'">Tidak Setuju</RadioTes>
        <RadioTes value="B" @updateSelected="saveJawaban" :active="soals[selectedSoalIndex].jawaban === 'B'">Ragu-Ragu</RadioTes>
        <RadioTes value="C" @updateSelected="saveJawaban" :active="soals[selectedSoalIndex].jawaban === 'C'">Setuju</RadioTes>
      </div>
      <div v-else class="w-full px-4 mt-10">
        <p class="block text-xl font-bold text-gray-700 mb-3">Opsi</p>
        <RadioTes :value="soals[selectedSoalIndex].opsi[0].opsi" @updateSelected="saveJawaban" :active="soals[selectedSoalIndex].jawaban === soals[selectedSoalIndex].opsi[0].opsi">Ya</RadioTes>
        <RadioTes value="-" @updateSelected="saveJawaban" :active="soals[selectedSoalIndex].jawaban === '-'">Tidak</RadioTes>
      </div>
    </div>
    <div class="p-4 w-1/3 max-w-sm border-2">
      <div class="text-center space-y-2">
        <h2 class="text-3xl font-bold">{{alat_tes}}</h2>
        <h3 class="text-xl font-medium">{{kelompok_tes}}</h3>
        <Timer v-if="timer !== 0" :countdown="timer" @timeup="timeup"></Timer>
      </div>
      <p class="border-b-2 my-5"></p>
      <div>
        <h3 class="text-xl font-medium mb-3">Nomor Soal:</h3>
        <div class="flex flex-wrap mx-2 justify-center">
          <button v-for="n in soals.length" :key="n" @click="selectedSoalIndex = n-1" :class="[selectedSoalIndex === n-1?'bg-yellow-special':soals[n-1].ragu?'bg-red-600 text-white':soals[n-1].jawaban?'bg-green-600 text-white':'']" class="p-3 rounded-xl bg-gray-200 font-bold text-xl m-1">{{n &lt; 10?'0'+n:n}}</button>
        </div>
      </div>
      <div class="mt-3">
        <!-- <button @click="setRagu" :class="[soals[selectedSoalIndex].ragu?'bg-red-600 text-white':'bg-gray-200']" class="p-3 rounded-xl font-semibold w-full">Ragu-Ragu</button> -->
        <button v-if="$store.state.kelompokTesIndex !== $store.state.soal.kelompok_tes.length-1" @click="modal.type= 'next';modal.show = true" class="p-3 mt-5 rounded-xl font-semibold bg-yellow-special w-full">Kelompok Soal Selanjutnya</button>
        <button v-else @click="modal.type= 'end';modal.show = true" class="p-3 mt-5 rounded-md bg-blue-special text-white font-semibold hover:bg-blue-700 w-full">Submit Tes</button>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import Loading from '../../components/Loading.vue'
import ModalForm from '../../components/ModalForm.vue'
import TextEditor from '../../components/TextEditor.vue'
import RadioTes from '../../components/RadioTes.vue'
import MultiAngka from '../../components/MultiAngka.vue'
import Timer from '../../components/Timer.vue'
export default {
  components: {Loading, RadioTes, MultiAngka, TextEditor, ModalForm, Timer},
  data(){
    return {
      modal:{
        show: false,
        type: 'next'
      },
      selectedSoalIndex: 0,
      timeout: null
    }
  },
  methods: {
    saveJawaban(jawaban){
      this.$store.commit('setJawaban', {index: this.selectedSoalIndex, jawaban})
    },
    // setRagu(){
    //   if(this.soals[this.selectedSoalIndex].ragu) this.$store.commit('setRagu', {index: this.selectedSoalIndex, ragu: false})
    //   else this.$store.commit('setRagu', {index: this.selectedSoalIndex, ragu: true})
    // },
    timeup(){
      alert('waktu telah habis')
      this.modal.type = this.$store.state.kelompokTesIndex !== this.$store.state.soal.kelompok_tes.length-1?'next':'end'
      this.handleNext()
    },
    handleNext(){
      if(this.modal.type === 'next'){
        this.$store.commit('setKelompokTes', this.$store.state.kelompokTesIndex + 1)
        this.$store.commit('setTimePassed', 0)
        this.$router.replace('/petunjuk')
      }else{
        this.$store.dispatch('submitTes')
      }
    },
  },
  computed: {
    inputUraian: {
      get(){return this.soals[this.selectedSoalIndex].jawaban?this.soals[this.selectedSoalIndex].jawaban:''},
      set(val){
        this.$store.commit('setJawaban', {index: this.selectedSoalIndex, jawaban: val})
      }
    },
    inputAngka: {
      get(){return this.soals[this.selectedSoalIndex].jawaban?this.soals[this.selectedSoalIndex].jawaban:'' },
      set(val){
        this.$store.commit('setJawaban', {index: this.selectedSoalIndex, jawaban: val})
      }
    },
    ...mapGetters({
      jenis_soal: 'getJenisSoal',
      soals: 'getSoals',
      alat_tes: 'getAlatTes',
      kelompok_tes: 'getKelompokTes',
      timer: 'getTimer',
    })
  },
  mounted(){
    if (localStorage.getItem('reloaded')) {
        localStorage.removeItem('reloaded')
        // this.$store.dispatch('checkSoal')
    } else {
        localStorage.setItem('reloaded', '1')
        location.reload()
    }
  }
}
</script>