//물류 sql

// 반제품 입고 리스트
const prdctn_n_list = 
`SELECT i.test_date
       ,i.prd_code
       ,i.pass_amount
       ,c.p_name
FROM inspection_check i JOIN check_result c
ON i.mtril_check_code = c.mtril_check_code`;


module.exports = {
  prdctn_n_list
};