//생산 service
const mariaDB = require('../database/mapper.js');

// 공통코드 검색
const findcmmn = async (code) => {
  let list = await mariaDB.query('pr_selcmmn', code);
  return list;
};

// 설비 리스트 조회
const eqplist = async () => {
  let list = await mariaDB.query('pr_eqp');
  return list;
};

// 생산 지시 리스트 조회
const drctlist = async (prd_code, day_str) => {
  // prd_code가 없을 때
  if(!prd_code){
    prd_code = '';
  }
  // day_str이 없을 때 - 현재날짜 기준
  if(!day_str){
    day_str = new Date().getFullYear + '-' + (new Date().getMonth + 1) + '-' + new Date().getDate();
  }
  let innerArray = [prd_code, day_str, day_str, day_str, day_str];

  let list = await mariaDB.query('pr_seldrct', innerArray);
  
  let result = [];
  let model = '';

  // 공정의 시작시간
  let begin_time = new Date(list[0].pre_begin_time);
  begin_time.setHours(0, 0, 0, 0);
  let begin = begin_time.getTime();

  // 공정의 종료시간
  let end_time = new Date (list[0].pre_begin_time);
  end_time.setHours(0, 0, 0, 0);
  let end = end_time.getTime();

  // 제일처음의 공정시간
  let start_time = new Date(day_str);
  start_time.setHours(0, 0, 0, 0);
  let start = start_time.getTime();
  let colspan = 0;

  for(let i = 0; i < list.length; i++){
    if(model != list[i].model_nm){
      colspan = 0;

      begin_time = list[i].pre_begin_time;
      begin = new Date(begin_time).getTime();

      end_time = list[i].pre_end_time;
      end = new Date(end_time).getTime();
      if(begin - start > 0){
        result.push({"prdctn_code" : "", "procs_nm" : "", "model_nm" : list[i].model_nm, "prd_nm" : "", "prdctn_co" : 0, "pre_begin_time" : "", "pre_end_time" : "", "drct_time" : (begin-start)/1000/60/60, "order_no" : "" });
        colspan += (begin-start)/1000/60/60;
      }
        
    } 
    begin_time = list[i].pre_begin_time;
    begin = new Date(begin_time).getTime();
    if(begin - end > 0){
      result.push({"prdctn_code" : "", "procs_nm" : "", "model_nm" : list[i].model_nm, "prd_nm" : "", "prdctn_co" : 0, "pre_begin_time" : "", "pre_end_time" : "", "drct_time" : (begin-end)/1000/60/60, "order_no" : "" });
      colspan += (begin-start)/1000/60/60;
    }
    if(colspan >= 168){
      model = list[i].model_nm;
      continue;
    }
    if(colspan + list[i].drct_time >= 168){
      result.push({"prdctn_code" : list[i].prdctn_code, "procs_nm" : list[i].procs_nm, "model_nm" : list[i].model_nm, "prd_nm" : list[i].prd_nm, "prdctn_co" : list[i].prdctn_co, "pre_begin_time" : list[i].pre_begin_time, "pre_end_time" : list[i].pre_end_time, "drct_time" : (168 - colspan), "order_no" : list[i].order_no });
      colspan = 168;
    } else {
      result.push(list[i]);
      colspan += list[i].drct_time;
    }
    model = list[i].model_nm;
    end_time = list[i].pre_end_time;
    end = new Date(end_time).getTime();
  
  }
return result;
};

// 제품리스트 검색 기능
const prdlist = async (name) => {
  let list = await mariaDB.query('pr_srcprd', name);
  return list;
};

// 요청리스트조회
const reqlist = async () => {
  let list = await mariaDB.query('pr_nem');
  return list;
};

// 요청리스트 수정
const requpdate = async (code, qy) => {
  let array = [qy, code];
  let list = await mariaDB.query('pr_upreq', array);
  let result = [];
  // 성공시 1
  if(list.affectedRows == 1){
     result.push({retCode: 1});
  }else {
    // 실패시 0
    result.push({retCode: 0});
  }

  return result;
}














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
};


module.exports = { 
  findcmmn,
  drctlist,
  eqplist,
  prdlist,
  reqlist,
  requpdate,













  
  total,
};