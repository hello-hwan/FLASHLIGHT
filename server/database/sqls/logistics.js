//물류 sql

// 반제품 입고 대기 리스트
const prdctn_n_list = 
`SELECT i.prd_code
      ,i.mtril_name
      ,i.test_date
      ,i.pass_amount
      ,i.mtril_check_code
FROM inspection_check i LEFT JOIN prduct_n_wrhousng p
ON i.mtril_check_code = p.qltinsp_code 
WHERE prd_code LIKE 'N%'
AND p.prduct_n_wrhousng_day IS NULL`;


// 반제품 등록
const prduct_n_wrhousng = 
`INSERT INTO prduct_n_wrhousng( prduct_n_lot
                               ,prduct_name 
                               ,prduct_n_wrhousng_day
				   ,se
				   ,prdlst_code
				   ,qltinsp_code 
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
WHERE prduct_n_invntry_qy > 0`;

// 반제품 출고 요청 리스트(수정해야됨)
const prduct_n_dlivy =
`SELECT req_name
       ,req_de
       ,procs_at
       ,prd_code
       ,req_code
       ,prdctn_code
FROM thng_req
WHERE prd_se = 'PI02' 
AND procs_at = 'RD02'
GROUP BY prdctn_code`;


// 반제품 출고 가능 제품
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
`SELECT  prduct_n_lot,
        prduct_n_invntry_qy
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
    ?
)`;

// 반제품 출고완료 리스트
const prduct_n_dlivyList =
`SELECT prduct_n_req_name
       ,requst_date
       ,prduct_n_name
FROM prduct_n_dlivy
GROUP BY prduct_n_req_name`;

// 완제품 입고 대기 리스트
const prductList = 
`SELECT i.prd_code
      ,i.mtril_name
      ,i.test_date
      ,i.pass_amount
      ,i.mtril_check_code
FROM inspection_check i LEFT JOIN prduct_wrhousng p
ON i.mtril_check_code = p.prdlst_code 
WHERE (i.prd_code LIKE 'I1%' OR i.prd_code LIKE 'G%')
AND p.wrhousng_day IS NULL`;

// 완제품 입고 등록
const prductWrhousng = 
`INSERT INTO prduct_wrhousng (prduct_lot
                             ,wrhousng_day
                             ,prduct_name
                             ,prdlst_c_code
                             ,prdlst_code
                             ,prduct_wrhousng_qy
                             ,prduct_invntry_qy)
VALUES (CONCAT('LOT-',nextval(prduct_wrhousng_seq))
       ,now()
       ,? 
       ,?
       ,?
       ,?
       ,?)`;

const prductWrhousngList = 
`SELECT prduct_lot
       ,prduct_name
       ,wrhousng_day
       ,prdlst_c_code
       ,prduct_invntry_qy 
FROM prduct_wrhousng
WHERE prduct_invntry_qy > 0`;

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
  prductWrhousng,
  prductWrhousngList
};