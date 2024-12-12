//기준정보 router
const mariaDB = require('../database/mapper.js');

const cmmntest = async ()=>{
  let list = await mariaDB.query('cmmn');
  return list;
}

module.exports = {
  cmmntest
};