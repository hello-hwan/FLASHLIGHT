//기준정보 router
const mariaDB = require('../database/mapper.js');

// 반제품 조회 (bom모달)
const prductNModel = async () => {
  let list = await mariaDB.query('prductNModel');
  return list;
}

// 기준정보 데이터 select 테스트
const cmmntest = async () => {
  let list = await mariaDB.query('cmmn');
  return list;
}

// BOM 조회
const bomtest = async () => {
  let list = await mariaDB.query('bom');
  return list;
}

// BOM 상세보기 
const bomInfo = async (bomCode) => {
  let list = await mariaDB.query('bomInfo', bomCode);
  return list;
}

// BOM 자재 리스트
const bomMtilList = async () => {
  let list = await mariaDB.query('bomMtilList');
  return list;
}

// BOM 소모품등록  
const bomInsert = async (bomInfo) => {
  let result = await mariaDB.query('bomInsert', bomInfo);
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

// BOM 등록
const bomAdd = async (info) => {
  try {
    let result = await mariaDB.query('bomAdd', info);
    return result
  } catch (error) {
    console.log(error);    
  }
}

// BOM 관리 select
const bomManage = async (bomCode) => {
  let list = await mariaDB.query('bomManage', bomCode);
  return list;
}

// BOM 업데이트
const bomUpdate = async (code,info) => {
  let data = [code,info];
  try{
    let result = await mariaDB.query('bomUpdate', data);
  return result;
  }catch(err){
    console.log(err);
  }

}

// BOM소모품 업데이트
const bom_cmpdsUpdate = async (cmpdsNo, updateInfo) => {
    let datas = [updateInfo, cmpdsNo];
    let result = await mariaDB.query('bom_cmpdsUpdate', datas)
                          .catch(err => console.log(err));
    return result; 
}

// BOM소모품 삭제
const bom_cmpdsDel = async (cmpdsNo) => {
  let result = await mariaDB.query('bom_cmpdsDel', cmpdsNo);
  return result;
}

// BOM 삭제
const bomDelete = async(code) => {
  let result = await mariaDB.query('bomDelete', code);
  return result;
}

// 반제품 조회(모달)
const prduct_n = async () => {
  let list = await mariaDB.query('prduct_n');
  return list;
}

// 완제품 조회(모달)
const prduct = async () => {
  let list = await mariaDB.query('prduct');
  return list;
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
  try{
    let result = await mariaDB.query('prductNAdd', info);
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
const prductNUpdate = async (code, info) => {
  let data = [info, code];
  let result = await mariaDB.query('prductNUpdate', data);
  return result;
}

// 완제품 조회
const prductList = async () => {
  let list = await mariaDB.query('infoprductList'); 
  return list;
}

// 완제품 등록
const prductInsert = async (info) => {
  try{
    let result = await mariaDB.query('prductInsert', info);
  return result;
  }catch(err){
    console.log(err);
  }
  
}

// 완제품 삭제
const prductDelete = async (code) => {
  let result = await mariaDB.query('prductDelete', code);
  return result;
}

// 완제품 수정 
const prductUpdate = async (code, info) => {
  let data = [info, code];
  let result = await mariaDB.query('prductUpdate', data);
  return result;
}

// 거래처 조회
const bcncList = async () => {
  let list = await mariaDB.query('bcncList');
  return list;
}

// 거래처 등록
const bcncAdd = async (info) => {
  try{
    let result = await mariaDB.query('bcncAdd', info);
    return result;
  }catch(err){
    console.log(err);
  }
}

// 거래처 삭제
const bcncDelete = async(code) =>{
  let result = await mariaDB.query('bcncDelete', code);
  return result;
}


// 거래처 수정 
const bcncUpdate = async (code, info) => {
  let data = [info, code];
  let result = await mariaDB.query('bcncUpdate', data);
  return result;
}

//품질검사항목관리
const qiList = async (prd_code) => {
  let list = await mariaDB.query('qiList', prd_code);
  return list;
}
 

//품질검사항목관리 모달창
const qiListModal = async (prd_code) => {
  let list = await mariaDB.query('qiListModal',prd_code) 
                          .catch(err=>console.log(err));                     
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
  if (result == undefined) {
    let list = await mariaDB.query('procsFlowchartSearchpron', mtril_name);
    result = list[0];
    console.log(mtril_name)
    console.log(list);
  }
  return result;
}

// 공정 흐름도 생성
const procsFlowchartInsert = async (Insert) => {
  await mariaDB.query('procsFlowchartInsert', Insert);
}
// 공정별 재료 소모 생성
const procsMatrlInsert = async (Insert) => {
  await mariaDB.query('procsMatrlInsert', Insert);
}

// 공정별 작업기기 생성
const procsMchnInsert = async (Insert) => {
  await mariaDB.query('procsMchnInsert', Insert);
}

// 품목 코드로 공정 코드 조회
const prdCodeToProcsCode = async (prd_code)=>{
  let list = await mariaDB.query('prdCodeToProcsCode', prd_code);
  return list;
}

// 공정 코드로 공정 흐름도 삭제 (테이블 3개)
const ProcsCodeToDeleteMchn = async (procs_code) => {
  await mariaDB.query('ProcsCodeToDeleteMchn', procs_code);
}

const ProcsCodeToDeleteMatrl = async (procs_code) => {
  await mariaDB.query('ProcsCodeToDeleteMatrl', procs_code);
}

const ProcsCodeToDeleteFlowchart = async (procs_code) => {
  await mariaDB.query('ProcsCodeToDeleteFlowchart', procs_code);
}

// 품목코드 검색용 조회
const prd_code_search = async (prd_code) => {
  let list = await mariaDB.query('prd_code_search', prd_code);
  return list;
}

// BOM에 등록되어있는 품목코드, 품목이름 검색
const prd_code_bom_search = async (prd_code) => {
  let list = await mariaDB.query('prd_code_bom_search', prd_code);
  return list;
}

const prd_code_bom_all_search = async () => {
  let list = await mariaDB.query('prd_code_bom_all_search');
  return list;
}

// 제품 코드로 BOM 조회해서 사용 재료 조회
const prd_code_bom_cmpds_list = async (prd_code) => {
  let list = await mariaDB.query('prd_code_bom_cmpds_list', prd_code);
  return list;
}

// 전체 사원 조회
const select_all_empl = async () => {
  let list = await mariaDB.query('select_all_empl');
  return list;
}

// 사원 검색
const search_empl = async (search) => {
  let list = await mariaDB.query('search_empl', search);
  return list;
}

// 사원 등록
const insert_empl = async (insert) => {
  let list = await mariaDB.query('insert_empl', insert);
  return list;
}

// 비밀번호 확인
const search_pw = async (search) => {
  let list = await mariaDB.query('search_pw', search);
  return list[0];
}

// 사원 변경
const update_empl = async (list) => {
    await mariaDB.query('update_empl', list);
}

// 사원 퇴사
const delete_empl = async (list) => {
  await mariaDB.query('delete_empl', list);
}

//로그인 서비스
const loginService = async (info) => {
  let infoArr = [info.empl_no,
                 info.password]; 
                 console.log(infoArr);
  let result = await mariaDB.query('loginSelect', infoArr)
                            .catch(err=>console.log(err));
  console.log(result);
  return result;
};

module.exports = {
  prductNModel,
  cmmntest, 
  bomtest,
  bomInfo,
  bomInsert,
  bom_cmpdsUpdate,
  bom_cmpdsDel,
  bomMtilList,
  bomAdd,
  bomDelete,
  prduct_n,
  prduct,
  mtril,
  mtrilAdd,
  mtrilDelete,
  mtrilUpdate,
  prductNList,
  prductNAdd,
  prductNDelete,
  prductNUpdate,
  prductList,
  prductInsert,
  prductDelete,
  prductUpdate, 
  bcncList,
  bcncUpdate,
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
  prd_code_search, 
  prd_code_bom_search, 
  bcncAdd,
  bcncDelete,
  bomUpdate,
  prd_code_bom_all_search, 
  prd_code_bom_cmpds_list,
  select_all_empl, 
  search_empl, 
  insert_empl, 
  search_pw, 
  update_empl, 
  delete_empl,
  loginService
};