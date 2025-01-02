<template>
    <orderListModal v-bind:state="forPdf" @selectedData="getOrderDetails"/>
</template>

<script setup>
import { ref, watch } from 'vue';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {malgum} from '@/utils/malgum.js';
import orderListModal from '@/components/materials/orderControlModal.vue';
import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';

//자식 컴포넌트로 어디에서 어떤작업을 원하는지 특정하기 위해 임의의 문자열 전송
let forPdf = 'pdf';

//자식 컴포넌트로부터 받은 데이터 담을 변수
const orderCode = ref("");

//db에서 데이터 가져오기
let dataList = [];

//거래처 정보
let companyInfoFromDB = [];

//주문 정보
let orderInfoFromDB = [];

//주문 자재 정보
let mtrilListFromDB = [];

//자식 컴포넌트로부터 받은(선택한) 데이터 (발주건)
const getOrderDetails = (info) => {
  console.log(info);
  orderCode.value = info[0].order_code;
  console.log(orderCode.value);
};

watch(() => orderCode.value, async(newVal) => {
  //초기화
  companyInfoFromDB = [];
  orderInfoFromDB = [];
  mtrilListFromDB = [];

  console.log('작동', newVal);
  let result = await axios.get(`${ajaxUrl}/mtril/orderForm/${newVal}`)
  .catch(err=>console.log(err));

  console.log('확인 버튼 클릭 후 가져온 데이터', result);
  dataList = result.data;
  //거래처 정보 담기
  companyInfoFromDB = result.data[0];

  //주문정보
  let totalPrice = 0;
  for(let i=0; i<result.data[1].length; i++) {
    totalPrice += parseInt(result.data[1][i].order_price);
    console.log(totalPrice);
  };
  orderInfoFromDB = {order_date: result.data[1][0].order_date, 
                     dedt: result.data[1][0].dedt,
                     price: totalPrice.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","),
                     empl_name: result.data[1][0].empl_name};

  //자재 리스트
  for(let i=0; i<result.data[1].length; i++) {
    mtrilListFromDB.push({
      mtril_name: result.data[1][i].mtril_name,
      mtril_qy: result.data[1][i].order_qy.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","),
      unit: result.data[1][i].unit,
      price: (result.data[1][i].order_price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")+"원")
    });
  };

  //기본 10행을 출력하기 위해서 빈 문자열 넣어주기
  if(result.data[1].length < 10) {
    for(let i=0; i<(10-result.data[1].length); i++) {
      mtrilListFromDB.push({
        mtril_name: "",
        mtril_qy: "",
        unit: "",
        price: ""
      });
    };
  };
  
  generatePDF();
});

const generatePDF = () => {
  var _fonts = malgum;

  var doc = new jsPDF("p", "mm", "a4");

  doc.addFileToVFS('malgun.ttf', _fonts);  //_fonts 변수는 Base64 형태로 변환된 내용입니다.
  doc.addFont('malgun.ttf','malgun', 'normal');
  doc.setFont('malgun'); 
  
  //doc.line(15, 19, 195, 19); // 선그리기(시작x, 시작y, 종료x, 종료y)

  doc.setFontSize(30);  //다음 문자열 글씨 크기 설정
  doc.text(90, 30, '발주서'); // 글씨입력(시작x, 시작y, 내용)

  doc.setFontSize(13);
  doc.text(15, 140, '아래 내용으로 발주를 신청합니다');
  doc.line(85, 140, 135, 140);
  doc.setFontSize(15);
  doc.text(140, 140, '담당자 (인)');
  //거래처 정보
  companyInfo(doc);

  //거래 정보
  orderInfo(doc);

  //자재 목록
  mtrilList(doc);
  
  doc.save('발주서.pdf');  //결과 출력
};

/*거래처 정보 테이블 */
const companyInfo = (doc) => {

    const headCompanyInfo = [
    ['구분', '내용']
  ];
  const bodyCompanyInfo = [
      [
          {content: '상호', styles: {halign: 'center', lineColor: [0, 0, 0], lineWidth: 0.3}},
          {content: companyInfoFromDB.mtlty_name, styles: {halign: 'center', lineColor: [0, 0, 0], lineWidth: 0.3}}
      ],
      [
          {content: '사업자 번호', styles: {halign: 'center', lineColor: [0, 0, 0], lineWidth: 0.3}},
          {content: companyInfoFromDB.bizrno, styles: {halign: 'center', lineColor: [0, 0, 0], lineWidth: 0.3}}
      ],
      [
          {content: '대표자', styles: {halign: 'center', lineColor: [0, 0, 0], lineWidth: 0.3}},
          {content: companyInfoFromDB.charger_name, styles: {halign: 'center', lineColor: [0, 0, 0], lineWidth: 0.3}}
      ],
      [
          {content: '주소', styles: {halign: 'center', lineColor: [0, 0, 0], lineWidth: 0.3}},
          {content: companyInfoFromDB.dvyfg_adres, styles: {halign: 'center', lineColor: [0, 0, 0], lineWidth: 0.3}}
      ],
  ];
            
  doc.autoTable({
      theme: 'plain',
      margin: { left: 10 }, // margin 값을 명시적으로 설정
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.3,
      headStyles:  { halign: 'center', valign: 'middle', fillColor: [234, 234, 234], lineColor: [0, 0, 0], lineWidth: 0.3 },	  	//헤더 부분 옵션
      startX: 0, 													//시작점 X 좌표
      startY: 70,													//시작점 Y 좌표
      tableWidth : 90,											//테이블 너비
      styles : { font : 'malgun', fontStyle :'normal'},  	//폰트적용(나눔명조체를 사용하였는데 이는 기본 사용법 글 참조하여 설정필요)
      head: headCompanyInfo,
      body : bodyCompanyInfo
  });
};

