//기준정보 router

const express = require('express');
const router = express.Router();
const standard_info_service = require('../service/standard_info_service.js');

// 기준정보 데이터 select 테스트
router.get('/cmmn', async (req, res)=>{ 
  let searchs = req.query;
  let cmmnList = await standard_info_service.cmmntest(searchs);  
  res.send(cmmnList);
}); 

// BOM 조회
router.get('/bom', async (req, res) => { 
  let searchs = req.query;
  let bomlist = await standard_info_service.bomtest(searchs);
  res.send(bomlist);
}); 
  
// BOM 상세조회 
router.get('/bom/:bomCode', async (req, res) => {
  let bomCode = req.params.bomCode;
  let info = await standard_info_service.bomInfo(bomCode);  
  res.send(info);  
});

// BOM 자재 리스트
router.get('/bomMtilList', async (req, res) => {
  let searchs = req.query;
  let bomMtilList = await standard_info_service.bomMtilList(searchs);
  res.send(bomMtilList);
})

// BOM소모품 등록
router.post('/bom', async (req, res) => {
  let Insert = req.body;
  try{
    let result = await standard_info_service.bomInsert(Insert); 
  res.send(result);
  }catch(err){
    console.log(err); 
  }
});

// BOM 등록
router.post('/bomAdd', async (req, res) => {
  let info = req.body;
  try {
    let result = await standard_info_service.bomAdd(info);
    res.send(result);
  } catch (error) {
    console.log('router', error);
  }
})

// BOM 관리 select 
router.get('/bomManage/:bomCode', async (req, res) => {
  let bomCode = req.params.bomCode;
  let info = await standard_info_service.bomManage(bomCode);
  res.send(info);  
})
  
// BOM 업데이트
router.put('/bomUpdate/:code', async (req, res) => {
  let code = req.params.code;
  let info = req.body;
  let result = await standard_info_service.bomUpdate(info, code);
  res.send(result);
})

// BOM 소모품 update
router.put('/bom_cmpsdUpdate/:no', async (req, res) => {
  let cmpdsNo = req.params.no;  
  let info = req.body;  
  let result = await standard_info_service.bom_cmpdsUpdate(cmpdsNo, info);
  res.send(result);
});

// BOM 소모품 삭제
router.delete('/bom_cmpdsDel/:cmpdsNo', async (req, res) => {  
  let cmpdsNo = req.params.cmpdsNo; 
  let result = await standard_info_service.bom_cmpdsDel(cmpdsNo);
  res.send(result); 
});

// BOM 삭제
router.delete('/bomDelete/:code', async (req, res) => {
  let code = req.params.code;
  let result = await standard_info_service.bomDelete(code);
  res.send(result);
})

// 반제품 조회(모달)
router.get('/prduct_n', async (req, res) => {
  let searchs = req.query;
  let list = await standard_info_service.prduct_n(searchs);
  res.send(list);
})

// 완제품 조회(모달)
router.get('/prduct', async (req, res) => {
  let searchs = req.query;
  let list = await standard_info_service.prduct(searchs);
  res.send(list);
})

// 자재 조회
router.get('/mtril', async (req, res) => {
  let searchs = req.query;
  let list = await standard_info_service.mtril(searchs);
  res.send(list);
})

// 자재 등록
router.post('/mtrilAdd', async (req, res) => {
  let info = req.body;
  let result = await standard_info_service.mtrilAdd(info);
  res.send(result);
})

// 자재 삭제
router.delete('/mtrilDelete/:code', async (req, res) => {
  let code = req.params.code;
  let result = await standard_info_service.mtrilDelete(code);
  res.send(result);
})

// 자재 수정
router.put('/mtrilUpdate/:code', async (req, res) => {
  let code = req.params.code
  let info = req.body;
  let result = await standard_info_service.mtrilUpdate(info,code);
  res.send(result);
})

// 반제품 조회
router.get('/infoprductNList', async (req, res) => {
  let searchs = req.query;
  let list = await standard_info_service.prductNList(searchs);
  res.send(list);
})

