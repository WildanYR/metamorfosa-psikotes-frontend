<template>
  <div class="flex">
    <div class="relative w-5 h-5 border border-gray-500 rounded-full mr-2" @click="$emit('updateSelected', value)">
      <div v-show="active" class="absolute w-3.5 h-3.5 top-0.5 left-0.5 bg-yellow-special rounded-full"></div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ['value', 'active']
}
</script>

<style>

</style>