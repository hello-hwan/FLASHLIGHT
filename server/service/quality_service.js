//품질 service
const mariaDB = require('../database/mapper.js');
    
//발주요청
const order_request = async (order_no) => {
    let list = await mariaDB.query('order_request',order_no)
    return list[0]; //한 제품만 조회할 때 사용
}

//검사요청
const inspec_item = async (prd_code) => {
    let list = await mariaDB.query('inspec_item',prd_code)
    return list;
}

// 등록
const quailtyInsert = async (order_request ) =>{
    let result = await mariaDB.query('quailtyInsert', order_request);
    if( result.insertId > 0){
        return { quailty_no : result.insertId};
    }else{
        return {};
    }
}
module.exports = {
    order_request,
    inspec_item,
    quailtyInsert
};
