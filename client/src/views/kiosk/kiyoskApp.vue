<template>
  <div>
      <!-- <layout /> -->
      <router-view />
      <Toast />
    </div>
  </template>
  
  <script>
  import layout from '@/layout/AppLayout.vue';
  
  export default {
    components : {
      layout
    }
  }
</script>