<template>
  <div>
    <MultiAngka v-model="angka"></MultiAngka>
    <p>{{angka}}</p>
  </div>
</template>

<script>
// import debounce from 'debounce'
import MultiAngka from '../components/MultiAngka.vue'
export default {
  components: {MultiAngka},
  data(){
    return {
      angka: '123',
      timeout: null
    }
  },
  methods: {
    // updateSelected(value){
    //   this.selected = value
    // },
    // debounceJawab: debounce((jawaban) => {
    //   this.selected = jawaban
    // }, 500),
  },
  computed: {
    // input: {
    //   get(){return this.uraian},
    //   set(val){
    //     if (this.timeout) clearTimeout(this.timeout)
    //     this.timeout = setTimeout(() => {
    //       this.uraian = val
    //     }, 500)
    //   }
    // }
    angkaFilter: {
      get(){return this.angka.split('')},
      set(val){
        this.angka = val.join('')
      }
    }
  }
}
</script>

<style>

</style>