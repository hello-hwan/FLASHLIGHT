//기준정보 router
const mariaDB = require('../database/mapper.js');

// 기준정보 데이터 select 테스트
const cmmntest = async ()=>{
  let list = await mariaDB.query('cmmn');
  return list;
}

// BOM 데이터 select 테스트
const bomtest = async() => {
  let list = await mariaDB.query('bom');
  return list;
}
 
// BOM 상세보기 
const bomInfo = async(bomCode) => {
  let list = await mariaDB.query('bomInfo',bomCode);
  return list;
}

// BOM 등록 
const bominsert = async (bomInfo) => {
  let result = await mariaDB.query('bominsert',bomInfo);
  if(result.insertId > 0){
    return { bom_no : result.insertId }
  }else{
    return {};
  }
}
 
 
module.exports = {
  cmmntest,
  bomtest,
  bomInfo,
  // bominsert
};