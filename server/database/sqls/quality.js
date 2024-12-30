// 발주요청
const order_request =
`SELECT order_no,
		 mtlty_name,
		 bcnc_code,
		 mtril_name,
		 mtril_code,
		 order_qy	 
FROM mtril_order
WHERE order_no=?`;

//검사항목
const inspec_item =
`SELECT inspec_standard,inspec_item
FROM inspection_detail
WHERE prd_code=?`;

//품질입고검사 기본키조회
const getsquance =
`SELECT CONCAT('INS', LPAD(IFNULL(MAX(CAST(SUBSTR(mtril_check_code, 5) AS UNSIGNED)) + 1, 1), 5, '0')) AS mtril_check_code
FROM inspection_check`;

//품질입고검사 등록
const quailtyInsert = 
`INSERT INTO inspection_check(mtril_check_code 
							 ,prd_code
							 ,mtril_name
							 ,rec_num
							 ,test_date
							 ,mtlty_name
							 ,empl_no
							 ,pass_amount
							 ,order_no
							 ,bcnc_code)
VALUES(?,?,?,?,now(),?,?,?,?,?)`;

//품질입고검사 등록2
const quailtyInsert2 =
`INSERT INTO check_result(inspec_standard
						 ,inspec_item
						 ,p_result
						 ,error_amount
						 ,mtril_check_code)
VALUES(?,?,?,?,?)`;

//품질검사결과
const qiResult = 
`SELECT  mtril_check_code
		,mtril_name
		,mtlty_name
		,test_date
		,empl_no
		,pass_amount
FROM inspection_check`;

//품질검사결과2
const qiResult2 =
`SELECT mtril_check_code
		,inspec_standard
		,inspec_item
		,error_amount
		,p_result
FROM check_result
WHERE mtril_check_code=?`;





// 결과
module.exports = {
    order_request,
    inspec_item,
	quailtyInsert,
	quailtyInsert2,
	qiResult,
	qiResult2,
	getsquance

};