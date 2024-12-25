//물류 service
const mariaDB = require('../database/mapper.js');

// 반제품 입고 리스트 
const prdctn_n_list = async() => {
  let list = await mariaDB.query('prdctn_n_list');
  return list;
}

// 반제품 등록
const prduct_n_wrhousng = async(data) => {
  let result = await mariaDB.query('prduct_n_wrhousng', data);
  if (result.insertId != null){
    return { message: '등록성공' }; 
  }else {
    return { message: '등록실패' };
  }
} 
 
// 반제품 입고 완료 리스트
const prdctNList = async() => {
  let list = await mariaDB.query('prduct_n_wrhousngList');
  return list;
}

// 반제품 출고 리스트
const prduct_n_dlivy = async() => { 
  let list = await mariaDB.query('prduct_n_dlivy');
  return list;
}

// 반제품 출고가능 제품
const prduct_n_possible = async(prdCode) => {
  let list = await mariaDB.query('prduct_n_possible', prdCode);
  //console.log('list',list);
  let dataList = [];
  for(let i = 0; i < list.length; i++){
    let prductNLOT = await mariaDB.query('prduct_n_qy', list[i].prd_code)
                                      .catch(err => console.log(err));
    
    let roopCnt = prductNLOT.length == 0 ? 1 : prductNLOT.length;

    let reqQy = list[i].req_qy;

    let sumLotQy = 0;


    for(let j = 0; j < roopCnt; j++){
      
      let lotQy = prductNLOT.length <= 0 ? 0 : prductNLOT[j].prduct_n_invntry_qy;

      let lotName = prductNLOT.length <= 0 ? '재고없음' : prductNLOT[j].prduct_n_lot;

      sumLotQy += lotQy;

      if(j == (prductNLOT.length-1) && sumLotQy < list[i].qy){
        lotName = '재고 부족';
      };
      
      let newObj = {
        req_name: list[i].req_name,
        req_code: list[i].req_code,
        prd_nm: list[i].prd_nm,
        prd_code: list[i].prd_code,
        req_qy: list[i].req_qy,
        lot : lotName,
        lot_qy : (reqQy - lotQy) < 0 ? lotQy - Math.abs(reqQy - lotQy) : lotQy,
        req_de : list[i].req_de,
        prdctn_code: list[i].prdctn_code
      };
      reqQy -= lotQy;
      
      dataList.push(newObj);
      if(reqQy <= 0) {
        break;
      };  
      
    }
    
  }
  return dataList;

}

// 반제품 출고완료처리
const prduct_n_dlivyTest = async(prdctnNInfo) => {
  //let resultSum = 0;
  //console.log('service',prdctnNInfo);
  for(let i=0; i<prdctnNInfo.length; i++) {
    let dataArr = [ prdctnNInfo[i].prd_nm,        
                    prdctnNInfo[i].prd_code,      
                    prdctnNInfo[i].req_qy,      
                    'MU01',        
                    prdctnNInfo[i].req_de,      
                    prdctnNInfo[i].lot,        
                    prdctnNInfo[i].req_code,        
                    prdctnNInfo[i].empl_no, 
                    prdctnNInfo[i].req_name ];
          console.log('dataArr', dataArr);
          // let result = await mariaDB.query('prduct_n_dlivyTest', dataArr)
          //                           .catch(err => console.log(err));
          //성공하면 1을 리턴, 실패하면 0을 리턴
          //console.log(result);
          //resultSum += result;
      };
  
      //성공한 수의 총합과 등록하는 데이터의 개수를 비교, 같으면 성공, 다르면 실패.
      if(resultSum = prdctnNInfo.length) {
          return 'success';
      } else {
          return 'fail';
      }
}



module.exports = {
  prdctn_n_list,
  prduct_n_wrhousng,
  prdctNList,
  prduct_n_dlivy,
  prduct_n_possible,
  prduct_n_dlivyTest
};