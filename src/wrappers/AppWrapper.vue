<template>
  <div>
    <div class="py-5 px-10 bg-blue-500 flex justify-between items-center w-full">
        <img width="120" src="../assets/logo.png" alt="">
        <div class="flex items-center">
          <p class="text-white font-semibold text-lg mr-5">{{$store.state.user.email}}</p>
          <button v-if="!$store.state.isDoingTes" @click="$store.dispatch('logout')" class="flex items-center p-3 rounded-lg bg-blue-200 text-blue-900 font-bold hover:bg-blue-300">
            <svg class="w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
              <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
            </svg>
            <p>keluar</p>
          </button>
        </div>
     </div>
     <router-view></router-view>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>