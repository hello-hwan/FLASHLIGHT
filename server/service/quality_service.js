//품질 service
const mariaDB = require('../database/mapper.js');
    
//품질입고검사
const inspec_prd = async (prd_code) => {
    let list = await mariaDB.query('inspec_prd',prd_code)
    return list;
}

//품질입고검사등록
const inspecInsert = async (Insert)=>{
    await mariaDB.query('inspecInsert', Insert);
}

module.exports = {
    inspec_prd,
    inspecInsert
};
