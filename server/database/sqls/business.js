//영업 sql

const orderRequest = `
select order_no,
       order_date,
       dete,
       p_code,
       wrter
from order_requst`;

const orderRequestInsert = 
`INSERT INTO order_requst ( order_no, order_date, dete, p_code, wrter)
values (?, ?, ?, ?, '김기환')`;

const orderRequestListInsert = 
`INSERT INTO order_requst (prd_code, order_no, prd_name, untpc, order_qy, splpc, taxamt, smprice, process_status, prdctn_at)
values (?, ?, ?, ?, ?, ?, ?, ?, 'OD01', 'OP01')`;

module.exports = {
    orderRequest,
    orderRequestInsert,
    orderRequestListInsert
};



