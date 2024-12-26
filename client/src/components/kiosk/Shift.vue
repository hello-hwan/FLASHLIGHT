<template>
  <span style="margin-left:20px">
      <input type="text" id="empl_no" v-model="inputValue" class="display-6 text-lg-right" style="background-color: white; margin-left: 5%;" @click="modalOpen">
      <!-- 모달창 열기 -->
      <div class="modal-wrap" @click="modalOpen" v-show="modalCheck">
        <div class="modal-container" @click.stop="">
          <div id="search-bar">
            <!-- 입력값 확인 -->
            <div class="check-num">
              <input type="text" id="check_no" v-model="check" class="display-3 text-lg-right" style="background-color: white; width: 80%;">
            </div>
            <!-- 공백 -->
            <div style="margin-bottom: 10px;
                text-align: right;
                height: 50px;">
            </div>
            <!-- 숫자 입력 -->
            <div class="click-num">
              <table class="table-kiosk">
                <tr>
                  <th @click="typing">1</th>
                  <th @click="typing">2</th>
                  <th @click="typing">3</th>
                </tr>
                <tr>
                  <th @click="typing">4</th>
                  <th @click="typing">5</th>
                  <th @click="typing">6</th>
                </tr>
                <tr>
                  <th @click="typing">7</th>
                  <th @click="typing">8</th>
                  <th @click="typing">9</th>
                </tr>
                <tr>
                  <th @click="typing">-</th>
                  <th @click="typing">0</th>
                  <th @click="typing">←</th>
                </tr>
              </table>
            </div>
            
            <div class="modal-btn">
              <button @click="modalOpen"class="btn btn-secondary">닫기</button>
              <button @click="numOk" class="btn btn-primary">확인</button>
            </div>
          </div>
        </div>
      </div>
  </span>
</template>

<script setup>
import { ref } from 'vue';

// input값 넣을 변수
let inputValue = ref('');
let check = ref('');

// 버튼클릭시 함수
const typing = (event) => {
  let newText = check.value;
  if(event.target.innerHTML == '←'){
    newText = newText.slice(0, newText.length-1);
  } else {
    newText += event.target.innerHTML;
  }
  check.value = newText;
};

// 확인시 실행 함수
const numOk = () => {
  inputValue.value = check.value;
  modalOpen();
}

//모달 열림 상태 담을 변수
let modalCheck = ref(false);

//모달이 열리면 true로 변경, 스크롤 막기
const modalOpen = () => {
  const html = document.querySelector('html');
  if(modalCheck.value == false) {
      modalCheck.value = !modalCheck.value;
      html.style.overflow = 'hidden';
  } else {
      modalCheck.value = !modalCheck.value;
      html.style.overflow = 'auto';
  }
};
</script>

<style scoped>
/* dimmed */
.modal-wrap {
position: fixed;
left: 0;
top: 0;
width: 100%;
height: 100%;
background: rgba(0, 0, 0, 0.4);
z-index: 3;
}
/* modal or popup */
.modal-container {
  position: relative;
  top: 53%;
  left: 61%;
  transform: translate(-50%, -50%);
  width: 80%;
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;
}

.modal-btn button {
  line-height: 1.1;
  margin: 10px 0;
}
.align-left{
  margin: 10px 0;
}
.align-left>span {
  margin-left: 20px;
}
.search-btn {
  margin: 10px;
  line-height: 1.1;
}
#search-bar {
  padding: 27px;
  padding-bottom: 0px;
  background-color: #e3e3e3;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
}

.table-kiosk {
  width: 100%;
}

.table-kiosk th{
  border: 20px, solid, #aaa;
  width: 30%;
  height: 150px;
  font-size: 50px;
}
</style>