//자재 service
const mariaDB = require('../database/mapper.js');

//자재 반환 조회
const returnMt = async ()=> {
    let list = await mariaDB.query('mt_fromProduction');
    return list;
};

//자재 품질검사 완료 조회
const orderMt = async () => {
    let list = await mariaDB.query('mt_fromOrder');
    return list;
};

//자재 입고 등록
const insertMtWrhous = async(wrhousingInfo) => {
    let result = await mariaDB.query('mt_wrhousingInsert', [
        wrhousingInfo.mtril_check_code,
        wrhousingInfo.mtril_name,
        wrhousingInfo.mtril_code,
        wrhousingInfo.mtril_qy,
        wrhousingInfo.wrhousng_se,
        wrhousingInfo.empl_no,
        wrhousingInfo.wrhousng_date
    ]);
    if( result.insertId != null){
        return 'success'; 
      }else{
        return 'fail';
      }
};

module.exports = {
    returnMt,
    orderMt,
    insertMtWrhous,

};
