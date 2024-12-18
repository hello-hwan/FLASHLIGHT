//영업 sql

const orderRequest = `
SELECT r.order_no,
       b.mtlty_name,
       r.order_date,
       r.dete,
       l.prd_code,
       l.prd_name,
       l.order_qy,
       r.wrter,
       CASE WHEN l.process_status = 'OD01' THEN '처리중'
            ELSE '처리완료'
       END AS 'process_status',
       CASE WHEN l.prdctn_at = 'OP01' THEN '생산'
            ELSE '미생산'
       END AS 'prdctn_at'
FROM order_requst r LEFT OUTER JOIN order_lists l ON r.order_no = l.order_no LEFT OUTER JOIN bcnc b ON r.p_code=b.bcnc_code`;

const orderRequestInsert = `
CALL p_insert_order_info(?, ?, ?, ?, ?, ?, ?, ?)`;
/*
const orderRequestInsert = 
`INSERT INTO order_requst ( order_no, order_date, dete, p_code, wrter)
values (?, ?, ?, ?, '김기환')`;

const orderListInsert = 
`INSERT INTO order_requst (prd_code, order_no, prd_name, untpc, order_qy, splpc, taxamt, smprice, process_status, prdctn_at)
values (?, ?, ?, ?, ?, ?, ?, ?, 'OD01', 'OP01')`;
*/
module.exports = {
    orderRequest,
    orderRequestInsert
};



