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
const quailtyInsert = async (order_info ) =>{
    console.log(order_info.inspect);
    let result = await mariaDB.query('quailtyInsert', order_info.inspect).catch(err => console.log(err));

   
    for(let i=0; i<order_info.check.length; i++){
        let listdata = [order_info.inspect[2],
        order_info.check[i].inspec_standard,
        order_info.check[i].inspec_item,
        order_info.check[i].p_result,
        parseInt(order_info.check[i].error_amount),
        order_info.inspect[0]]
    let result2= await mariaDB.query('quailtyInsert2',listdata).catch(err => console.log(err));

    }



    /*
    if( result.insertId > 0){
        return { quailty_no : result.insertId};
    }else{
        return {};
    }
    */
}



module.exports = {
    order_request,
    inspec_item,
    quailtyInsert

};
