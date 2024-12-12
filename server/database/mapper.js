const mariadb = require('mariadb/callback');  //마리아db callback 커넥터 모듈 불러오기
const sqlList = require('./sql.js');

//console.log(process.env); //서버 연결정보 확인

const connectionPool = mariadb.createPool({
  host : process.env.MYSQL_HOST,
  port : process.env.MYSQL_PORT,
  user : process.env.MYSQL_USER,
  password : process.env.MYSQL_PWD,
  database : process.env.MYSQL_DB,
  connectionLimit : process.env.MYSQL_LIMIT,

  trace: true,                        //log
  permitSetMultiParamEntries : true,  //parameter가 객체일 경우 escape작업 --> insert into set절을 사용가능함.
  insertIdAsNumber : true,            //insertId를 Number 타입으로 변환.
  bigIntAsNumber : true,              //bigInt 타입을 자동으로 Number타입으로 변환.
});

const query = (alias, values)=>{
  return new Promise((resolve, reject)=>{
    let executeSql = sqlList[alias];
    connectionPool.query(executeSql, values, (err, results)=>{
      if(err) {
        reject({err});
      }else{
        resolve(results);
      }
    });
  });
};

module.exports = {
  query,
}