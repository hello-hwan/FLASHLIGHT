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
`;


// 조건 조회문

const pr_seldrct = // 생산 지시 조회
`
SELECT pd.prdctn_code, pd.procs_nm, pd.model_nm, pd.prd_nm, pd.prdctn_co, pd.pre_begin_time, pd.pre_end_time, TIMESTAMPDIFF(hour, pd.pre_begin_time, pd.pre_end_time) AS drct_time, pp.order_no
FROM prdctn_drct pd JOIN prdctn_plan pp ON (pd.mnfct_no = pp.mnfct_no)
WHERE pd.prd_code LIKE CONCAT('%', ?, '%')
AND (pd.pre_begin_time BETWEEN ? AND DATE_ADD( ?, INTERVAL 7 DAY)
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
`;



// 삽입문




// 수정문

const pr_upreq = // 요청물품 수정(요청량, 처리중)
`
UPDATE thng_req
SET procs_at = 'RD02', req_de = NOW(), req_qy = ?
WHERE req_code = ?
`;



// 삭제문



// ----------------------  프로시저 만들기 전의 코드(서비스에서 제어하려고 한 코드)

// 조회문
const pr_selorder = // 주문리스트에서 생산하라는 목록 조회
`
SELECT ol.prd_code, ol.order_no, ol.prd_name, ol.order_qy, orr.order_date, orr.dete
FROM order_lists ol JOIN order_requst orr ON (ol.order_no = orr.order_no)
WHERE prdctn_at = 'OP01'
AND process_status = 'OD01'
ORDER BY 6
`;

// 조건 조회문
const pr_selflowchart = // 공정흐름도 조회 특정 품목 기반
`
SELECT fc.procs_code, fc.procs_nm, prd_code, prd_nm, procs_ordr_no, expect_reqre_time, bom_code, mtril_code, mtril_nm, usgqty, eqp_code
FROM procs_flowchart fc JOIN procs_matrl mt ON (fc.procs_code = mt.procs_code)
                        JOIN procs_mchn mc ON (fc.procs_code = mc.procs_code )
WHERE prd_code = ?
ORDER BY 1
`;

const pr_selsumtime = // 공정흐름도와 주문리스트 조인해서 예상시간 조회 특정 품목 기반(생산해야하는/ 처리중인)
`
SELECT SUM(pf.expect_reqre_time) * ol.order_qy AS total_time
FROM procs_flowchart pf JOIN order_lists ol ON (pf.prd_code = ol.prd_code)
WHERE pf.prd_code = ?
AND ol.prdctn_at = 'OP01'
AND ol.process_status = 'OD01'
`;

const pr_selsumqy = // 공정흐름도와 공정별소모재료, 주문리스트 조인해서 총 자재별 수량 조회 특정 품목 기반 (생산해야하는/ 처리중인)
`
SELECT fc.procs_code, fc.procs_nm, fc.prd_code, prd_nm, procs_ordr_no, expect_reqre_time, bom_code, mtril_code, mtril_nm, usgqty * order_qy AS total_qy
FROM procs_flowchart fc JOIN procs_matrl mt ON (fc.procs_code = mt.procs_code)
                        JOIN order_lists ol ON (fc.prd_code = ol.prd_code)
WHERE fc.prd_code = ?
AND ol.prdctn_at = 'OP01'
AND ol.process_status = 'OD01'
ORDER BY 1;
`;


module.exports = {
  pr_selcmmn,
  pr_seldrct,
  pr_nem,
  pr_eqp,
  pr_srcprd,
  pr_upreq,
  













  
  pr_selorder,
  pr_selflowchart,
  pr_selsumtime,
  pr_selsumqy,
};