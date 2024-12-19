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

    //새로운 데이터를 담을 배열 선언(객체들의 배열이 됨)
    let dataList = [];

    //참일 경우 로트에 재고가 충분한 경우.
    let tableGetReady = true;

    //자재코드를 가져오기 위한 for문
    for(let i=0; i<reqMtList.length; i++) {
        //자재코드로 검색한 로트, 재고수
        let lotListEachMt = await mariaDB.query('mt_lotInvenList', reqMtList[i].mt_code); 
        
        //요청수량
        let reqQy = reqMtList[i].qy;

        //로트 수량 총합
        let sumLotQy = 0;

        for(let j=0; j<lotListEachMt.length; j++) {
            //로트 수량
            let lotQy = lotListEachMt[j].mtril_qy;
            //로트별 수량 확인
            //console.log(reqMtList[i].mt_name, lotListEachMt[j].mtril_lot, lotListEachMt[j].mtril_qy);

            //요청 수량
            //console.log('요청수량', reqMtList[i].qy);

            //기본 로트 수량
            //console.log('번경전', lotListEachMt[j].mtril_qy);

            //절대값 변경
            //console.log('변경값', (lotQy - Math.abs(reqQy - lotQy)));
            //로트 수량 총 합 구하기
            sumLotQy += lotListEachMt[j].mtril_qy;

            //데이터를 담을 새로운 객체 선언
            let newObj = {
                req_name : reqMtList[i].req_name,   //요청명
                req_code : reqMtList[i].req_code,   //요청코드
                mt_code : reqMtList[i].mt_code,     //자재코드
                mt_name : reqMtList[i].mt_name,     //자재명
                req_qy : reqMtList[i].qy,           //요청수량
                lot : lotListEachMt[j].mtril_lot,   //로트
                lot_qy : (reqQy - lotQy) < 0 ? (lotQy - Math.abs(reqQy - lotQy)) : lotQy, //로트 수량
                unit : reqMtList[i].unit,            //단위
                prdctn_code : reqMtList[i].prdctn_code
            };
            //요청 수량에서 재고 수량 빼기
            reqQy -= lotQy;
            
            //배열에 데이터 담기
            dataList.push(newObj);

            //자재 수량에서 로트수량을 뺐을때 0보다 작으면 해당 자재에는 출고수량을 채웠다는 의미
            if(reqQy <= 0) {
                break;
            };
        }

        //요청 수량이 재고 수량의 총 합보다 많을 경우 tableGetReady를 false로 만들어 return에서 임의의 값을 리턴하게 만듦
        if (reqMtList[i].qy > sumLotQy) {
            tableGetReady = false;
        };
    }
    //확인  
    console.log(dataList);

    if(tableGetReady) {
        //재고가 충분한 경우
        dataList.push({state : 'success'});
        return dataList;
    } else {
        //어느 하나라도 자재의 재고가 부족한 경우
        dataList.push({state : 'fail'});
        return dataList;
    };
}

//출고 등록 + 처리 여부 업데이트 + 로트 수량 빼기
const dlivyMt = async(dlivyInfo) => {
    console.log(dlivyInfo);
    let resultSum = 0;

    for(let i=0; i<dlivyInfo.length; i++) {
        let dataArr = [ dlivyInfo[i].lot,
                        dlivyInfo[i].req_code,
                        dlivyInfo[i].req_name,
                        dlivyInfo[i].mt_name,
                        dlivyInfo[i].mt_code,
                        dlivyInfo[i].req_qy,
                        dlivyInfo[i].lot_qy,
                        dlivyInfo[i].empl_no,
                        dlivyInfo[i].prdcnt_code
                    ];
        let result = await mariaDB.query('mt_requestCheckOut', dataArr);    
        //성공하면 1을 리턴, 실패하면 0을 리턴
        resultSum += result;
    };

    //성공한 수의 총합과 등록하는 데이터의 개수를 비교, 같으면 성공, 다르면 실패.
    if(resultSum = dlivyInfo.length) {
        return 'success';
    } else {
        return 'fail';
    }
}
module.exports = {
    returnMt,
    orderMt,
    insertMtWrhous,
    requestList,
    requestMt,
    dlivyMt
};
