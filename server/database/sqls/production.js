//생산 sql

// 조회문

const pr_nem = // 재고 부족한 생산 계획 조회
`
SELECT tr.req_code, tr.prd_code AS mtril_code, tr.prd_nm AS mtril_nm, tr.req_qy, tr.req_qy AS real_qy, pp.prd_code, pp.prd_nm
FROM thng_req tr JOIN prdctn_plan pp ON (tr.mnfct_no = pp.mnfct_no)
WHERE tr.prdctn_code IS NULL
AND prd_se = 'PI01'
AND tr.procs_at = 'RD03'
`;

const pr_eqp = // 설비 조회 (생산지시)
`
SELECT eqp_code, model_nm
FROM eqp
ORDER BY 2
`;

const pr_srcdrct = // 생산 지시 당일 조회
`
SELECT pd.prdctn_code, pd.mnfct_no, pd.procs_code, pd.procs_nm, pd.eqp_code, pd.model_nm, pd.prd_code, pd.prd_nm, pd.prdctn_co, pd.pre_begin_time, pd.pre_end_time, ps.begin_time, ps.end_time
FROM prdctn_drct pd LEFT JOIN product_state ps ON (pd.prdctn_code = ps.prdctn_code)
WHERE pd.pre_begin_time < DATE_ADD(CURDATE(), INTERVAL 1 DAY )
AND pd.pre_end_time > CURDATE()
ORDER BY pd.pre_begin_time
`;

const pr_srcdrcttoday = // 테스트용 내일
`
SELECT pd.prdctn_code, pd.mnfct_no, pd.procs_code, pd.procs_nm, pd.eqp_code, pd.model_nm, pd.prd_code, pd.prd_nm, pd.prdctn_co, pd.pre_begin_time, pd.pre_end_time, ps.begin_time, ps.end_time
FROM prdctn_drct pd LEFT JOIN product_state ps ON (pd.prdctn_code = ps.prdctn_code)
WHERE pd.pre_begin_time < DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 1 DAY ), INTERVAL 1 DAY)
AND pd.pre_end_time > DATE_ADD(CURDATE(), INTERVAL 1 DAY )
`


// 조건 조회문

const pr_seldrct = // 생산 지시 조회
`
SELECT pd.prdctn_code
       , pd.procs_nm
       , pd.model_nm
       , pd.prd_nm
       , pd.prdctn_co
       , pd.pre_begin_time
       , pd.pre_end_time
       , TIMESTAMPDIFF(hour, pd.pre_begin_time, pd.pre_end_time) AS drct_time
       , pp.order_no

FROM prdctn_drct pd 
JOIN prdctn_plan pp ON (pd.mnfct_no = pp.mnfct_no)

WHERE pd.prd_code LIKE CONCAT('%', ?, '%')
AND (pd.pre_begin_time BETWEEN ? AND DATE_ADD( ?, INTERVAL 7 DAY)
     OR pd.pre_end_time BETWEEN ? AND DATE_ADD( ?, INTERVAL 7 DAY) )

GROUP BY pd.eqp_code, pd.model_nm, pd.prdctn_code
ORDER BY pd.model_nm, pd.pre_begin_time
`;

const pr_anodrct = // 생산 지시 조회 테스트용 => 이게 맞는 듯
`
SELECT pd.prdctn_code
       , pd.procs_nm
       , pd.model_nm
       , pd.prd_nm
       , pd.prdctn_co
       , pd.pre_begin_time
       , pd.pre_end_time
       , TIMESTAMPDIFF(hour, pd.pre_begin_time, pd.pre_end_time) AS drct_time
       , pp.order_no

FROM prdctn_drct pd 
JOIN prdctn_plan pp ON (pd.mnfct_no = pp.mnfct_no)

WHERE pd.prd_code LIKE CONCAT('%', ?, '%')
AND (? BETWEEN pd.pre_begin_time AND pd.pre_end_time
     OR DATE_ADD( ?, INTERVAL 7 DAY) BETWEEN pd.pre_begin_time AND pd.pre_end_time
     OR pd.pre_begin_time BETWEEN ? AND DATE_ADD( ?, INTERVAL 7 DAY)
     OR pd.pre_end_time BETWEEN ? AND DATE_ADD( ?, INTERVAL 7 DAY) )

GROUP BY pd.eqp_code, pd.model_nm, pd.prdctn_code
ORDER BY pd.model_nm, pd.pre_begin_time
`;


