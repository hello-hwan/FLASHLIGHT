//물류 sql

// 반제품 입고 리스트
const prdctn_n_list = 
`SELECT i.prd_code
      ,i.mtril_name
      ,i.test_date
      ,i.pass_amount
      ,i.mtril_check_code
FROM inspection_check i LEFT JOIN prduct_n_wrhousng p
ON i.mtril_check_code = p.qltinsp_code
WHERE (i.prd_code LIKE '%I1%' OR i.prd_code LIKE '%G%')
AND p.prduct_n_wrhousng_day IS NULL`;


// 반제품 등록
const prduct_n_wrhousng = 
`INSERT INTO prduct_n_wrhousng(prduct_n_lot
                              ,prduct_name
                              ,prduct_n_wrhousng_day
									            ,se
									            ,prdlst_code
									            ,qltinsp_code 
									            ,prduct_n_wrhousng_qy
									            ,prduct_n_invntry_qy)
VALUES (CONCAT('NLOT-',nextval(prduct_n_wrhousng_seq)), ?,now(),'일반',?,?,?,?)`;

// 반제품 입고완료 리스트
const prduct_n_wrhousngList =
`SELECT prduct_n_lot
      ,prduct_name
      ,prduct_n_wrhousng_day
      ,se
      ,prdlst_code
      ,prduct_n_invntry_qy 
FROM prduct_n_wrhousng`;

// 반제품 출고
const prduct_n_dlivy =
`SELECT req_name
       ,req_de
       ,procs_at
FROM thng_req
WHERE req_name LIKE '%아이폰%' 
AND `;

module.exports = {
  prdctn_n_list,
  prduct_n_wrhousng,
  prduct_n_wrhousngList,
  prduct_n_dlivy
};