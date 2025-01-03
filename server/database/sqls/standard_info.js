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
       ,bc.bom_code
       ,bc.cmpds_prdlst_code
	,bc.cmpds_prdlst_name
       ,bc.stndrd_x
	,bc.stndrd_y
       ,bc.stndrd_z
       ,bc.unit 
       ,bc.cnsum_count
       ,b.sumry
FROM bom b JOIN bom_cmpds bc  
on b.bom_code = bc.bom_code
WHERE b.bom_code = ?`;

// BOM 업데이트
const bomUpdate = 
`UPDATE bom
set ?
where bom_code = ?`;

// BOM 등록 쿼리
const bomInsert =  
`INSERT INTO bom_cmpds (cmpds_no,
                        bom_code,
                        cmpds_prdlst_code,
                        cmpds_prdlst_name,
                        stndrd_x,
                        stndrd_y,
                        stndrd_z,
                        unit,
                        cnsum_count)
VALUES (CONCAT('M-SL', nextval(bom_cmpds_seq)), 
        ?, 
        ?, 
        ?, 
        ?, 
        ?, 
        ?, 
        ?, 
        ?)`;

// BOM 소모품 조회
const bomManage = 
`SELECT c.cmpds_no
       ,b.bom_code
       ,b.prdlst_code
       ,b.prdist_name
       ,b.prdctn_qy
	,c.cmpds_prdlst_code
	,c.cmpds_prdlst_name
       ,c.stndrd_x
       ,c.stndrd_y
       ,c.stndrd_z
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

// BOM 자재 리스트
const bomMtilList = 
`SELECT mtril_code
       ,mtril_name
       ,unit
       ,untpc
       ,sfinvc
FROM mtril`;

// BOM소모품 삭제
const bom_cmpdsDel = 
`DELETE from
bom_cmpds
WHERE cmpds_no = ?`;

// 자재 조회
const mtril =
`SELECT m.mtril_code
       ,m.mtril_name
       ,m.unit
       ,m.untpc
       ,m.sfinvc
       ,sum(w.mtril_qy) AS mtril_qy
FROM mtril m LEFT JOIN mtril_wrhousing w
ON m.mtril_code = w.mtril_code
GROUP BY m.mtril_code
        ,m.mtril_name
	 ,m.unit
	 ,m.untpc
	 ,m.sfinvc`;

// 자재 등록
const mtrilAdd =
`INSERT INTO mtril
SET ? `;

// 자재 삭제
const mtrilDelete = 
`DELETE FROM
mtril
WHERE mtril_code = ? `

// 자재 수정
const mtrilUpdate =
`UPDATE mtril
set ? 
WHERE mtril_code = ?`;

// 반제품 조회
const infoprductNList = 
`SELECT p.prdlst_code
      ,p.prdlst_name
      ,p.stndrd_x
      ,p.stndrd_y
      ,p.stndrd_z
      ,p.unit
      ,p.wrhousng_unite
      ,p.dlivy_unit
      ,p.sfinvc
      ,IFNULL(f.procs_ordr_no, 0) AS procs_ordr_no
FROM prduct_n p LEFT JOIN procs_flowchart f                   
ON prdlst_code = prd_code`;

// 반제품 등록
const prductNAdd = 
`INSERT INTO prduct_n
SET ?`;

// 반제품 삭제
const prductNDelete = 
`DELETE FROM
prduct_n
WHERE prdlst_code = ?`

// 반제품 수정
const prductNUpdate = 
`UPDATE prduct_n
set ?
WHERE prdlst_code = ?`;

// 완제품 조회
const infoprductList = 
`SELECT r.prdlst_code
       ,r.prdlst_name
       ,r.stndrd_x
       ,r.stndrd_y
       ,r.stndrd_z
       ,r.unit
       ,IFNULL(SUM(p.prduct_invntry_qy),0) AS prduct_invntry_qy
       ,r.wrhousng_untpc
       ,r.dlivy_untpc
       ,r.sfinvc
FROM repduct r LEFT JOIN prduct_wrhousng p
ON r.prdlst_code = p.prdlst_c_code
GROUP BY r.prdlst_code
        ,r.prdlst_name
	 ,r.stndrd_X
	 ,r.stndrd_y
	 ,r.stndrd_z
	 ,r.unit
	 ,r.wrhousng_untpc
	 ,r.sfinvc`;

// 완제품 등록
const prductInsert = 
`INSERT INTO repduct
set ?`;

// 완제품 삭제
const prductDelete = 
`DELETE FROM
repduct
WHERE prdlst_code = ?`

// 거래처 조회
const bcncList = 
`SELECT bcnc_code
       ,bizrno
       ,mtlty_name
       ,bizcnd
       ,item
       ,dvyfg_adres
       ,charger_name
       ,charger_phone
       ,regist_day
FROM bcnc`;
 
// 거래처 등록
const bcncAdd = 
`INSERT INTO bcnc (bcnc_code
                  ,bizrno
                  ,mtlty_name
                  ,bizcnd
                  ,item
                  ,dvyfg_adres
                  ,charger_name
                  ,charger_phone
                  ,regist_day)
VALUES (CONCAT('bcnc-', nextval(bcnc_seq))
       ,?
       ,?
       ,?
       ,?
       ,?
       ,?
       ,?
       ,now())`;

// 거래처 삭제
const bcncDelete = 
`DELETE FROM
bcnc
WHERE bcnc_code = ?`;

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

// BOM에 등록되어있는 품목코드, 품목이름 검색
const prd_code_bom_search = 
`SELECT prdlst_code, 
        prdist_name
 FROM bom
 WHERE prdlst_code LIKE CONCAT('%', ?, '%')`;

 const prd_code_bom_all_search = 
`SELECT prdlst_code, 
        prdist_name
 FROM bom`;

module.exports = {
  bom,
  bomInfo,
  bomInsert,
  bomManage, 
  bom_cmpdsUpdate,
  bom_cmpdsDel,
  bomMtilList,
  mtril,
  mtrilAdd,
  mtrilDelete,
  mtrilUpdate,
  infoprductNList,
  prductNAdd,
  prductNDelete,
  prductNUpdate, 
  infoprductList,
  prductInsert,
  prductDelete,
  bcncList,
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
  prd_code_search, 
  prd_code_bom_search, 
  prd_code_bom_all_search,
  bcncAdd,
  bcncDelete,
  bomUpdate
};