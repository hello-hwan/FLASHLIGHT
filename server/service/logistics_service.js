//물류 service
const mariaDB = require('../database/mapper.js');

// 반제품 입고 리스트 
const prdctn_n_list = async() => {
  let list = await mariaDB.query('prdctn_n_list');
  return list;
}

module.exports = {
  prdctn_n_list
};