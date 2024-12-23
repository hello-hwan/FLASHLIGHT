//영업 service
const mariaDB = require('../database/mapper.js');

//전체 조회
const findAllOrderRequest = async ()=>{
    let list = await mariaDB.query('orderRequest');
    return list;
};

// 등록
// 주문요청과 리스트 처리하는 프로시저로 연결
const createNewOrderRequest = async (orderRequestInfo)=>{
    let result = await mariaDB.query('orderRequestInsert',[
        orderRequestInfo.order_no, 
        orderRequestInfo.order_date, 
        orderRequestInfo.dete, 
        orderRequestInfo.p_code, 
        orderRequestInfo.wrter,
        orderRequestInfo.order_list_no,
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

// 상세조회
const findOrderRequestByNo = async (keywords)=>{
    let orderInfo = await mariaDB.query('orderRequestDetail',keywords);
    return orderInfo;
};

// 삭제
const deleteOrderRequestByOrderNo = async (keywords)=>{
    await mariaDB.query('orderRequestDelete',keywords);
};

module.exports = {
    findAllOrderRequest,
    createNewOrderRequest,
    deleteOrderRequestByOrderNo,
    findOrderRequestByNo
};

