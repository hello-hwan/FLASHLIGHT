//설비 service
const mariaDB = require('../database/mapper.js');

const test_sql = async (keywords)=>{
    let list = await mariaDB.query('sample_sql',keywords);
    return list;
  }

module.exports = {
    test_sql
};