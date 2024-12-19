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
        wrhousingInfo.wrhousng_date,
        wrhousingInfo.mtril_lot
    ]);
    if( result.insertId != null){
        return 'success'; 
    }else{
        return 'fail';
    };
};

//출고 요청명 별 리스트 조회
const requestList = async() => {
    let list = await mariaDB.query('mt_requestList');
    return list;
}

//출고 요청명별 자재 리스트 조회
const requestMt = async(reqCode) => {
    //요청 리스트 가져오기
    let reqMtList = await mariaDB.query('mt_requestDetails', reqCode);
    console.log(reqMtList); //확인
    
    //새로운 데이터를 담을 배열 선언(객체들의 배열이 됨)
    let dataList = [];

    //자재코드를 가져오기 위한 for문
    for(let i=0; i<reqMtList.length; i++) {
        //자재코드로 검색한 로트, 재고수
        let lotListEachMt = await mariaDB.query('mt_lotInvenList', reqMtList[i].mt_code); 
        console.log('로트',lotListEachMt); 
        for(let j=0; j<lotListEachMt.length; j++) {
 
            //로트 수량
            let lotQy = lotListEachMt[j].mtril_qy;

            //데이터를 담을 새로운 객체 선언
            let newObj = {
                req_name : reqMtList[i].req_name,   //요청명
                req_code : reqMtList[i].req_code,   //요청코드
                mt_code : reqMtList[i].mt_code,     //자재코드
                mt_name : reqMtList[i].mt_name,     //자재명
                req_qy : reqMtList[i].qy,           //요청수량
                lot : lotListEachMt[j].mtril_lot,   //로트
                lot_qy : (reqMtList[i].qy - lotQy) < 0 ? (lotQy - Math.abs(reqMtList[i].qy- lotQy)) : lotQy, //로트 수량
                unit : reqMtList[i].unit            //단위
            };
            console.log('새로운 객체 출력');
            console.log(newObj);-
            //배열에 데이터 담기
            dataList.push(newObj);

            //자재 수량에서 로트수량을 뺐을때 0보다 작으면 해당 자재에는 출고수량을 채웠다는 의미
            if((reqMtList[i].qy - lotListEachMt[j].mtril_qy) < 0) {
                break;
            }
        }

    }
    console.log(dataList);
    return dataList;
}

//출고 등록 후 처리 여부 업데이트
const dlivyMt = async(dlivyInfo) => {
    let result = await mariaDB.query('mt_requestCheckOut', [...dlivyInfo]);
    
    if( result.insertId != null){
        return 'success'; 
    }else{
    return 'fail';
    };
}
module.exports = {
    returnMt,
    orderMt,
    insertMtWrhous,
    requestList,
    requestMt,
    dlivyMt
};