// 반제품 등록
router.post('/prductNAdd', async (req, res) => {
  let info = req.body;
  let result = await standard_info_service.prductNAdd(info);
  res.send(result);
})

// 반제품 삭제
router.delete('/prductNDelete/:code', async (req, res) => {
  let code = req.params.code
  let result = await standard_info_service.prductNDelete(code);
  res.send(result);
})

// 반제품 수정
router.put('/prductNUpdate/:code', async (req, res) => {
  let code = req.params.code
  let info = req.body;
  console.log('router code =>', code);
  console.log('router info =>', info);
  let result = await standard_info_service.prductNUpdate(code,info);
  res.send(result);
})

// 완제품 조회
router.get('/infoprductList', async (req, res) => {
  let searchs = req.query;
  let list = await standard_info_service.prductList(searchs);
  res.send(list);
})

// 완제품 등록
router.post('/prductInsert', async (req, res) => {
  let info = req.body;
  let result = await standard_info_service.prductInsert(info);
  res.send(result);
})

// 완제품 삭제
router.delete('/prductDelete/:code', async (req, res) => {
  let code = req.params.code;
  let result = await standard_info_service.prductDelete(code);
  res.send(result);
})

// 완제품 수정
router.put('/prductUpdate/:code', async (req, res) => {
  let code = req.params.code
  let info = req.body;
  console.log('router code =>', code);
  console.log('router info =>', info);
  let result = await standard_info_service.prductUpdate(code,info);
  res.send(result);
})

// 거래처 조회
router.get('/bcncList', async (req, res) => {
  let searchs = req.query;
  let list = await standard_info_service.bcncList(searchs);
  res.send(list);
})

// 거래처 등록
router.post('/bcncAdd', async (req, res) => {
  let info = req.body;
  let result = await standard_info_service.bcncAdd(info);
  res.send(result);
})

// 거래처 삭제
router.delete('/bcnc_code/:code', async (req,res) => {
  let code = req.params.code
  let result = await standard_info_service.bcncDelete(code);
  res.send(result);
});


// 거래처 수정
router.put('/bcncUpdate/:code', async (req, res) => {
  let code = req.params.code
  let info = req.body;
  console.log('router code =>', code);
  console.log('router info =>', info);
  let result = await standard_info_service.prductUpdate(code,info);
  res.send(result);
})

// 품질검사항목관리
router.get('/standardInfo/qiList', async (req, res) => {
  let qiNo = req.query.qi_info; // key=value => req.query.key;
  console.log(req.query, qiNo);
  let result = await standard_info_service.qiList(qiNo);
  res.send(result);
});

// 공정 흐름도 조회
router.get('/procsFlowchartList', async (req, res) => {
    let list = await standard_info_service.procsFlowchartList();
    res.send(list);
});

// 공정 흐름도 상세 조회
router.get('/procsFlowchartDetail/:prd_code', async (req, res) => {
  let prd_code = req.params.prd_code;
  let list = await standard_info_service.procsFlowchartDetail(prd_code);
  res.send(list);
});

// 공정 흐름도 상세 조회 상단
router.get('/procsFlowchartDetailTop/:prd_code', async (req, res) => {
  let prd_code = req.params.prd_code;
  let list = await standard_info_service.procsFlowchartDetailTop(prd_code);
  res.send(list);
});

// 공정 흐름도에 사용하는 BOM 코드 조회
router.get('/procsFlowchartSearchBom/:prd_code', async (req, res) => {
  let prd_code = req.params.prd_code;
  let list = await standard_info_service.procsFlowchartSearchBom(prd_code);
  res.send(list);
});

// 공정 흐름도에 사용하는 자재명 조회
router.get('/procsFlowchartSearchmtnm/:mtril_name', async (req, res) => {
  let mtril_name = req.params.mtril_name;
  let list = await standard_info_service.procsFlowchartSearchmtnm(mtril_name);
  res.send(list);
});

// 공정 흐름도 생성
router.post('/procsFlowchartInsert', async(req, res)=>{
  let Insert = req.body;
  let result = await standard_info_service.procsFlowchartInsert(Insert);
  res.send(result);
});

