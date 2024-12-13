//생산 service
const mariaDB = require('../database/mapper.js');

const findcmmn = async () => {
  let list = await mariaDB.query('pr_selcmmn');
  return list;
};

const searchflowchart = async (prod_code) => {
  let list = await mariaDB.query('pr_selflowchart', prod_code)
  return list;
}

module.exports = { 
  findcmmn,
  searchflowchart,

};