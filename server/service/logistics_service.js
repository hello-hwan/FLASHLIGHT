//물류 service
const mariaDB = require('../database/mapper.js');

// 반제품 입고 리스트 
const prdctn_n_list = async() => {
  let list = await mariaDB.query('prdctn_n_list');
  return list;
}

// 반제품 반환 입고 리스트
const prdctn_n_return_list = async() => {
  let list = await mariaDB.query('prdctn_n_return_list');
  return list;
}

// 반제품 입고 등록
const prduct_n_wrhousng = async(data) => {
 // console.log('service',data);
  try{
    let result = await mariaDB.query('prduct_n_wrhousng', data);
    if (result.insertId != null){
      return { message: '등록성공' }; 
    }else {
      return { message: '등록실패' };
    }
  }catch(err){
    console.log(err);
  }
} 

// 반제품 반환 입고 등록
const prduct_n_wrhousngReturn = async(data) => {
  try{
    let result = await mariaDB.query('prduct_n_wrhousngReturn', data);
    if (result.insertId != null){
      return { message: '등록성공' }; 
    }else {
      return { message: '등록실패' };
    }
  }catch(err){
    console.log(err);
  }
}

// 반제품 반환 등록 후 반제품 출고 테이블 업데이트
const prduct_n_dlivyReturn = async(lot) => {
  console.log(lot);
  let result = await mariaDB.query('prduct_n_dlivyReturn', lot)
                            .catch(err => console.log(err));
  return result;
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

// 반제품 출고 상세 리스트
const prductNDlivyListInfo = async(code) => {
  let list = await mariaDB.query('prductNDlivyListInfo',code);
  return list;
}

// 반제품 출고 나가야될  제품
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

      //console.log(sumLotQy);

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
      //console.log(reqQy);
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
  let resultSum = 0;
  console.log('service',prdctnNInfo);
  for(let i=0; i<prdctnNInfo.length; i++) {
    let dataArr = [ prdctnNInfo[i].prd_nm,        
                    prdctnNInfo[i].prd_code,      
                    prdctnNInfo[i].lot_qy,        
                    prdctnNInfo[i].empl_no,            
                    prdctnNInfo[i].lot,        
                    prdctnNInfo[i].req_code,        
                    prdctnNInfo[i].prdctn_code,
                    prdctnNInfo[i].req_name ];
                    console.log('dataArr',dataArr);
          let result = await mariaDB.query('prduct_n_dlivyTest', dataArr)
                                    .catch(err => console.log(err));
          //성공하면 1을 리턴, 실패하면 0을 리턴
          console.log("결과",result);
          resultSum += result;
      };
       
      //성공한 수의 총합과 등록하는 데이터의 개수를 비교, 같으면 성공, 다르면 실패.
      if(resultSum = prdctnNInfo.length) {
          return 'success';
      } else {
          return 'fail';
      }
}


// 반제품 입고 리스트 
const prduct_n_dlivyList = async() => {
  let list = await mariaDB.query('prduct_n_dlivyList');
  return list;
}


// 완제품 입고대기 리스트(일반)
const prductList = async() => {
  try {
    let list =await mariaDB.query('prductList');
    return list;  
  } catch (error) {
    console.log('service', error);
  }
  
}

// 완제품 입고 등록
const prductWrhousng = async(data) => {
  console.log('service',data);
  try{
    let result = await mariaDB.query('prductWrhousng', data);
    if (result.insertId != null){
      return { message: '등록성공' }; 
    }else {
      return { message: '등록실패' };
    }
  }catch(err){
    console.log(err);
  }
}

// 완제품 입고완료 리스트
const prductWrhousngList = async(data) => {
  let list = await mariaDB.query('prductWrhousngList');
  return list;
}

// 완제품 출고 나가야될 제품 리스트
const prduct_possible_dlivy = async(code) => {
  let list = await mariaDB.query('prduct_possible_dlivy', code);
  console.log(list);
  let dataList = [];
  for(let i = 0; i < list.length; i++){
    let prductLOT = await mariaDB.query('prduct_qy', list[i].prd_code)
                                  .catch(err => console.log(err));

    let roopCnt = prductLOT.length == 0 ? 1 : prductLOT.length;
    let reqQy = list[i].order_qy;
    let sumLotQy = 0;

    for(let j = 0; j < roopCnt; j++){
      let lotQy = prductLOT.length <= 0 ? 0 : prductLOT[j].prduct_invntry_qy;
      let lotName = prductLOT.length <= 0 ? '재고없음' : prductLOT[j].prduct_lot;

      sumLotQy += lotQy;

      console.log(sumLotQy);

      if(j == (prductLOT.length -1 ) && sumLotQy < list[i].qy){
        lotName = '재고부족';
      };

      let newObj = {
        order_no: list[i].order_no,
        order_list_no: list[i].order_list_no,
        prd_name: list[i].prd_name,
        prd_code: list[i].prd_code,
        order_qy: list[i].order_qy,
        lot : lotName,
        lot_qy: (reqQy - lotQy) < 0 ? lotQy - Math.abs(reqQy - lotQy) : lotQy,
        req_de : list[i].req_de,
      };

      reqQy -= lotQy;
      console.log(reqQy);
      dataList.push(newObj);
      if(reqQy <= 0){
        break;
      };

    }
  }
  return dataList;
}


// 완제품 출고 요청 리스트 
const prduct_possible = async() => {
  let list = await mariaDB.query('prduct_possible');
  return list;
}

// 완제품 출고 등록 및 주문서테이블,완제품입고테이블 업데이트
const prduct_dliy_process = async(prdctnInfo) => {
  let resultSum = 0;
  console.log('service', prdctnInfo);
  for(let i = 0; i < prdctnInfo.length; i++){
    let dataArr = [ prdctnInfo[i].lot_qy,
                    prdctnInfo[i].lot,
                    prdctnInfo[i].dlivy_charger,
                    prdctnInfo[i].order_list_no,
                    prdctnInfo[i].prd_code];
                  console.log(dataArr);
    let result = await mariaDB.query('prduct_dliy_process', dataArr)
                              .catch(err => console.log(err));
        console.log(result);
        resultSum += result;
       //성공한 수의 총합과 등록하는 데이터의 개수를 비교, 같으면 성공, 다르면 실패.
    if(resultSum = prdctnInfo.length) {
        return 'success';
    } else {
        return 'fail';
    }
  }
}

// 완제품 출고 완료 요청 리스트
const prduct_dlivyList = async() => {
  let list = await mariaDB.query('prduct_dlivyList');
  return list;
}

// 완제품 출고 완료 상세 리스트
const prductDlivyListInfo = async(code) => {
  let list = await mariaDB.query('prductDlivyListInfo', code);
  return list;
}

module.exports = {
  prdctn_n_list,
  prduct_n_wrhousng,
  prdctNList,
  prduct_n_dlivy,
  prduct_n_possible,
  prduct_n_dlivyTest, 
  prduct_n_dlivyList,
  prductList,
  prductNDlivyListInfo,
  prductWrhousng,
  prductWrhousngList,
  prduct_possible,
  prduct_possible_dlivy,
  prduct_dliy_process,
  prduct_dlivyList,
  prductDlivyListInfo,
  prdctn_n_return_list,
  prduct_n_wrhousngReturn,
  prduct_n_dlivyReturn
};  