// 공정별 재료 소모 생성
router.post('/procsMatrlInsert', async(req, res)=>{
  let Insert = req.body;
  let result = await standard_info_service.procsMatrlInsert(Insert);
  res.send(result);
});

// 공정별 작업기기 생성
router.post('/procsMchnInsert', async(req, res)=>{
  let Insert = req.body;
  let result = await standard_info_service.procsMchnInsert(Insert);
  res.send(result);
});

// 품목 코드로 공정 코드 조회
router.get('/prdCodeToProcsCode/:prd_code', async(req, res)=>{
  let prd_code = req.params.prd_code;
  let result = await standard_info_service.prdCodeToProcsCode(prd_code);
  res.send(result);
});

// 공정 코드로 공정 흐름도 삭제 (테이블 3개)
router.delete('/ProcsCodeToDeleteMchn/:procs_code', async(req, res)=>{
  let procs_code = req.params.procs_code;
  let result = await standard_info_service.ProcsCodeToDeleteMchn(procs_code);
  res.send(result);
});

router.delete('/ProcsCodeToDeleteMatrl/:procs_code', async(req, res)=>{
  let procs_code = req.params.procs_code;
  let result = await standard_info_service.ProcsCodeToDeleteMatrl(procs_code);
  res.send(result);
});

router.delete('/ProcsCodeToDeleteFlowchart/:procs_code', async(req, res)=>{
  let procs_code = req.params.procs_code;
  let result = await standard_info_service.ProcsCodeToDeleteFlowchart(procs_code);
  res.send(result);
});

// 품목코드 검색용 조회
router.get('/prd_code_search/:prd_code', async (req, res) => {
  let prd_code = req.params.prd_code;
  let list = await standard_info_service.prd_code_search(prd_code);
  res.send(list);
});

// BOM에 등록되어있는 품목코드, 품목이름 검색
router.get('/prd_code_bom_search/:prd_code', async (req, res) => {
  let prd_code = req.params.prd_code;
  let list = await standard_info_service.prd_code_bom_search(prd_code);
  res.send(list);
});

router.get('/prd_code_bom_all_search', async (req, res) => {
  let list = await standard_info_service.prd_code_bom_all_search();
  res.send(list);
});

// 전체 사원 조회
router.get('/select_all_empl', async (req, res) => {
  let list = await standard_info_service.select_all_empl();
  res.send(list);
});

// 사원 검색
router.get('/search_empl', async (req, res) => {
  if (req.query.empl_no_search == undefined) {
    empl_no_search = '';
  } else {
    empl_no_search = req.query.empl_no_search;
  }
  if (req.query.empl_name_search == undefined) {
    empl_name_search = '';
  } else {
    empl_name_search = req.query.empl_name_search
  }
  if (req.query.phone_search == undefined) {
    phone_search = '';
  } else {
    phone_search = req.query.phone_search;
  }
  if (req.query.author_selected == undefined) {
    author_selected = '';
  } else {
    author_selected = req.query.author_selected;
  }
  let search = [
    empl_no_search, 
    empl_name_search, 
    phone_search, 
    author_selected
  ];
  let list = await standard_info_service.search_empl(search);
  res.send(list);
});

// 사원 등록
router.post('/insert_empl', async(req, res)=>{
  let insert = req.body;
  let result = await standard_info_service.insert_empl(insert);
  console.log(result)
  res.send(result);
});

// 비밀번호 확인
router.get('/search_pw/:search', async (req, res) => {
  let search = req.params.search;
  let list = await standard_info_service.search_pw(search);
  res.send(list);
});

// 사원 변경
router.put('/update_empl', async (req, res) => {
    let list = req.body;
    let result = await standard_info_service.update_empl(list);
    res.send(result);
});

// 사원 퇴사
router.put('/delete_empl/:empl_no', async (req, res) => {
  let empl_no = req.params.empl_no;
  let result = await standard_info_service.delete_empl(empl_no);
  res.send(result);
});

//로그인 
router.post('/login', async(req, res) => {
  let loginInfo = req.body;
  let result = await standard_info_service.loginService(loginInfo);
  res.send(result);
});

module.exports = router;     