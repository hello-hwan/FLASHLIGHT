//물류 sql

// 반제품 입고 대기 리스트
const prdctn_n_list = 
`WITH MaxProcsN AS (SELECT prd_code 
                   ,MAX(procs_ordr_no) AS max_procs_ordr_no
FROM procs_flowchart
WHERE prd_code IS NOT NULL
GROUP BY prd_code
)
SELECT  d.prd_code
       ,d.prd_nm
       ,s.end_time
       ,s.nrmlt
       ,s.prdctn_code
FROM prdctn_drct d join product_state s
ON d.prdctn_code = s.prdctn_code
LEFT JOIN prduct_n_wrhousng w
ON s.prdctn_code = w.prdctn_code
JOIN MaxProcsN mp
ON s.prd_code = mp.prd_code
WHERE s.prd_code LIKE 'N%'
AND s.nrmlt > 0
AND s.end_time IS NOT NULL
AND w.prduct_n_wrhousng_day IS NULL
AND EXISTS ( SELECT 1
             FROM procs_flowchart p
	      WHERE p.prd_code = s.prd_code
	      AND p.procs_ordr_no = mp.max_procs_ordr_no)`;

// 수정 전
// `SELECT d.prd_code
//        ,d.prd_nm
//        ,s.end_time
//        ,s.nrmlt
//        ,s.prdctn_code
// FROM prdctn_drct d join product_state s
// ON d.prdctn_code = s.prdctn_code
// AND s.end_time IS NOT NULL
// LEFT JOIN prduct_n_wrhousng w
// ON s.prdctn_code = w.prdctn_code
// WHERE s.prd_code LIKE 'N%'
// AND w.prduct_n_wrhousng_day IS NULL`;


// 반제품 반환입고 대기 리스트
const prdctn_n_return_list = 
`WITH MaxProcsN AS (SELECT prd_code 
                  ,MAX(procs_ordr_no) AS max_procs_ordr_no
FROM procs_flowchart
WHERE prd_code IS NOT NULL
GROUP BY prd_code
)
SELECT d.prduct_n_dlivy_no
      ,d.prduct_n_name
      ,d.prduct_n_code
      ,d.nusgqty
      ,d.requst_date
      ,t.prdctn_code
FROM prduct_n_dlivy d JOIN prduct_n_wrhousng w 
ON d.prduct_n_lot = w.prduct_n_lot
JOIN thng_req t 
ON d.prduct_n_code = t.req_code
JOIN MaxProcsN mp ON d.prduct_n_code = mp.prd_code
WHERE d.usgstt = 'MU02'
AND d.nusgqty > 0
AND t.procs_at = 'RD01' 
AND EXISTS ( SELECT 1
             FROM procs_flowchart p
             WHERE p.prd_code = d.prduct_n_code
             AND p.procs_ordr_no = mp.max_procs_ordr_no)
ORDER BY d.requst_date`;

// `SELECT d.prduct_n_dlivy_no
//        ,d.prduct_n_name
//        ,d.prduct_n_code
//        ,d.nusgqty
//        ,d.requst_date
//        ,t.prdctn_code
// FROM prduct_n_dlivy d JOIN prduct_n_wrhousng w
// ON d.prduct_n_lot = w.prduct_n_lot
// JOIN thng_req t
// ON  d.req_code = t.req_code
// WHERE d.usgstt = 'MU02'
// AND d.nusgqty > 0
// ORDER BY requst_date`;



// 반제품 반환 등록
const prduct_n_wrhousngReturn = 
`INSERT INTO prduct_n_wrhousng( prduct_n_lot
                               ,prdlst_code
                               ,prduct_n_wrhousng_day
				   ,se
                               ,prduct_name 
				   ,prdctn_code 
				   ,prduct_n_wrhousng_qy
				   ,prduct_n_invntry_qy)
VALUES (CONCAT('NLOT-',nextval(prduct_n_wrhousng_seq)),
         ?,
         now(),
         '반환',
         ?,
         ?,
         ?,
         ?)`;


// 반제품 반환 등록 후 반제품 출고 테이블 업데이트
const prduct_n_dlivyReturn =
`UPDATE prduct_n_dlivy
SET nusgqty = 0
WHERE prduct_n_dlivy_no = ?`;

