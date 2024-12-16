//생산 service
const mariaDB = require('../database/mapper.js');

const findcmmn = async () => {
  let list = await mariaDB.query('pr_selcmmn');
  return list;
};

const searchflowchart = async (prod_code) => {
  let list = await mariaDB.query('pr_selflowchart', prod_code);
  return list;
};

const searchorder = async () => {
  let list = await mariaDB.query('pr_selorder')
  return list;
};

const searchtime = async (prod_code) => {
  let list = await mariaDB.query('pr_selsumtime', prod_code);
  return list;
};

const searchuseqy = async (prod_code) => {
  let list = await mariaDB.query('pr_selsumqy', prod_code);
  return list;  
}


module.exports = { 
  findcmmn,
  searchflowchart,
  searchorder,
  searchtime,
  searchuseqy,

};