<template>
    <button 
      type="button"
      class="btn btn-primary"
      style="color: #fff; height: 30px; line-height: 0.3; width: 100px;"
      @click="sendCodeToParent"
    >
      상세보기
    </button>
  </template>
  
  <script setup>
  import { defineProps } from "vue";
  
  const props = defineProps(["params"]);
  
  const sendCodeToParent = () => {
    //console.log(props);
    const reqCode = props.params.data.code; // 요청 코드 가져오기
    props.params.context.componentParent.getReqCode(reqCode); // 부모로 전달
  };
  </script>