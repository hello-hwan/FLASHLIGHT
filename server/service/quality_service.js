//품질 service
const mariaDB = require('../database/mapper.js');
    
//품질검사요청
const qualityRequest = async (prd_code) => {
    let list = await mariaDB.query('qualityRequest',prd_code)
    return list;
}

module.exports = {
    qualityRequest
};