// 반제품 등록
const prduct_n_wrhousng = 
`INSERT INTO prduct_n_wrhousng( prduct_n_lot
                               ,prduct_name 
                               ,prduct_n_wrhousng_day
				   ,se
				   ,prdlst_code
				   ,prdctn_code 
				   ,prduct_n_wrhousng_qy
				   ,prduct_n_invntry_qy)
VALUES (CONCAT('NLOT-',nextval(prduct_n_wrhousng_seq)),
       ?,
       now(),
       '일반',
       ?,
       ?,
       ?,
       ?)`;

// 반제품 입고완료 리스트
const prduct_n_wrhousngList =
`SELECT prduct_n_lot
       ,prduct_name
       ,prduct_n_wrhousng_day
       ,se
       ,prdlst_code
       ,prduct_n_invntry_qy 
FROM prduct_n_wrhousng
WHERE prduct_n_invntry_qy > 0
ORDER BY prduct_n_lot DESC`;

// 반제품 출고 요청 리스트(수정해야됨)
const prduct_n_dlivy =
`SELECT prdctn_code
       ,req_name
       ,req_de
       ,procs_at
       ,COUNT(prd_code) AS prd_code
FROM thng_req
WHERE prd_se = 'PI02'
AND procs_at = 'RD02'
GROUP BY prdctn_code`;


// 반제품 출고 나가야될 제품 리스트
const prduct_n_possible = 
`SELECT t.req_name
       ,t.req_code
       ,t.prd_nm
       ,t.prd_code
       ,t.req_qy
       ,t.req_de
       ,t.prdctn_code
FROM thng_req t
WHERE procs_at = 'RD02'
AND prdctn_code = ?`;

// 반제품 출고 가능 lot 수량
const prduct_n_qy = 
`SELECT prduct_n_lot
       ,prduct_n_invntry_qy
FROM    prduct_n_wrhousng
WHERE   prdlst_code = ?
AND     prduct_n_invntry_qy > 0`;

// 반제품 출고처리 프로시저 
const prduct_n_dlivyTest =
`CALL PROC_test(
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?
)`;

// 반제품 출고완료 리스트
const prduct_n_dlivyList =
`SELECT prduct_n_req_name
       ,requst_date
       ,prduct_n_name
       ,req_code
FROM prduct_n_dlivy
GROUP BY prduct_n_req_name
ORDER BY requst_date DESC`;

// 반제품 출고완료 상세 리스트
const prductNDlivyListInfo = 
`SELECT prduct_n_name
       ,prduct_n_code
       ,requst_qy
       ,usgqty
       ,nusgqty
       ,requst_date
       ,prduct_n_lot
FROM prduct_n_dlivy
WHERE req_code = ?`;


// 완제품 입고 대기 리스트
const prductList = 
`WITH MaxProcs AS (SELECT prd_code 
                  ,MAX(procs_ordr_no) AS max_procs_ordr_no
FROM procs_flowchart
WHERE prd_code IS NOT NULL
GROUP BY prd_code
)
SELECT d.prd_code
      ,d.prd_nm
      ,s.end_time
      ,s.nrmlt
      ,s.prdctn_code
FROM prdctn_drct d JOIN product_state s
ON d.prdctn_code = s.prdctn_code
LEFT JOIN prduct_wrhousng w
ON s.prdctn_code = w.prdctn_code
JOIN MaxProcs mp
ON s.prd_code = mp.prd_code
WHERE  s.prd_code LIKE 'C%'
AND s.nrmlt > 0
AND s.end_time IS NOT NULL
AND w.wrhousng_day IS NULL
AND EXISTS ( SELECT 1
             FROM procs_flowchart pf
             WHERE pf.prd_code = s.prd_code
             AND pf.procs_ordr_no = mp.max_procs_ordr_no)`;

// 수정전
// `SELECT d.prd_code
//        ,d.prd_nm
//        ,s.end_time
//        ,s.nrmlt
//        ,s.prdctn_code
// FROM prdctn_drct d join product_state s
// ON d.prdctn_code = s.prdctn_code
// LEFT JOIN prduct_wrhousng w
// ON s.prdctn_code = w.prdctn_code
// WHERE s.prd_code LIKE 'C%'
// AND s.nrmlt > 0
// AND s.end_time IS NOT NULL
// AND w.wrhousng_day IS NULL`;

