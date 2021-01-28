<template>
  <div class="flex justify-center">
    <button @click="updateSelected('1')" :class="[arr.includes('1')?'bg-green-600':'bg-blue-special']" class="py-2 px-3 mx-1 text-2xl text-white font-semibold rounded hover:bg-blue-600 focus:outline-none">1</button>
    <button @click="updateSelected('2')" :class="[arr.includes('2')?'bg-green-600':'bg-blue-special']" class="py-2 px-3 mx-1 text-2xl text-white font-semibold rounded hover:bg-blue-600 focus:outline-none">2</button>
    <button @click="updateSelected('3')" :class="[arr.includes('3')?'bg-green-600':'bg-blue-special']" class="py-2 px-3 mx-1 text-2xl text-white font-semibold rounded hover:bg-blue-600 focus:outline-none">3</button>
    <button @click="updateSelected('4')" :class="[arr.includes('4')?'bg-green-600':'bg-blue-special']" class="py-2 px-3 mx-1 text-2xl text-white font-semibold rounded hover:bg-blue-600 focus:outline-none">4</button>
    <button @click="updateSelected('5')" :class="[arr.includes('5')?'bg-green-600':'bg-blue-special']" class="py-2 px-3 mx-1 text-2xl text-white font-semibold rounded hover:bg-blue-600 focus:outline-none">5</button>
    <button @click="updateSelected('6')" :class="[arr.includes('6')?'bg-green-600':'bg-blue-special']" class="py-2 px-3 mx-1 text-2xl text-white font-semibold rounded hover:bg-blue-600 focus:outline-none">6</button>
    <button @click="updateSelected('7')" :class="[arr.includes('7')?'bg-green-600':'bg-blue-special']" class="py-2 px-3 mx-1 text-2xl text-white font-semibold rounded hover:bg-blue-600 focus:outline-none">7</button>
    <button @click="updateSelected('8')" :class="[arr.includes('8')?'bg-green-600':'bg-blue-special']" class="py-2 px-3 mx-1 text-2xl text-white font-semibold rounded hover:bg-blue-600 focus:outline-none">8</button>
    <button @click="updateSelected('9')" :class="[arr.includes('9')?'bg-green-600':'bg-blue-special']" class="py-2 px-3 mx-1 text-2xl text-white font-semibold rounded hover:bg-blue-600 focus:outline-none">9</button>
    <button @click="updateSelected('0')" :class="[arr.includes('0')?'bg-green-600':'bg-blue-special']" class="py-2 px-3 mx-1 text-2xl text-white font-semibold rounded hover:bg-blue-600 focus:outline-none">0</button>
  </div>
</template>

<script>
export default {
  props: ['value'],
  data(){
    return {
      arr: []
    }
  },
  methods:{
    updateSelected(val){
      let temp = [...this.value]
      if(this.value.includes(val)){
        temp = temp.filter(item => {
          return item !== val
        })
      }else{
        temp.push(val)
        temp.sort()
      }
      this.$emit('input', temp.join(''))
    }
  },
  created(){
    this.arr = this.value.split('')
  },
  watch: {
    value: function(val) {
      this.arr = val.split('')
    }
  }
}
</script>

<style>

</style>