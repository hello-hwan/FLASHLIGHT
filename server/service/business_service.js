//영업 service
const mariaDB = require('../database/mapper.js');

//전체 조회
const findAllOrderRequest = async ()=>{
    let list = await mariaDB.query('orderRequest');
    return list;
};

// 주문번호정렬
const findOrderArray = async ()=>{
    let list = await mariaDB.query('bs_orderArray');
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

// 거래처 검색
const searchCompanyModal = async(key)=>{
    let searchKey = [key.company_code, key.company_name, key.charger_name];
    let result = await mariaDB.query('bs_searchCompany',searchKey)
                                    .catch(err=>console.log(err));
    return result;
}

// 제품 검색
const searchProductModal = async(key)=>{
    let searchKey = [key.product_code, key.product_name];
    let result = await mariaDB.query('bs_searchProduct', searchKey)
                              .catch(err=>console.log(err));
    return result;
}

// 주문 수정 가능여부 체크
const modifyOrderListByNo = async (keywords)=>{
    let orderModify = await mariaDB.query('bs_modifyCheck',keywords);
    return orderModify;
}

const modifyOrderListByListNo = async (keywords)=>{
    let orderModify2 = await mariaDB.query('bs_modifyCheck_list', keywords);
    return orderModify2;
}

module.exports = {
    findAllOrderRequest,
    createNewOrderRequest,
    deleteOrderRequestByOrderNo,
    findOrderRequestByNo,
    searchCompanyModal,
    findOrderArray,
    searchProductModal,
    modifyOrderListByNo,
    modifyOrderListByListNo
};