<template>
  <div>
    <Loading v-if="$store.state.isLoading"></Loading>
    <ModalForm v-if="modal.show" title="Apakah anda yakin ingin melanjutkan?" confirmClass="bg-yellow-400 hover:bg-red-700 text-white" @confirm="handleNext" @cancel="modal.show = false">
      <p>masih ada waktu sisa untuk mengerjakan</p>
      <p>sudah yakin ingin {{modal.type==='next'?'melanjutkan':'selesai mengerjakan'}}?</p>
    </ModalForm>

    <div class="text-center mt-7">
      <Timer v-if="timer !== 0" :countdown="timer" @timeup="timeup"></Timer>
      <h2 class="text-3xl font-bold">{{alat_tes}}</h2>
      <h3 class="text-xl font-medium">{{kelompok_tes}}</h3>
    </div>

    <div class="m-20">
      <div v-for="(soal, index) in soals" :key="index" class="flex-grow mb-10">
        <div class="w-full px-4 mt-4">
          <p class="block text-lg font-semibold text-gray-600 mb-3">soal no {{index+1}}</p>
          <TextEditor :editable="false" v-model="soal.soal"></TextEditor>
        </div>
        <div class="mt-5 px-4">
          <div v-if="jenis_soal === 'pilihan_ganda'">
            <p class="block mb-3 text-lg font-semibold text-gray-600">Opsi</p>
            <RadioTes value="A" @updateSelected="saveJawaban($event, index)" :active="soal.jawaban === 'A'" v-show="soal.opsi[0].text"><TextEditor :editable="false" v-model="soal.opsi[0].text"></TextEditor></RadioTes>
            <RadioTes value="B" @updateSelected="saveJawaban($event, index)" :active="soal.jawaban === 'B'" v-show="soal.opsi[1].text"><TextEditor :editable="false" v-model="soal.opsi[1].text"></TextEditor></RadioTes>
            <RadioTes value="C" @updateSelected="saveJawaban($event, index)" :active="soal.jawaban === 'C'" v-show="soal.opsi[2].text"><TextEditor :editable="false" v-model="soal.opsi[2].text"></TextEditor></RadioTes>
            <RadioTes value="D" @updateSelected="saveJawaban($event, index)" :active="soal.jawaban === 'D'" v-show="soal.opsi[3].text"><TextEditor :editable="false" v-model="soal.opsi[3].text"></TextEditor></RadioTes>
            <RadioTes value="E" @updateSelected="saveJawaban($event, index)" :active="soal.jawaban === 'E'" v-show="soal.opsi[4].text"><TextEditor :editable="false" v-model="soal.opsi[4].text"></TextEditor></RadioTes>
          </div>
          <div v-else-if="jenis_soal === 'pilihan_ganda_sejajar'">
            <p class="block mb-3 text-lg font-semibold text-gray-600">Opsi</p>
            <div class="flex flex-wrap justify-center">
              <RadioTes class="m-4" value="A" @updateSelected="saveJawaban($event, index)" :active="soal.jawaban === 'A'" v-show="soal.opsi[0].text"><TextEditor :editable="false" v-model="soal.opsi[0].text"></TextEditor></RadioTes>
              <RadioTes class="m-4" value="B" @updateSelected="saveJawaban($event, index)" :active="soal.jawaban === 'B'" v-show="soal.opsi[1].text"><TextEditor :editable="false" v-model="soal.opsi[1].text"></TextEditor></RadioTes>
              <RadioTes class="m-4" value="C" @updateSelected="saveJawaban($event, index)" :active="soal.jawaban === 'C'" v-show="soal.opsi[2].text"><TextEditor :editable="false" v-model="soal.opsi[2].text"></TextEditor></RadioTes>
              <RadioTes class="m-4" value="D" @updateSelected="saveJawaban($event, index)" :active="soal.jawaban === 'D'" v-show="soal.opsi[3].text"><TextEditor :editable="false" v-model="soal.opsi[3].text"></TextEditor></RadioTes>
              <RadioTes class="m-4" value="E" @updateSelected="saveJawaban($event, index)" :active="soal.jawaban === 'E'" v-show="soal.opsi[4].text"><TextEditor :editable="false" v-model="soal.opsi[4].text"></TextEditor></RadioTes>
            </div>
          </div>
          <div v-else-if="jenis_soal === 'uraian'">
            <p class="block mb-3 text-lg font-semibold text-gray-600">tuliskan jawaban dibawah</p>
            <input type="text" :value="soal.jawaban?soal.jawaban:''" @input="inputText($event.target.value, index)" class="p-2 border-2 border-gray-300 rounded-md w-full">
          </div>
          <div v-else-if="jenis_soal === 'angka'">
            <p class="block mb-3 text-lg font-semibold text-gray-600">Opsi</p>
            <MultiAngka :value="soal.jawaban?soal.jawaban:''" @input="inputText($event, index)"></MultiAngka>
          </div>
          <div v-else-if="jenis_soal === 'opini'">
            <p class="block mb-3 text-lg font-semibold text-gray-600">Opsi</p>
            <RadioTes value="A" @updateSelected="saveJawaban($event, index)" :active="soal.jawaban === 'A'">Tidak Setuju</RadioTes>
            <RadioTes value="B" @updateSelected="saveJawaban($event, index)" :active="soal.jawaban === 'B'">Ragu-Ragu</RadioTes>
            <RadioTes value="C" @updateSelected="saveJawaban($event, index)" :active="soal.jawaban === 'C'">Setuju</RadioTes>
          </div>
          <div v-else>
            <p class="block mb-3 text-lg font-semibold text-gray-600">Opsi</p>
            <RadioTes :value="soal.opsi[0].opsi" @updateSelected="saveJawaban($event, index)" :active="soal.jawaban === soal.opsi[0].opsi">Ya</RadioTes>
            <RadioTes value="-" @updateSelected="saveJawaban($event, index)" :active="soal.jawaban === '-'">Tidak</RadioTes>
          </div>
        </div>
      </div>
      
      <div class="mt-3">
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
      timeout: null
    }
  },
  methods: {
    saveJawaban(jawaban, index){
      this.$store.commit('setJawaban', {index, jawaban})
    },
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
    inputText(val, index){
      this.saveJawaban(val, index)
    }
  },
  computed: {
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
    } else {
        localStorage.setItem('reloaded', '1')
        location.reload()
    }
  }
}
</script>