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
  if (result.affectedRows > 0) {
    return { message: '데이터 삽입 성공' };
  } else {
    return { message: '데이터 삽입 실패' }; 
  }
} 

//품질검사항목관리
const qiList = async (prd_code) => {
  let list = await mariaDB.query('qiListInfo',prd_code);
  let info = list[0];   
  return info;
}

// 공정 흐름도 조회
const procsFlowchartList = async () => {
    let list = await mariaDB.query('procsFlowchartList');
    return list;
}

// 공정 흐름도 상세 조회
const procsFlowchartDetail = async (prd_code) => {
  let list = await mariaDB.query('procsFlowchartDetail', prd_code);
  return list;
}

module.exports = {
  cmmntest,
  bomtest,
  bomInfo,
  bominsert,
  qiList,
  bominsert, 
  procsFlowchartList, 
  procsFlowchartDetail
};