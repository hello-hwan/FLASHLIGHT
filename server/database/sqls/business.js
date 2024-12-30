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
FROM order_requst r LEFT OUTER JOIN order_lists l ON r.order_no = l.order_no LEFT OUTER JOIN bcnc b ON r.p_code=b.bcnc_code
ORDER BY 1 DESC`;

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

const orderRequestDetail = `
SELECT r.order_no, 
       r.p_code, 
       TO_CHAR(r.order_date,'yyyy-MM-dd') as order_date, 
       TO_CHAR(r.dete,'yyyy-MM-dd') as dete, 
       r.wrter, 
       l.order_list_no, 
       l.prd_code, 
       l.untpc, 
       l.order_qy 
FROM order_requst r LEFT OUTER JOIN order_lists l
                       ON r.order_no = l.order_no
WHERE UPPER( r.order_no ) =UPPER( ? )`;

const orderRequestDelete = `
CALL p_delete_order_info(?)`;

const bs_searchCompany =`
SELECT bcnc_code,
       mtlty_name,
       charger_name
FROM bcnc
WHERE bcnc_code LIKE CONCAT('%', IFNULL(?, bcnc_code), '%')
AND mtlty_name LIKE CONCAT('%', IFNULL(?, mtlty_name), '%')
AND charger_name LIKE CONCAT('%', IFNULL(?, charger_name), '%')`

const bs_orderArray = `
SELECT order_no
FROM order_requst
`

module.exports = {
    orderRequest,
    orderRequestInsert,
    orderRequestDetail,
    orderRequestDelete,
    bs_searchCompany,
    bs_orderArray
};



