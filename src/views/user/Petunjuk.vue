<template>
  <div class="petunjuk flex">
    <div class="p-4 flex-grow">
      <h1 class="text-4xl font-semibold text-center">Petunjuk cara mengerjakan tes</h1>
      <p class="border-b-2 my-5"></p>
      <div class="w-full px-4 mt-4">
        <TextEditor :value="petunjuk" :editable="false"></TextEditor>
      </div>
      <div class="flex justify-end items-center bg-gray-200 p-3 mt-5 rounded-md">
        <button @click="$router.push('/tes')" class="bg-blue-special py-3 px-5 rounded text-white font-semibold hover:bg-blue-900 focus:outline-none focus:bg-blue-900">mulai kerjakan tes</button>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import TextEditor from '../../components/TextEditor.vue'
export default {
  components: {TextEditor},
  computed: {
    ...mapGetters({
      petunjuk: 'getPetunjuk'   
    })
  },
}
</script>

<style lang="postcss">
  petunjuk table th,td {
    @apply border-0
  }
</style>