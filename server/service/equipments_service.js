//설비 service
const mariaDB = require('../database/mapper.js');

const eqp_list = async () => {
    let list = await mariaDB.query('eqp_list');
    return list;
}

const eqp_list_prod = async (eqp_code) => {
    let list = await mariaDB.query('eqp_list_prod', eqp_code);
    return list[0];
}

const time_sample = async (eqp_code) => {
    let list = await mariaDB.query('time_sample', eqp_code);
    return list[0];
}

module.exports = {
    eqp_list, 
    eqp_list_prod, 
    time_sample
};