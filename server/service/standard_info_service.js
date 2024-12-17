//기준정보 router
const mariaDB = require('../database/mapper.js');

// 기준정보 데이터 select 테스트
const cmmntest = async ()=>{
  let list = await mariaDB.query('cmmn');
  return list;
}

// BOM 조회
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
  console.log('service',bomInfo);
  let result = await mariaDB.query('bominsert',bomInfo); 
  if (result.affectedRows > 0) {
    return { message: '데이터 삽입 성공' };
  } else {
    return { message: '데이터 삽입 실패' };  
  } 
} 
 
  
module.exports = {
  cmmntest,
  bomtest,
  bomInfo,
  bominsert
};