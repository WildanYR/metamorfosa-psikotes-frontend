<template>
  <div class="text-center text-red-600 font-bold">
    soal ini punya batas waktu
  </div>
</template>

<script>
export default {
  props: ['countdown'],
  data(){
    return {
      timerInterval: null
    }
  },
  computed: {
    timeLeft(){
      return this.countdown - this.$store.state.time_passed
    },
  },
  methods: {
    onTimesUp(){
      clearInterval(this.timerInterval)
      this.$emit('timeup')
    },

    startTimer(){
      this.timerInterval = setInterval(() => {this.$store.commit('addTimePassed')}, 1000);
    }
  },
  mounted(){
    this.startTimer()
  },
  watch:{
    timeLeft(val){
      if(val <= 0){
        setTimeout(() => {this.onTimesUp()}, 1000)
      }
    }
  }
}
</script>

<style>

</style>