// 품질검사요청 및 입고검사(모달창)

//품질입고검사
const inspec_prd = 
`SELECT  a.mtril_check_code
        ,a.prd_code
        ,a.order_no
        ,a.mtril_name
        ,a.rec_num
        ,a.test_date
        ,a.bcnc_code
        ,a.mtlty_name
        ,a.pass_amount
        ,b.inspec_standard
        ,b.inspec_item
FROM inspection_check a 
join inspection_detail b 
ON a.prd_code = b.prd_code
WHERE a.prd_code=?`;

//품질입고검사 등록
const inspecInsert = 
`INSERT INTO
VALUES=(?,?,?,?,?,?)`;

//합격량
const insecUpdate =
`UPDATE FROM
SET   
WHERE = ?`



// 결과
module.exports = {
    inspec_prd,
    inspecInsert,
    insecUpdate

    
};