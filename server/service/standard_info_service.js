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

// 공정 흐름도 상세 조회 상단
const procsFlowchartDetailTop = async (prd_code) => {
  let list = await mariaDB.query('procsFlowchartDetailTop', prd_code);
  let result = list[0];
  return result;
}

// 공정 흐름도에 사용하는 BOM 코드 조회
const procsFlowchartSearchBom = async (prd_code) => {
  let list = await mariaDB.query('procsFlowchartSearchBom', prd_code);
  let result = list[0];
  return result;
}

// 공정 흐름도에 사용하는 자재명 조회
const procsFlowchartSearchmtnm = async (mtril_name) => {
  let list = await mariaDB.query('procsFlowchartSearchmtnm', mtril_name);
  let result = list[0];
  return result;
}

// 공정 흐름도 생성
const procsFlowchartInsert = async (Insert)=>{
  await mariaDB.query('procsFlowchartInsert', Insert);
}
// 공정별 재료 소모 생성
const procsMatrlInsert = async (Insert)=>{
  await mariaDB.query('procsMatrlInsert', Insert);
}

// 공정별 작업기기 생성
const procsMchnInsert = async (Insert)=>{
  await mariaDB.query('procsMchnInsert', Insert);
}

// 품목 코드로 공정 코드 조회
const prdCodeToProcsCode = async (prd_code)=>{
  let list = await mariaDB.query('prdCodeToProcsCode', prd_code);
  return list;
}

// 공정 코드로 공정 흐름도 삭제 (테이블 3개)
const ProcsCodeToDeleteMchn = async (procs_code)=>{
  await mariaDB.query('ProcsCodeToDeleteMchn', procs_code);
}

const ProcsCodeToDeleteMatrl = async (procs_code)=>{
  await mariaDB.query('ProcsCodeToDeleteMatrl', procs_code);
}

const ProcsCodeToDeleteFlowchart = async (procs_code)=>{
  await mariaDB.query('ProcsCodeToDeleteFlowchart', procs_code);
}

module.exports = {
  cmmntest,
  bomtest,
  bomInfo,
  bominsert, 
  procsFlowchartList, 
  procsFlowchartDetail, 
  procsFlowchartDetailTop, 
  procsFlowchartSearchBom, 
  procsFlowchartSearchmtnm, 
  procsFlowchartInsert, 
  procsMatrlInsert, 
  procsMchnInsert, 
  prdCodeToProcsCode, 
  ProcsCodeToDeleteMchn, 
  ProcsCodeToDeleteMatrl, 
  ProcsCodeToDeleteFlowchart
};