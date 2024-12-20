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

module.exports = {
  prdctn_n_list,
  prduct_n_wrhousng
};