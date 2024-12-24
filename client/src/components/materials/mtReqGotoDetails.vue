<template>
    <button 
      type="button"
      class="btn btn-primary"
      style="color: #fff; height: 30px; line-height: 0.3; text-align: left;"
      @click="sendCodeToParent"
    >
      <p style="line-height: inherit;">선택</p>
    </button>
  </template>
  
  <script setup>
  import { defineProps } from "vue";
  
  const props = defineProps(["params"]);
  
  const sendCodeToParent = () => {
    //console.log(props);
    const reqCode = props.params.data.code; // 요청 코드 가져오기
    console.log('버튼 컴포넌트', reqCode);
    props.params.context.componentParent.getReqCode(reqCode); // 부모로 전달
  };
  </script>

<style scoped>
  p {

    width: 33px;
  }
</style>