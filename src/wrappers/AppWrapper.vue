<template>
  <div>
    <div class="py-5 px-10 bg-blue-500 flex justify-between items-center w-full">
        <img width="120" src="../assets/logo.png" alt="">
        <div>
          <p class="text-white font-semibold text-lg">{{$store.state.user.email}}</p>
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