// 완제품 입고 등록
const prductWrhousng = 
`INSERT INTO prduct_wrhousng (prduct_lot
                             ,wrhousng_day
                             ,prduct_name
                             ,prdlst_c_code
                             ,prdctn_code
                             ,prduct_wrhousng_qy
                             ,prduct_invntry_qy)
VALUES (CONCAT('LOT-',nextval(prduct_wrhousng_seq))
       ,now()
       ,? 
       ,?
       ,?
       ,?
       ,?)`;


// 완제품 출고 요청 리스트
const prduct_possible =
`SELECT l.order_no
       ,MIN(l.order_list_no) AS order_list_no 
       ,l.process_status
       ,r.order_date
       ,COUNT(DISTINCT l.prd_code) AS prd_code 
FROM order_lists l JOIN order_requst r
ON l.order_no = r.order_no
WHERE l.process_status = 'OD01'
AND l.prd_code LIKE 'C%'
GROUP BY l.order_no, l.process_status, r.order_date
ORDER BY l.order_no`;

// 수정전
// `SELECT l.order_no
//        ,l.order_list_no
//        ,l.process_status
//        ,r.order_date
//        ,count(l.prd_code) AS prd_code
// FROM order_lists l JOIN order_requst r
// ON l.order_no = r.order_no
// WHERE process_status = 'OD01'
// AND l.prd_code LIKE 'C%'
// GROUP BY l.order_no, l.order_list_no, l.process_status, r.order_date`;


// 완제품 출고 나가야될 제품 리스트
const prduct_possible_dlivy =
`SELECT l.order_no
       ,l.order_list_no
       ,l.prd_name
       ,l.prd_code
       ,l.order_qy
       ,r.order_date
FROM order_lists l JOIN order_requst r
ON l.order_no = r.order_no
WHERE process_status = 'OD01'
AND order_qy > 0
AND l.order_no = ?`;


// 완제품 출고 나갈수있는 제품 lot , 수량
const prduct_qy =
`SELECT prduct_lot
       ,prduct_invntry_qy
FROM    prduct_wrhousng
WHERE   prdlst_c_code = ?
AND     prduct_invntry_qy > 0`;



// 완제품 출고 등록 및 주문서 테이블, 입고테이블 업데이트
const prduct_dliy_process =
`CALL prduct_dliy_process(
?,
?,
?,
?,
?
)`;

// 완제품 출고 완료 요청리스트
const prduct_dlivyList=
`SELECT o.order_no
       ,d.dlivy_day as wrhousngDay
       ,d.prdlst_code
       ,d.order_list_no
       ,o.prd_name
FROM prduct_dlivy d JOIN order_lists o
ON d.order_list_no = o.order_list_no
GROUP BY o.order_no
ORDER BY wrhousngDay DESC`;


// 완제품 출고 완료 상세리스트
const prductDlivyListInfo =
`SELECT d.prduct_lot
       ,d.dlivy_qy
       ,d.dlivy_day
       ,d.prdlst_code
       ,o.prd_name
FROM prduct_dlivy d JOIN order_lists o
ON d.order_list_no = o.order_list_no
WHERE o.order_no = ?`;



// 완제품 출고 완료 리스트
const prductWrhousngList = 
`SELECT prduct_lot
       ,prduct_name
       ,wrhousng_day
       ,prdlst_c_code
       ,prduct_invntry_qy 
FROM prduct_wrhousng
WHERE prduct_invntry_qy > 0
ORDER BY prduct_lot DESC`;


module.exports = {
  prdctn_n_list,
  prduct_n_wrhousng,
  prduct_n_wrhousngList,
  prduct_n_dlivy,
  prduct_n_possible,
  prduct_n_qy,
  prduct_n_dlivyTest,
  prduct_n_dlivyList,
  prductList,
  prductNDlivyListInfo,
  prductWrhousng,
  prductWrhousngList,
  prduct_possible,
  prduct_possible_dlivy,
  prduct_qy,
  prduct_dliy_process,
  prduct_dlivyList,
  prductDlivyListInfo,
  prdctn_n_return_list,
  prduct_n_wrhousngReturn,
  prduct_n_dlivyReturn
};