<template>
  <select name="prd_box" id="prd_box">
    <option value="1">asd</option>
    <option value="1">asd</option>
    <option value="1">asd</option>
    <option value="1">asd</option>
    <option value="1">asd</option>
    <option value="1">asd</option>
    <option value="1">asd</option>
    <option value="1">asd</option>
    <option value="1">asd</option>
    <option value="1">asd</option>
    <option value="1">asd</option>
    <!-- <option value="params">{{ params }}</option> -->
  </select>

</template>

<script setup>
import { defineProps, onBeforeMount } from 'vue';

const props = defineProps(["params"]);
onBeforeMount(()=> {
  console.log("자식",props);
})

</script>