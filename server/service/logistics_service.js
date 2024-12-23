//물류 service
const mariaDB = require('../database/mapper.js');

// 반제품 입고 리스트 
const prdctn_n_list = async() => {
  let list = await mariaDB.query('prdctn_n_list');
  return list;
}

// 반제품 등록
const prduct_n_wrhousng = async(data) => {
  let result = await mariaDB.query('prduct_n_wrhousng', data);
  if (result.insertId != null){
    return { message: '등록성공' };
  }else {
    return { message: '등록실패' };
  }
}

// 반제품 입고 완료 리스트
const prdctNList = async() => {
  let list = await mariaDB.query('prduct_n_wrhousngList');
  return list;
}

// 반제품 출고 리스트
const prduct_n_dlivy = async() => {
  let list = await mariaDB.query('prduct_n_dlivy');
  return list;
}

// 반제품 출고가능 제품
const prduct_n_possible = async(prdCode) => {
  let list = await mariaDB.query('prduct_n_possible', prdCode);
  return list;
}

// 반제품 출고완료처리
const prduct_n_dlivyTest = async() => {
  let result = await mariaDB.query('prduct_n_dlivyTest');
  return result;
}



module.exports = {
  prdctn_n_list,
  prduct_n_wrhousng,
  prdctNList,
  prduct_n_dlivy,
  prduct_n_possible,
  prduct_n_dlivyTest
};