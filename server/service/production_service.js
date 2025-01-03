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

// 생산 지시 조회 - 키오스크 버전 당일만 조회
const finddrct = async () => {
  let list = await mariaDB.query('pr_srcdrct');
  return list;
};



// 생산 지시 리스트 조회 - 스케줄러 버전
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
  
  if(list.length == 0 ){
    return result;
  }
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
      if(colspan < 168 && colspan > 0){
        result.push({"prdctn_code" : "", "procs_nm" : "", "model_nm" : list[i].model_nm, "prd_nm" : "", "prdctn_co" : 0, "pre_begin_time" : "", "pre_end_time" : "", "drct_time" : 168-colspan, "order_no" : "" });
      }

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
  let list = await mariaDB.query('pr_srcprd', [name, name]);
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
};

// 자체 생산 추가
const drctinsert = async (code, qy, dedt) => {

};

// 생산지시 정보 단건 조회
const drctinfo = async (code) => {
  let list = await mariaDB.query('pr_onedrct', code);
  let result = list[0];
  return result;
};

// 해당 공정의 자재 소모량 조회
const selmatrl = async (code) => {
  let list = await mariaDB.query('pr_selmatrl', code);
  for(let i = 0; i < list.length; i++){
    list[i].usage = "";
  }
  return list;
};

// 생산실적 삽입
const addstate = async (array) => {
  let result = {};
  // 사원 검색
  let empl = await mariaDB.query('pr_selempl', array[6]);

  //  사원이 없을 경우 2 빠져나감
  if(empl.length == 0){
    result.retCode = 2;
    return result;
  }
  
  // 사원 있을경우 새 배열에 값 넣기
  let name = empl[0].empl_name;
  let newArray = [...array, name];

  console.log(newArray);

  // 생산 실적에 시작하는 값 넣기
  let list = await mariaDB.query('pr_insstate', newArray);
  // 성공시 1
  if(list.affectedRows == 1){
    result.retCode = 1;
  }else {
    // 실패시 0
    result.retCode = 0;
  }
  return result;
};

// 생산 실적 단건 조회
const stateinfo = async (code) => {
  let list = await mariaDB.query('pr_onestate', code);
  let result = list[0];
  return result;
};

// 불량품 삽입
const addbad = async (array) => {
  let result = {};
  // 불량 코드 만들기
  let co = await mariaDB.query('pr_cobad', [array[2], array[2]]);
  // 불량 정보 삽입
  let list = await mariaDB.query('pr_insbad', [co[0].badn_code, ...array]);
  // 성공시 1
  if(list.affectedRows == 1){
    result.retCode = 1;
  }else {
    // 실패시 0
    result.retCode = 0;
  }
  return result;
};

// 완료 보고 정상실행 - 재료 없을 때
const finnomt = async (array) => {
  let result = {};
  // 불량품 수량
  let badn = await mariaDB.query('pr_badco', array[2]);
  // 생산실적 수정
  let list = await mariaDB.query('pr_upstate', [ array[0], array[1], badn[0].badn_qy, array[2] ]);
  // 성공시 1
  if(list.affectedRows == 1){
    result.retCode = 1;
  }else {
    // 실패시 0
    result.retCode = 0;
  }
  return result;
};

