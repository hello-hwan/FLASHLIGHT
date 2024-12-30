//기준정보 sql

// BOM 조회
const bom =
`SELECT bom_code
       ,prdlst_code
       ,prdist_name
       ,prdctn_qy
       ,sumry 
FROM bom`;

// BOM 상세보기 쿼리
const bomInfo =
`SELECT bc.cmpds_no
	,bc.cmpds_prdlst_name
	,bc.stndrd_y
       ,bc.unit 
       ,bc.cnsum_count
FROM bom b JOIN bom_cmpds bc  
on b.bom_code = bc.bom_code
WHERE b.bom_code = ?`;

// BOM 등록 쿼리
 const bomInsert =  
`INSERT INTO bom_cmpds 
 SET ?`;

 
// BOM 소모품 조회
const bomManage = 
`SELECT c.cmpds_no
       ,b.bom_code
       ,b.prdlst_code
       ,b.prdist_name
       ,b.prdctn_qy
	,c.cmpds_prdlst_code
	,c.cmpds_prdlst_name
       ,c.stndrd_y
	,c.unit
	,c.cnsum_count
FROM bom b JOIN bom_cmpds c 
ON b.bom_code = c.bom_code
WHERE b.prdlst_code = ?`;


// BOM 소모품 업데이트
const bom_cmpdsUpdate = 
`UPDATE bom_cmpds
 SET ?
 WHERE cmpds_no = ?`;


// BOM소모품 삭제
const bom_cmpdsDel = 
`DELETE from
bom_cmpds
WHERE cmpds_no = ?`;

// 자재 조회
const mtril =
`SELECT mtril_code
       ,mtril_name
       ,unit
       ,untpc
       ,sfinvc
FROM mtril`;


// 품질검사항목관리
const qiList =
`SELECT inspec_item  
        ,inspec_standard
FROM inspection_detail 
WHERE prd_code=?`; 
 
// 공정 흐름도 조회
const procsFlowchartList = 
`SELECT prd_code, prd_nm, sum(expect_reqre_time) as all_time
 FROM procs_flowchart
 GROUP BY prd_code, prd_nm
`;

// 공정 흐름도 상세 조회
const procsFlowchartDetail = 
`SELECT DISTINCT procs_flowchart.procs_ordr_no, 
                 procs_flowchart.expect_reqre_time, 
                 procs_flowchart.procs_nm, 
                 procs_matrl.mtril_nm, 
                 procs_matrl.usgqty, 
                 procs_mchn.eqp_code
 FROM procs_flowchart
 left outer JOIN procs_matrl
 ON procs_flowchart.procs_code = procs_matrl.procs_code
 JOIN procs_mchn
 ON procs_flowchart.procs_code = procs_mchn.procs_code
 WHERE prd_code = ? 
 ORDER BY 1
`;

// 공정 흐름도 상세 조회 상단
const procsFlowchartDetailTop = 
`SELECT prd_code, prd_nm, sum(expect_reqre_time) AS all_time
 FROM procs_flowchart
 WHERE prd_code = ?
 GROUP BY prd_code, prd_nm
`;

// 공정 흐름도에 사용하는 BOM 코드 조회
const procsFlowchartSearchBom = 
`SELECT bom_code
 FROM bom
 WHERE prdlst_code = ?
`;

// 공정 흐름도에 사용하는 자재명 조회
const procsFlowchartSearchmtnm = 
`SELECT mtril_code
 FROM mtril
 WHERE mtril_name = ?
`;

// 공정 흐름도 생성
const procsFlowchartInsert = 
`INSERT INTO procs_flowchart(procs_code, 
                             procs_nm, 
                             prd_code, 
                             prd_nm, 
                             procs_ordr_no, 
                             expect_reqre_time, 
                             bom_code) 
 VALUES(?, ?, ?, ?, ?, ?, ?)
`;
 
// 공정별 재료 소모 생성
const procsMatrlInsert = 
`INSERT INTO procs_matrl(procs_matrl_no, 
                         procs_code, 
                         procs_nm, 
                         mtril_code, 
                         mtril_nm, 
                         usgqty
)
 VALUES (nextval(procs_matrl_seq), ?, ?, ?, ?, ?)
`;

// 공정별 작업기기 생성
const procsMchnInsert = 
`INSERT INTO procs_mchn(procs_mhrls_no, 
                        procs_code, 
                        eqp_code
)
 VALUES (nextval(procs_mchn_seq), ?, ?)
`;

// 품목 코드로 공정 코드 조회
const prdCodeToProcsCode = 
`SELECT procs_code
 FROM procs_flowchart
 WHERE prd_code = ?
`;

// 공정 코드로 공정 흐름도 삭제 (테이블 3개)
const ProcsCodeToDeleteMchn = 
`DELETE FROM procs_mchn
 WHERE procs_code = ?
`;

const ProcsCodeToDeleteMatrl = 
`DELETE FROM procs_matrl
 WHERE procs_code = ?
`;

const ProcsCodeToDeleteFlowchart = 
`DELETE FROM procs_flowchart
 WHERE procs_code = ?
`;

// 품목코드 검색용 조회
const prd_code_search = 
`SELECT DISTINCT prd_code, 
                 prd_nm
 FROM procs_flowchart
 WHERE prd_code LIKE CONCAT('%', ?, '%')`;

module.exports = {
  bom,
  bomInfo,
  bomInsert,
  bomManage,
  bom_cmpdsUpdate,
  bom_cmpdsDel,
  mtril,
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
  prd_code_search
};