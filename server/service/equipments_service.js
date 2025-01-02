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
const chck_fc_insert = async (list) => {
    await mariaDB.query('chck_fc_insert', list);
}

// 점검 결과 등록
const chck_result_insert = async (list) => {
    for (let i = 0 ; i < list.length ; i++) {
        await mariaDB.query('chck_result_insert', list[i]);
    }
}

// 점검 결과 등록할 일정 코드 찾기
const find_last_fx_code = async () => {
    let list = await mariaDB.query('find_last_fx_code');
    return list[0];
}

// 미점검 업데이트
const not_check_update = async (list) => {
    await mariaDB.query('not_check_update', list);
}

// 점검 항목 조회
const chck_iem_list = async (eqp_code) => {
    let list = await mariaDB.query('chck_iem_list', eqp_code);
    return list;
}

// 미점검 기기 조회
const not_check_list = async () => {
    let list = await mariaDB.query('not_check_list');
    return list;
}

// 장비 전체 조회
const eqp_all_list = async () => {
    let list = await mariaDB.query('eqp_all_list');
    return list;
}

// 설비 등록
const eqp_insert = async (list) => {
    await mariaDB.query('eqp_insert', list);
}

// 등록 기기 삭제
const eqp_delete = async (eqp_code) => {
    await mariaDB.query('eqp_delete', eqp_code);
}

// 미가동 등록
const not_opr_insert = async (list) => {
    await mariaDB.query('not_opr_insert', list);
}

// 미가동 설비 조회
const not_opr_list = async () => {
    let list = await mariaDB.query('not_opr_list');
    return list;
}

// 미가동 설비 가동 변경
const not_opr_update = async (list) => {
    await mariaDB.query('not_opr_update', list);
}


module.exports = {
    eqp_list,
    eqp_list_prod,
    chck_fx_list,
    chck_fx_all_list,
    fx_code_list,
    chck_fc_insert,
    chck_result_insert,
    find_last_fx_code,
    not_check_update, 
    chck_iem_list, 
    not_check_list, 
    eqp_all_list, 
    eqp_insert, 
    eqp_delete, 
    not_opr_insert, 
    not_opr_list, 
    not_opr_update
};