// 완료보고 정상실행 - 재료 있을 때
const finyesmt = async (code, matril) => {
  let result = {};
  let real_co = 0;
  let ins_co = 0;
  let up_co = 0;
  await mariaDB.conn.beginTransaction();
  for(let i = 0; i < matril.length; i++){
    let se_list = await mariaDB.transaction_query('pr_se', [code, matril[i].mtril_code]);
    let se = se_list[0].prd_se;
    let qy = parseInt(matril[i].usgqty);
    
    if(se == 'PI01'){
      //자재일때
      // 자재 출고 조회
      let mt_list = await mariaDB.transaction_query('pr_mt', [code, matril.mtril_code]);
      for(let j = 0; j < mt_list.length; j++){
        
        if(qy == 0){
          break;
        } // end of if(qy)
        real_co++;
        if(qy >= mt_list[j].requst_qy){
          // 남은 실사용량 >= 로트 요청 수량 => 삽입 : 수량 = 로트 요청 수량, 수정 : 사용수량 = 로트 요청 수량, 미사용수량 = 로트 요청 수량 - 사용 수량
          // 삽입
          let mt_ins = await mariaDB.transaction_query('pr_insuse', [ mt_list[j].mtril_lot, matril[i].mtril_code, mt_list[j].mtril_name, se, mt_list[j].requst_qy, code, mt_list[j].dlivy_no ]);
          ins_co += mt_ins.affectedRows;
          // 수정
          let mt_up = await mariaDB.transaction_query('pr_upmt', [ mt_list[j].requst_qy, 0 ]);
          up_co += mt_up.affectedRows;
          qy -= mt_list[j].requst_qy;
        } else {
          // 남은 실사용량 < 로트 요청 수량 => 삽입 : 수량 = 남은 실사용량, 수정 : 사용수량 = 남은 실사용량, 미사용수량 = 로트 요청 수량 - 남은실사용량
          // 삽입
          let mt_ins = await mariaDB.transaction_query('pr_insuse', [ mt_list[j].mtril_lot, matril[i].mtril_code, mt_list[j].mtril_name, se, qy, code, mt_list[i].dlivy_no ]);
          ins_co += mt_ins.affectedRows;
          // 수정
          let mt_up = await mariaDB.transaction_query('pr_upmt', [ qy, mt_list[j].requst_qy - qy ]);
          up_co += mt_up.affectedRows;
          qy = 0;
        } // end of if(mt_list[j].requst_qy)

      } // end of for(j)

    } else if(se == 'PI02'){
      //반제품일때
      // 반제품 출고 조회
      let prdn_list = await mariaDB.transaction_query('pr_prdn', [code, matril.mtril_code]);
      for(let k = 0; k < prdn_list.length; k++){
        
        if(qy == 0){
          break;
        } // end of if(qy)
        real_co++;
        if(qy >= prdn_list[k].requst_qy){
          // 남은 실사용량 >= 로트 요청 수량 => 삽입 : 수량 = 로트 요청 수량, 수정 : 사용수량 = 로트 요청 수량, 미사용수량 = 로트 요청 수량 - 사용 수량
          // 삽입
          let prdn_ins = await mariaDB.transaction_query('pr_insuse', [ prdn_list[k].prduct_n_lot, matril[i].mtril_code, prdn_list[k].prduct_n_name, se, prdn_list[k].requst_qy, code, prdn_list[k].prduct_n_dlivy_no ]);
          ins_co += prdn_ins.affectedRows;
          // 수정
          let prdn_up = await mariaDB.transaction_query('pr_upprdn', [prdn_list[k].requst_qy, 0 ]);
          up_co += prdn_up.affectedRows;
          qy -= mt_list[j].requst_qy;
          
        } else {
          // 남은 실사용량 < 로트 요청 수량 => 삽입 : 수량 = 남은 실사용량, 수정 : 사용수량 = 남은 실사용량, 미사용수량 = 로트 요청 수량 - 남은실사용량
          // 삽입
          let prdn_ins = await mariaDB.transaction_query('pr_insuse', [ prdn_list[k].prduct_n_lot, matril[i].mtril_code, prdn_list[k].prduct_n_name, se, qy, code, prdn_list[k].prduct_n_dlivy_no ]);
          ins_co += prdn_ins.affectedRows;
          // 수정
          let prdn_up = await mariaDB.transaction_query('pr_upprdn', [ qy, prdn_list[k].requst_qy - qy ]);
          up_co += prdn_up.affectedRows;
          qy = 0;
        } // end of if(prdn_list[k].requst_qy)

      } // end of for(k)

    } // end of if(se)
  
  
  } // end of for(i)

  if(real_co == ins_co && real_co == up_co){
    await mariaDB.conn.commit();
    result.retCode = 1;
  } else {
    await mariaDB.conn.rollback();
    result.retCode = 0;
  }
  return result;
};

// 생산 실적 조회
const statelist = async (array) => {
  let list = await mariaDB.query('pr_statelist', array);
  return list;
};

// 공정이동표 조회
const shiftlist = async (array) => {
  let list = await mariaDB.query('pr_movetable', array);
  return list;
};

// 공정현황 조회
const drcttable = async (array) => {
  let list = await mariaDB.query('pr_selstate', array);
  return list;
};

const procslist = async (name) => {
  let list = await mariaDB.query('pr_selprocs', [name, name, name]);
  return list;
}





module.exports = { 
  findcmmn,
  drctlist,
  eqplist,
  prdlist,
  reqlist,
  requpdate,
  drctinsert,
  finddrct,
  drctinfo,
  selmatrl,
  addstate,
  stateinfo,
  addbad,
  finnomt,
  finyesmt,
  statelist,
  shiftlist,
  drcttable,
  procslist
};