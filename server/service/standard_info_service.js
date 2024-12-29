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
const bomInsert = async (bomInfo) => {
  let result = await mariaDB.query('bomInsert', bomInfo); 

  if (result.insertId != null) {
    return { message: '데이터 삽입 성공' };
  } else {
    return { message: '데이터 삽입 실패' };
  } 
}


// BOM 관리 select
const bomManage = async (bomCode) => {
  let list = await mariaDB.query('bomManage', bomCode);
  return list;
}


// BOM소모품 업데이트
const bom_cmpdsUpdate = async (cmpdsNo, updateInfo) => {
    let datas = [updateInfo, cmpdsNo];
    console.log(datas);
    let result = await mariaDB.query('bom_cmpdsUpdate', datas)
                          .catch(err => console.log(err));
    console.log(result);  
}


// BOM소모품 삭제
const bom_cmpdsDel = async (cmpdsNo) => {
    let result = await mariaDB.query('bom_cmpdsDel',cmpdsNo);
    return result;
}


// 자재 조회
const mtril = async () => {
  let list = await mariaDB.query('mtril');
  return list;
}

// 자재 등록
const mtrilAdd = async (info) => {
  let result = await mariaDB.query('mtrilAdd', info);
  
  try{
  if (result.insertId != null) {
    return { message: '데이터 삽입 성공' };
  } else {
    return { message: '데이터 삽입 실패' };
  }
  }catch(err){
    console.log(err);
  }
}

// 자재 삭제
const mtrilDelete = async (code) => {
  let result = await mariaDB.query('mtrilDelete', code);
  return result;
}

// 자재 수정
const mtrilUpdate = async (info,code) => {
  let data = [info,code];
  console.log(data);
  let result = await mariaDB.query('mtrilUpdate', data);
  return result;
}

// 반제품 조회
const prductNList = async() => {
  let list = await mariaDB.query('infoprductNList');
  return list;
}

// 반제품 등록
const prductNAdd = async (info) => {
  let result = await mariaDB.query('prductNAdd', info);

  try{
    if (result.insertId != null) {
      return { message: '데이터 삽입 성공' };
    } else {
      return { message: '데이터 삽입 실패' };
    }
    }catch(err){
      console.log(err);
    }
}

// 반제품 삭제
const prductNDelete = async (code) => {
  let result = await mariaDB.query('prductNDelete', code);
  return result;
}

// 반제품 수정

// 완제품 조회
const prductList = async () => {
  let list = await mariaDB.query('infoprductList');
  return list;
}

//품질검사항목관리
const qiList = async (prd_code) => {
  let list = await mariaDB.query('qiList',prd_code);  
  return list;
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

// 품목코드 검색용 조회
const prd_code_search = async (prd_code) => {
  let list = await mariaDB.query('prd_code_search', prd_code);
  return list;
}

module.exports = {
  cmmntest,
  bomtest,
  bomInfo,
  bomInsert,
  bom_cmpdsUpdate,
  bom_cmpdsDel,
  mtril,
  mtrilAdd,
  mtrilDelete,
  mtrilUpdate,
  prductNList,
  prductNAdd,
  prductNDelete,
  prductList,
  qiList,
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
  ProcsCodeToDeleteFlowchart,
  bomManage,
  prd_code_search
};