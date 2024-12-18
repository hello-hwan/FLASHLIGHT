//영업 service
const mariaDB = require('../database/mapper.js');

//전체 조회
const findAllOrderRequest = async (keywords)=>{
    let sql = Object.keys(keywords).length == 0 ? 'orderRequest' : 'businessListWithKeyword';
    let list = await mariaDB.query(sql,keywords);
    return list;
};

// 등록
// 주문요청과 리스트 처리하는 프로시저로 연결
const createNewOrderRequest = async (orderRequestInfo)=>{
    let result = await mariaDB.query('',[
        orderRequestInfo.order_no, 
        orderRequestInfo.order_date, 
        orderRequestInfo.dete, 
        orderRequestInfo.p_code, 
        orderRequestInfo.wrter,
        orderRequestInfo.prd_code, 
        orderRequestInfo.untpc, 
        orderRequestInfo.order_qy
    ]);
    if( result.insertId != null){
        return {order_no : result.insertId};
    }else{
        return{};
    }
}

/*
// 주문요청
const createNewOrderRequest = async (orderRequestInfo)=>{
    let result = await mariaDB.query('orderRequestInsert', [
        orderRequestInfo.order_no,
        orderRequestInfo.order_date,
        orderRequestInfo.dete,
        orderRequestInfo.p_code,
        orderRequestInfo.wrter
    ]);
    if ( result.insertId != null){
        return { order_no : result.insertId };
    } else {
        return {};
    }
}

// 주문요청 리스트
const createNewOrderList = async (orderListInfo)=>{
    let result = await mariaDB.query('orderListInsert',[
        orderListInfo.prd_code,
        orderListInfo.order_no,
        orderListInfo.prd_name,
        orderListInfo.untpc,
        orderListInfo.order_qy,
        orderListInfo.splpc,
        orderListInfo.taxamt,
        orderListInfo.process_status,
        orderListInfo.prdctn_at
    ]);
    if ( result.insertId != null){
        return { order_no : result.insertId };
    } else {
        return {};
    }
};
*/
module.exports = {
    findAllOrderRequest,
    createNewOrderRequest
};