const pr_selstate = // 공정 현황 - 당일 기준 검색
`
SELECT ps.prdctn_code, pd.procs_code, ps.procs_nm, ps.prd_code, pd.prd_nm, ps.prdctn_co, ps.eqp_code, ps.begin_time, ps.end_time, ps.empl_no, ps.empl_nm, ps.nrmlt, ps.badn, tr.prd_code AS matril_code, tr.prd_nm AS matril_nm, tr.req_qy
FROM product_state ps JOIN prdctn_drct pd ON (ps.prdctn_code = pd.prdctn_code)
				  JOIN thng_req tr ON (ps.prdctn_code = tr.prdctn_code)
WHERE ps.prd_code LIKE CONCAT('%', ?, '%')
AND (? BETWEEN pd.pre_begin_time AND pd.pre_end_time
     OR DATE_ADD( ?, INTERVAL 7 DAY) BETWEEN pd.pre_begin_time AND pd.pre_end_time
     OR pd.pre_begin_time BETWEEN ? AND DATE_ADD( ?, INTERVAL 7 DAY)
     OR pd.pre_end_time BETWEEN ? AND DATE_ADD( ?, INTERVAL 7 DAY) )
GROUP BY pd.eqp_code, pd.model_nm, pd.prdctn_code
ORDER BY pd.model_nm, pd.pre_begin_time
`;

const pr_selcmmn = // 공통코드 목록 조회
`
SELECT cmmn_name
FROM cmmn
WHERE cmmn_code = ?
`;

const pr_srcprd = // 제품명으로 조회시 코드랑 완전한 이름 뜨기 (검색 기능)
`
SELECT prdlst_code, prdlst_name
FROM repduct
WHERE prdlst_name LIKE CONCAT('%', ?, '%')
OR prdlst_code LIKE CONCAT('%', ? ,'%') 
`;

const pr_onedrct = // 생산지시 코드로 단건 조회
`
SELECT pd.prdctn_code, pd.mnfct_no, pd.procs_code, pd.procs_nm, pd.eqp_code, pd.model_nm, pd.prd_code, pd.prd_nm, pd.prdctn_co, pd.pre_begin_time, pd.pre_end_time, pp.order_no
FROM prdctn_drct pd JOIN prdctn_plan pp ON (pd.mnfct_no = pp.mnfct_no)
WHERE pd.prdctn_code = ?
`;

const pr_selmatrl = // 생산지시코드, 제작번호, 공정코드로 소모재료 조회
`
SELECT prd_code AS mtril_code, prd_nm AS mtril_nm, req_qy
FROM thng_req
WHERE prdctn_code = ?
AND mnfct_no = ?
`;

const pr_selempl = // 사원코드로 사원명 조회
`
SELECT empl_name
FROM empl
WHERE empl_no = ?
`;

const pr_onestate = // 생산지시 코드로 실적 단건 조회
`
SELECT ps.prdctn_code, pd.procs_code, ps.procs_nm, ps.prd_code, ps.prdctn_co, ps.eqp_code, pd.model_nm, ps.empl_no, ps.empl_nm, pd.mnfct_no
FROM product_state ps JOIN prdctn_drct pd ON (ps.prdctn_code = pd.prdctn_code)
WHERE ps.prdctn_code = ?
`;

const pr_cobad = // 생산지시 코드로 불량품 카운트 조회
`
SELECT CONCAT(?, '-', COUNT(badn_code)+1) as badn_code, sum(badn_qy) total_qy
FROM badn_info
WHERE prdctn_code = ?
`;

const pr_badco = // 생산지시 코드로 불량품 수량 조회
`
SELECT SUM(badn_qy) as badn_qy
FROM badn_info
WHERE prdctn_code = ?
`;

const pr_se = // 품목 코드, 생산지시 코드로 물품 요청에서 자재 구분 조회
`
SELECT prd_se
FROM thng_req
WHERE prdctn_code = ?
AND prd_code = ?
`;

const pr_mt = // 품목코드, 생산 지시 코드로 자재 출고에서 조회
`
SELECT md.dlivy_no, md.mtril_lot, md.mtril_name, md.requst_qy, md.usgqty, md.nusgqty, md.usgstt
FROM mtril_dlivy md JOIN thng_req tr ON (md.req_code = tr.req_code)
								    LEFT JOIN mtril_wrhousing mw ON (md.mtril_lot = mw.mtril_lot)
WHERE tr.prdctn_code = ?
AND tr.prd_code = ?
ORDER BY mw.wrhousng_date
`;

