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
  try {
    console.log('service', bomInfo);
    let result = await mariaDB.query('bominsert', bomInfo[0]); // 쿼리 실행

    // 쿼리 결과 확인
    if (result.insertId != null) {
      return { message: '데이터 삽입 성공' };
    } else {
      return { message: '데이터 삽입 실패' };
    }
  } catch (error) {
    // 예외 처리
    console.error("쿼리 실행 중 오류 발생:", error);
    return { message: '데이터 삽입 중 오류 발생' };
  }
};

// BOM 관리 select
const bomManage = async (bomCode) => {
  let list = await mariaDB.query('bomManage', bomCode);
  return list;
}


// BOM소모품 업데이트
const bom_cmpdsUpdate = async (bomCount) => {
  let datas = [bomCount];
  console.log(datas);
  let result = await mariaDB.query('bom_cmpdsUpdate', datas);
  let sendData = {};
  if(result.changedRows == 1){
    sendData.result = true; 
  }else{
    sendData.result = false;
  }
  return sendData;
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

module.exports = {
  cmmntest,
  bomtest,
  bomInfo,
  bomInsert,
  bomManage,
  bom_cmpdsUpdate,
  qiList,
  procsFlowchartList, 
  procsFlowchartDetail
};