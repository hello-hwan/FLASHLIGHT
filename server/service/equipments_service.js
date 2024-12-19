//설비 service
const mariaDB = require('../database/mapper.js');

//설비 상태 조회
const eqp_list = async () => {
    let list = await mariaDB.query('eqp_list');
    return list;
}

// 설비 상태 조회 2
const eqp_list_prod = async (eqp_code) => {
    let list = await mariaDB.query('eqp_list_prod', eqp_code);
    return list[0];
}

module.exports = {
    eqp_list, 
    eqp_list_prod
};