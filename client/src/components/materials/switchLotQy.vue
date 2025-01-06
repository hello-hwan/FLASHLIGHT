<template>
    <span >
        <button @click="sendCodeToParent" class="btn  btn-primary"style="margin-left:20px; line-height: 1;" >상세수량</button>        
    </span>
</template>

<script setup>
import { defineProps } from "vue";

//부모 컴포넌트에서 보내준 데이터
const props = defineProps(["params"]);

const sendCodeToParent = () => {
  const mtInfo = props.params.data; // 부모에서 선택한 행데이터
  //console.log('버튼 컴포넌트', mtInfo);
  props.params.context.componentParent.getMtRowData(mtInfo);
};
</script>