//영업 service
const mariaDB = require('../database/mapper.js');

//전체 조회
const findAllOrderRequest = async (keywords)=>{
    let sql = Object.keys(keywords).length == 0 ? 'orderRequest' : 'businessListWithKeyword';
    let list = await mariaDB.query(sql,keywords);
    return list;
};

// 등록
// 주문요청
const createNewOrderRequest = async (orderRequestInfo)=>{
    let result = await mariaDB.query('orderRequestInsert', orderRequestInfo);
    if ( result.insertId != null){
        return { order_no : result.insertId };
    } else {
        return {};
    }
}

// 주문요청 리스트
const createNewOrderRequestList = async (orderRequestListInfo)=>{
    let result = await mariaDB.query('orderRequestListInsert',orderRequestListInfo);
    if ( result.insertId != null){
        return { order_no : result.insertId };
    } else {
        return {};
    }
};



module.exports = {
    findAllOrderRequest,
    createNewOrderRequest,
    createNewOrderRequestList
};

