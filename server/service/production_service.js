//생산 service
const mariaDB = require('../database/mapper.js');

const findcmmn = async (code) => {
  let list = await mariaDB.query('pr_selcmmn', code);
  return list;
};

const drctlist = async () => {
  let list = await mariaDB.query('pr_seldrct');
  return list;
};


// ----------------------  프로시저 만들기 전의 코드(서비스에서 제어하려고 한 코드)

// 주문 목록 가져와서 총 소요시간 구하기
const total = async () => {
  let result = [];  // 모든 정보 담을 결과 선언
  
  let list = await mariaDB.query('pr_selorder'); // 주문 목록 가져오기
  for(let i = 0; i < list.length; i++){
    let info = {};  // 품목 하나당 정보 담을 객체 (total_time, mtril_list)
    info.prd_code = list[i].prd_code;
    info.prd_name = list[i].prd_name;
    info.order_qy = list[i].order_qy;
    info.order_no = list[i].order_no;
    info.order_date = list[i].order_date;
    info.dete = list[i].dete;

    let totime = await mariaDB.query('pr_selsumtime', list[i].prd_code); //주문목록으로 총소요시간 구하기
    for(let j = 0; j < totime.length; j++){
      info.total_time = totime[j].total_time; //객체에 total_time 담기
      info.priort = (list[i].dete - new Date() - (totime[j].total_time*1000*60))/1000/60/60;  // 우선순위(남은 시간으로 표기) = 납품일자 - (현재날짜 + 총소요시간)
    }

    let flowchart = await mariaDB.query('pr_selflowchart', list[i].prd_code);
    let flow = {};  // 객체 하나에 공정흐름도 정보 담기
    for(let l = 0; l < flowchart.length; l++){

    }

    let toqy = await mariaDB.query('pr_selsumqy', list[i].prd_code); // 주문목록으로 총소모자재 구하기
    let mlist = {}; // 객체 하나에 자재 정보 담기
    for(let k = 0; k < toqy.length; k++){
      mlist[toqy[k].mtril_code] = toqy[k].total_qy; //"자재명" : 수량
      info.mtril_list = mlist;
    }
  
    


    result.push(info); // 품목하나의 모든 정보 배열에 푸쉬
  }



  
  return result;
  
//  return list;
}


module.exports = { 
  findcmmn,
  drctlist,











  
  total
};