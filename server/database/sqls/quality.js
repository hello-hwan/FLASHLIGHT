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


//품질입고검사 등록


//품질입고검사 등록2


//합격량 변경





// 결과
module.exports = {
    order_request,
    inspec_item

};