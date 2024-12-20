// 품질검사요청 및 입고검사(모달창)

const qualityRequest=
`SELECT 
    A.mtril_check_code,
    A.prd_code,
    A.mtril_name,
    A.rec_num,
    A.test_date,
    A.mtlty_name,
    A.order_code,
    A.bcnc_code,
    A.manager,
    B.inspec_standard,
    B.pro_type,
    B.inspec_item
FROM 
    inspection_check A
JOIN 
    inspection_detail B
ON 
    A.prd_code = B.prd_code
WHERE A.prd_code=?`;


//입고검사 등록
const qiInsert =
`INSERT INTO `


// 결과
module.exports = {
    qualityRequest,
    qiInsert
};