const pr_prdn = // 품목코드, 생산 지시 코드로 반제품 출고에서 조회
`
SELECT pnd.prduct_n_dlivy_no, pnd.prduct_n_lot, pnd.prduct_n_name, pnd.requst_qy, pnd.usgqty, pnd.nusgqty, pnd.usgstt
FROM prduct_n_dlivy pnd JOIN thng_req tr ON (pnd.req_code = tr.req_code)
                        LEFT JOIN prduct_n_wrhousng pnw ON (pnd.prduct_n_lot = pnw.prduct_n_lot)
WHERE tr.prdctn_code = c_prdctn_code
AND tr.prd_code = c_matril_code
ORDER BY pnw.prduct_n_wrhousng_day
`;

const pr_statelist = // 작업코드, 작업자, 작업시작 일자로 생산실적 조회
`
SELECT ps.prdctn_code, pd.procs_code, ps.procs_nm, ps.eqp_code, ps.begin_time, ps.end_time, ps.empl_no, ps.empl_nm, ps.nrmlt, ps.badn
FROM product_state ps LEFT JOIN prdctn_drct pd ON (ps.prdctn_code = pd.prdctn_code)
WHERE ps.end_time IS NOT NULL
AND pd.procs_code LIKE CONCAT('%', ?, '%')
AND ps.empl_no LIKE CONCAT('%', ?, '%')
AND ps.end_time LIKE CONCAT('%', ?, '%')
ORDER BY ps.end_time desc;
`;

const pr_movetable = // 공정이동표 조회
`
SELECT ps.procs_nm, ps.prdctn_co, ps.empl_nm, ps.end_time
FROM product_state ps JOIN prdctn_drct pd ON (ps.prdctn_code = pd.prdctn_code)
							        JOIN prdctn_plan pp ON (pd.mnfct_no = pp.mnfct_no)
WHERE ps.prd_code = ?
AND   pp.order_no = ?
ORDER BY 4;
`;

const pr_selprocs = // 공정명이나 코드로 공정 코드 검색
`
SELECT procs_code, procs_nm, prd_nm, procs_ordr_no
FROM procs_flowchart
WHERE procs_nm LIKE CONCAT('%', ?, '%')
OR procs_code LIKE CONCAT('%', ?, '%')
OR prd_nm LIKE CONCAT('%', ?, '%')
`;



// 삽입문
const pr_insstate = // 생산 실적 삽입
`
INSERT INTO product_state(prdctn_code, procs_nm, prd_code, prdctn_co, eqp_code, begin_time, empl_no, empl_nm)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;

const pr_insbad = // 불량품 정보 삽입
`
INSERT INTO badn_info(badn_code, badn_qy, badn_ty, prdctn_code)
VALUES (?, ?, ?, ?);
`;

const pr_insuse = // 생산 재료 소모 삽입
`
INSERT INTO use_mtril(mtril_no, thng_lot, mtril_code,	mtril_nm, mtril_se, qy, prdctn_code, dlivy_no)
VALUES (NEXTVAL(use_seq), ?, ?, ?, ?, ?, ?, ?);
`;




// 수정문

const pr_upreq = // 요청물품 수정(요청량, 처리중)
`
UPDATE thng_req
SET procs_at = 'RD02', req_de = NOW(), req_qy = ?
WHERE req_code = ?
`;

const pr_upstate = // 생산 실적 수정(종료시간, 양품, 불량품)
`
UPDATE product_state
SET end_time = ?, nrmlt = ?, badn = ?
WHERE prdctn_code = ?
`;

const pr_upmt = // 자재 소모 수정
`
UPDATE mtril_dlivy
SET usgstt = 'MU01', usgqty = ?, nusgqty = ?
WHERE dlivy_no = ?
`;

const pr_upprdn = // 반제품 소모 수정
`
UPDATE prduct_n_dlivy
SET usgstt = 'MU01', usgqty = ?, nusgqty = ?
WHERE prduct_n_dlivy_no = ?;
`;


// 삭제문




module.exports = {
  pr_selcmmn,
  pr_seldrct,
  pr_nem,
  pr_eqp,
  pr_srcprd,
  pr_upreq,
  pr_srcdrct,
  pr_onedrct,
  pr_selmatrl,
  pr_selempl,
  pr_insstate,
  pr_onestate,
  pr_insbad,
  pr_cobad,
  pr_badco,
  pr_upstate,
  pr_se,
  pr_mt,
  pr_prdn,
  pr_insuse,
  pr_upmt,
  pr_upprdn,
  pr_statelist,
  pr_movetable,
  pr_selstate,
  pr_selprocs,
  pr_anodrct,
  pr_srcdrcttoday,



};