/*주문 정보 테이블 */
const orderInfo = (doc) => {
  /*발주일, 납기일, 합계금액, 발주담당자 */
  const headOrderInfo = [
    ['구분', '내용']
  ];
  const bodyOrderInfo = [
      [
          {content: '발주일', styles: {halign: 'center', lineColor: [0, 0, 0], lineWidth: 0.3}},
          {content: orderInfoFromDB.order_date, styles: {halign: 'center', lineColor: [0, 0, 0], lineWidth: 0.3}}
      ],
      [
          {content: '납기일', styles: {halign: 'center', lineColor: [0, 0, 0], lineWidth: 0.3}},
          {content: orderInfoFromDB.dedt, styles: {halign: 'center', lineColor: [0, 0, 0], lineWidth: 0.3}}
      ],
      [
          {content: '합계 금액', styles: {halign: 'center', lineColor: [0, 0, 0], lineWidth: 0.3}},
          {content: (orderInfoFromDB.price + "원"), styles: {halign: 'center', lineColor: [0, 0, 0], lineWidth: 0.3}}
      ],
      [
          {content: '발주 담당자', styles: {halign: 'center', lineColor: [0, 0, 0], lineWidth: 0.3}},
          {content: orderInfoFromDB.empl_name, styles: {halign: 'center', lineColor: [0, 0, 0], lineWidth: 0.3}}
      ],
  ];
            
  doc.autoTable({
      theme: 'plain',
      margin: { left: 110 }, // 우측 테이블의 마진 설정
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.3,
      headStyles:  { halign: 'center', valign: 'middle', fillColor: [234, 234, 234], lineColor: [0, 0, 0], lineWidth: 0.3 },	  	//헤더 부분 옵션
      startX: 0, 													//시작점 X 좌표
      startY: 70,													//시작점 Y 좌표
      tableWidth : 90,											//테이블 너비
      styles : { font : 'malgun', fontStyle :'normal'},  	//폰트적용(나눔명조체를 사용하였는데 이는 기본 사용법 글 참조하여 설정필요)
      head: headOrderInfo,
      body : bodyOrderInfo
  });
};

/*자재 정보 테이블 */
const mtrilList = (doc) => {
  const headMtrilList = [
    ['품목명', '수량', '단위', '단가']
  ];
  
  //행 데이터를 담을 변수
  const bodyMtrilList = [];

  for(let i=0; i<mtrilListFromDB.length; i++) {
    bodyMtrilList.push([
          {content: mtrilListFromDB[i].mtril_name, styles: {halign: 'center', lineColor: [0, 0, 0], lineWidth: 0.3}},
          {content: mtrilListFromDB[i].mtril_qy, styles: {halign: 'center', lineColor: [0, 0, 0], lineWidth: 0.3}},
          {content: mtrilListFromDB[i].unit, styles: {halign: 'center', lineColor: [0, 0, 0], lineWidth: 0.3}},
          {content: mtrilListFromDB[i].price, styles: {halign: 'center', lineColor: [0, 0, 0], lineWidth: 0.3}}
    ]);
  };
            
  doc.autoTable({
      theme: 'plain',
      margin: { left: 10 }, // 우측 테이블의 마진 설정
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.3,
      headStyles:  { halign: 'center', valign: 'middle', fillColor: [234, 234, 234], lineColor: [0, 0, 0], lineWidth: 0.3 },	  	//헤더 부분 옵션
      startX: 0, 													//시작점 X 좌표
      startY: 150,													//시작점 Y 좌표
      tableWidth : 190,											//테이블 너비
      styles : { font : 'malgun', fontStyle :'normal'},  	//폰트적용(나눔명조체를 사용하였는데 이는 기본 사용법 글 참조하여 설정필요)
      head: headMtrilList,
      body : bodyMtrilList
  });
};
</script>