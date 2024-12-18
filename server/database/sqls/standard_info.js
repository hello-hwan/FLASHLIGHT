//기준정보 sql

const cmmn =
`SELECT cmmn_code
       ,upper_cmmn_code
       ,cmmn_name
FROM cmmn`;

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
`INSERT INTO bom_cmpds (cmpds_no
                       ,bom_code
                       ,cmpds_prdlst_code
                       ,cmpds_prdlst_name 
                       ,stndrd_x
                       ,stndrd_y
                       ,stndrd_z
                       ,unit
                       ,cnsum_count) 
VALUES(?,?,?,?,?,?,?,?,?)`; 



const bomManage = 
`SELECT b.prdlst_code
       ,b.prdctn_qy
	,c.cmpds_prdlst_code
	,c.cmpds_prdlst_name
	,c.stndrd_y
	,c.cnsum_count
FROM bom b JOIN bom_cmpds c 
ON b.bom_code = c.bom_code
WHERE b.prdlst_code = ?`;



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
`SELECT procs_flowchart.procs_ordr_no, 
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

module.exports = {
  cmmn,
  bom,
  bomInfo,
  bomInsert,
  bomManage,
  qiList,
  procsFlowchartList, 
  procsFlowchartDetail
};