//기준정보 sql

// 반제품 조회 (bom모달)
const prductNModel =
`SELECT prdlst_code
       ,prdlst_name
       ,unit
       ,wrhousng_unite
       ,sfinvc
FROM prduct_n`;


// BOM 조회
const bom =
`SELECT bom_code
       ,prdlst_code
       ,prdist_name
       ,prdctn_qy
       ,sumry 
FROM bom
ORDER BY CAST(SUBSTRING(bom_code, 4) AS INT) DESC`;
  
// BOM 상세보기 쿼리
const bomInfo =
`SELECT bc.cmpds_no
       ,b.bom_code
       ,b.prdlst_code as prdlst_codeInfo
	,b.prdist_name as prdlst_nameInfo
       ,bc.stndrd_x
	,bc.stndrd_y
       ,bc.stndrd_z
       ,bc.unit 
       ,bc.cnsum_count
       ,b.sumry
FROM bom b LEFT JOIN bom_cmpds bc  
on b.bom_code = bc.bom_code
WHERE b.bom_code = '?`;

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
                        unit,
                        cnsum_count)
VALUES (CONCAT('M-SL', nextval(bom_cmpds_seq)), 
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

// BOM 삭제
const bomDelete =
`DELETE FROM
bom
WHERE bom_code = ?`

// 반제품 조회(모달)
const prduct_n = 
`SELECT prdlst_code as prdlst_n_code
       ,prdlst_name as prdlst_n_name
FROM prduct_n`;

// 완제품 조회(모달)
const prduct =
`SELECT prdlst_code
       ,prdlst_name
FROM repduct`;

const bomAdd =
`INSERT INTO BOM (bom_code
                 ,prdlst_code
                 ,prdist_name
                 ,prdctn_qy
                 ,sumry)
VALUES (CONCAT('bb-',NEXTVAL(bom_code_seq))
       ,?
       ,?
       ,?
       ,?)`

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
	 ,m.sfinvc
ORDER BY m.mtril_code DESC`;

//자재 등록시 필요한 mtril_code가져오기
const mtKey = 
`
SELECT CONCAT('M', LPAD(IFNULL(MAX(CAST(SUBSTR(mtril_code, 3) AS UNSIGNED)) + 1, 1), 3, '0')) AS mtril_code
FROM mtril
`;

// 자재 등록
const mtrilAdd =
`INSERT INTO mtril (mtril_code
                   ,mtril_name
                   ,unit
                   ,untpc
                   ,sfinvc)
VALUES (?,
        ?,
        ?,
        0,
        ?)`;

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
`SELECT prdlst_code
       ,prdlst_name
       ,stndrd_x
       ,stndrd_y
       ,stndrd_z
       ,unit
       ,wrhousng_unite
       ,dlivy_unit
       ,sfinvc
FROM prduct_n
ORDER BY prdlst_code DESC`;

// 반제품 등록
const prductNAdd = 
`INSERT INTO prduct_n(prdlst_code
                     ,prdlst_name
                     ,stndrd_x
                     ,stndrd_y
                     ,stndrd_z
                     ,unit
                     ,wrhousng_unite
                     ,dlivy_unit
                     ,sfinvc)
VALUES (CONCAT('N-',nextval(prduct_n_no_seq))
       ,?
       ,?
       ,?
       ,?
       ,?
       ,?
       ,?
       ,?)`;

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
	 ,r.sfinvc
ORDER BY r.prdlst_code DESC`;

// 완제품 등록
const prductInsert = 
`INSERT INTO repduct (prdlst_code
                     ,prdlst_name
                     ,stndrd_x
                     ,stndrd_y
                     ,stndrd_z
                     ,unit
                     ,wrhousng_untpc
                     ,dlivy_untpc
                     ,sfinvc)
VALUES (CONCAT('C-',nextval(repduct_no_seq))
       ,?
       ,?
       ,?
       ,?
       ,?
       ,?
       ,?
       ,?)`;

// 완제품 삭제
const prductDelete = 
`DELETE FROM
repduct
WHERE prdlst_code = ?`

// 완제품 수정
const prductUpdate =
`UPDATE repduct
set ?
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
FROM bcnc
ORDER BY bcnc_code DESC`;

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

// 거래처 수정
const bcncUpdate = 
`UPDATE bcnc
set ?
WHERE bcnc_code = ?`;
 
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

// 공정 흐름도에 사용하는 반제품 코드 조회
const procsFlowchartSearchpron =
`SELECT prdlst_code
 FROM prduct_n
 WHERE prdlst_name = ?;
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

// 제품 코드로 BOM 조회해서 사용 재료 조회
const prd_code_bom_cmpds_list = 
`SELECT cmpds_prdlst_code, 
       cmpds_prdlst_name, 
       unit, 
       cnsum_count
FROM bom_cmpds
WHERE bom_code = ( SELECT bom_code
                   FROM bom
                   WHERE prdlst_code = ?
);`;

// 전체 사원 조회
const select_all_empl = 
`SELECT empl.empl_no, 
        empl.empl_name, 
        empl.password,
        empl.phone, 
        empl.dept_se, 
        cmmn.cmmn_name,
        empl.encpn, 
        empl.retire_day, 
        empl.author
 FROM empl
 JOIN cmmn
 ON empl.dept_se = cmmn.cmmn_code`;

// 사원 검색
const search_empl = 
`SELECT empl.empl_no, 
        empl.empl_name, 
        empl.password,
        empl.phone, 
        empl.dept_se, 
        cmmn.cmmn_name,
        empl.encpn, 
        empl.retire_day, 
        empl.author
 FROM empl
 JOIN cmmn
 ON empl.dept_se = cmmn.cmmn_code
 WHERE empl.empl_no LIKE CONCAT('%', ?, '%')
 AND empl.empl_name LIKE CONCAT('%', ?, '%')
 AND empl.phone LIKE CONCAT('%', ?, '%')
 AND empl.dept_se LIKE CONCAT('%', ?, '%')`;

// 사원 등록
const insert_empl = 
`INSERT INTO empl (empl_no, 
                   empl_name, 
                   password,
		     phone, 
		     dept_se, 
		     encpn, 
		     author
)
VALUES (?, ?, ?, ?, ?, NOW(), ?)`;

// 비밀번호 확인
const search_pw = 
`SELECT password
 FROM empl
 WHERE empl_no = ?`;

// 사원 변경
const update_empl = 
`UPDATE empl
 SET empl_no = ?, 
     empl_name = ?, 
     password = ?, 
     phone = ?, 
     dept_se = ?, 
     author = ?
 WHERE empl_no = ?`;

// 사원 퇴사
const delete_empl = 
`UPDATE empl
 SET retire_day = NOW()
 WHERE empl_no = ?`;

 //로그인을 위한 select
 const loginSelect =
 `
 SELECT empl_no,
        password,
        empl_name,
        dept_se
 FROM   empl
 WHERE  empl_no = ?
 AND    password = ?
 `;
 
module.exports = {
  prductNModel,
  bom,
  bomInfo,
  bomInsert,
  bomManage, 
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
  infoprductNList,
  prductNAdd,
  prductNDelete,
  prductNUpdate, 
  infoprductList,
  prductInsert,
  prductDelete,
  prductUpdate,
  bcncList,
  bcncUpdate,
  procsFlowchartList, 
  procsFlowchartDetail, 
  procsFlowchartDetailTop, 
  procsFlowchartSearchBom, 
  procsFlowchartSearchmtnm, 
  procsFlowchartSearchpron, 
  procsFlowchartInsert, 
  procsMatrlInsert, 
  procsMchnInsert, 
  prdCodeToProcsCode, 
  ProcsCodeToDeleteMchn, 
  ProcsCodeToDeleteMatrl, 
  ProcsCodeToDeleteFlowchart, 
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
  loginSelect,
  mtKey
};