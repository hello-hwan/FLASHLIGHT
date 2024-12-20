//설비 service
const mariaDB = require('../database/mapper.js');

//설비 상태 조회
const eqp_list = async () => {
    let list = await mariaDB.query('eqp_list');
    return list;
}

// 설비 상태 조회 2
const eqp_list_prod = async (eqp_code) => {
    let list = await mariaDB.query('eqp_list_prod', eqp_code);
    return list[0];
}

// 점검할 기기 조회
const chck_fx_list = async () => {
    let list = await mariaDB.query('chck_fx_list');
    return list;
}

// 전체 점검 기기 조회
const chck_fx_all_list = async () => {
    let list = await mariaDB.query('chck_fx_all_list');
    return list;
}

// 일정코드로 점검일정 조회
const fx_code_list = async (fx_code) => {
    let list = await mariaDB.query('fx_code_list', fx_code);
    return list[0];
}

// 점검 일정 등록
const chck_fc_insert = async (list)=>{
  await mariaDB.query('chck_fc_insert', list);
}

// 점검 결과 등록
const chck_result_insert = async (list)=>{
    await mariaDB.query('chck_result_insert', list);
  }

// 점검 결과 등록할 일정 코드 찾기
const find_last_fx_code = async () => {
    let list = await mariaDB.query('find_last_fx_code');
    return list[0];
}
module.exports = {
    eqp_list, 
    eqp_list_prod, 
    chck_fx_list, 
    chck_fx_all_list, 
    fx_code_list, 
    chck_fc_insert, 
    chck_result_insert, 
    find_last_fx_code
};