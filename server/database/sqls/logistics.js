//물류 sql

// 반제품 입고 리스트
const prdctn_n_list = 
`SELECT i.test_date
       ,i.prd_code
       ,i.pass_amount
       ,i.mtril_check_code
       ,c.p_name
FROM inspection_check i JOIN check_result c
ON i.mtril_check_code = c.mtril_check_code`;

// 반제품 등록
const prduct_n_wrhousng = 
`INSERT INTO prduct_n_wrhousng(prduct_n_lot, prduct_name
                              ,prduct_n_wrhousng_day
									            ,se
									            ,prdlst_code
									            ,qltinsp_code 
									            ,prduct_n_wrhousng_qy
									            ,prduct_n_invntry_qy)
VALUES (CONCAT('NLOT-',nextval(prduct_n_wrhousng_seq)), ?,now(),'일반',?,?,?,?)`;


module.exports = {
  prdctn_n_list,
  prduct_n_wrhousng
};