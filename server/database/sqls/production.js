//생산 sql

// 순서 
// 주문리스트에서 처리중, 생산인 품목이랑 수량, 주문번호, 납품기한 가져와서 
// 공정흐름도에서 총 예상소요시간, 총 필요 자재 수량 조회해서
// 자재에서 자재 총 수량 확인해서
// 생산계획에 인서트 한다.

// 생산해야하는 주문의 품목별소모재료
const pr_selmtlused = 
`
SELECT mtril_code, usgqty * oli.order_qy
FROM procs_matrl pm JOIN procs_flowchart pfc ON (pm.procs_code = pfc.procs_code)
						  JOIN order_lists oli ON (oli.prd_code = pfc.prd_code)
WHERE	prdctn_at = 'OP01'
AND process_status = 'OD01'
GROUP BY mtril_code
`;

// 생산해야하는 주문의 품목별 소요시간
const pr_seltime = 
`
SELECT pfc.prd_code, sum(expect_reqre_time) * oli.order_qy
FROM procs_flowchart pfc JOIN order_lists oli ON (pfc.prd_code = oli.prd_code)
WHERE	prdctn_at = 'OP01'
AND process_status = 'OD01'
GROUP BY pfc.prd_code
`;

// 생산해야하는 주문의 자재 수량
const pr_selmtl = 
`
SELECT mwh.mtril_code, sum(mtril_qy)
FROM mtril_wrhousing mwh JOIN procs_matrl pm ON (mwh.mtril_code = pm.mtril_code)
JOIN procs_flowchart pfc ON (pm.procs_code = pfc.procs_code)
JOIN order_lists oli ON (oli.prd_code = pfc.prd_code)
WHERE	prdctn_at = 'OP01'
AND process_status = 'OD01'
GROUP BY mtril_code
`;

// 생산해야하는 주문의 반제품 수량
const pr_selprodn = 
`
SELECT pnw.prdlst_code, sum(prduct_n_wrhousng_qy)
FROM prduct_n_wrhousng pnw JOIN procs_matrl pm ON (pnw.prdlst_code = pm.mtril_code)
JOIN procs_flowchart pfc ON (pm.procs_code = pfc.procs_code)
JOIN order_lists oli ON (oli.prd_code = pfc.prd_code)
WHERE	prdctn_at = 'OP01'
AND process_status = 'OD01'
GROUP BY prdlst_code
`


// 조회문

const pr_selcmmn = // 공통코드 목록 조회
`
select *
from cmmn
`; 

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



// 삽입문
const pr_insplan = // 생산 계획에 삽입
`
INSERT INTO prdctn_plan
SET ?
`;



// 수정문




// 삭제문




module.exports = {
  pr_selcmmn,
  pr_selorder,
  pr_selflowchart,
  pr_selsumtime,
  pr_selsumqy
};