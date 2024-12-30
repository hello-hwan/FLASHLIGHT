//자재 service
const mariaDB = require('../database/mapper.js');

//자재 반환 조회
const returnMt = async ()=> {
    let list = await mariaDB.query('mt_fromProduction')
                            .catch(err=> console.log(err));
    return list;
};

//자재 품질검사 완료 조회
const orderMt = async () => {
    let list = await mariaDB.query('mt_fromOrder')
                            .catch(err=>console.log(err));
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
    ]).catch(err=>console.log(err));
    /*
    console.log('배열 값 확인: ', [
        wrhousingInfo.mtril_check_code,
        wrhousingInfo.mtril_name,
        wrhousingInfo.mtril_code,
        wrhousingInfo.mtril_qy,
        wrhousingInfo.wrhousng_se,
        wrhousingInfo.empl_no,
        wrhousingInfo.wrhousng_date,
        wrhousingInfo.mtril_lot
    ]); */

    if( result == 1){
        return result; 
    }else{
        return result;
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

        let lotListEachMt = await mariaDB.query('mt_lotInvenList', reqMtList[i].mt_code) 
                                         .catch(err=>console.log(err));

        //반복 획수, 검색 결과가 0일때를 위한 임시변수 선언
        let roopCnt = lotListEachMt.length == 0 ? 1 : lotListEachMt.length;
        // if(lotListEachMt.length == 0) {
        //     console.log('0이 넘어옴', 
        //         'lotListEachMt: ', lotListEachMt, 
        //         'length: ', lotListEachMt.length,
        //         );
        // }                      
        //요청수량
        let reqQy = reqMtList[i].qy;

        //로트 수량 총합
        let sumLotQy = 0;
        
        for(let j=0; j<roopCnt; j++) {

            //로트 수량
            let lotQy = lotListEachMt.length <= 0 ? 0 : lotListEachMt[j].mtril_qy;
            
            //로트 이름
            let lotName = lotListEachMt.length <= 0 ? '재고 없음' : lotListEachMt[j].mtril_lot;
            //로트별 수량 확인
            //console.log(reqMtList[i].mt_name, lotListEachMt[j].mtril_lot, lotListEachMt[j].mtril_qy);

            //요청 수량
            //console.log('요청수량', reqMtList[i].qy);

            //기본 로트 수량
            //console.log('번경전', lotListEachMt[j].mtril_qy);

            //절대값 변경
            //console.log('변경값', (lotQy - Math.abs(reqQy - lotQy)));
            //로트 수량 총 합 구하기
            sumLotQy += lotQy;
            if(j== (lotListEachMt.length-1) && sumLotQy < reqMtList[i].qy) {
                //재고가 부족한 경우 부족한 자재를 사용자가 확인하게 하기 위해서 로트명을 임의의 문자열로 설정
                lotName = '재고 부족';
            };
            //데이터를 담을 새로운 객체 선언
            let newObj = {
                req_name : reqMtList[i].req_name,   //요청명
                req_code : reqMtList[i].req_code,   //요청코드
                mt_code : reqMtList[i].mt_code,     //자재코드
                mt_name : reqMtList[i].mt_name,     //자재명
                req_qy : reqMtList[i].qy,           //요청수량
                lot : lotName,   //로트
                lot_qy : (reqQy - lotQy) < 0 ? lotQy - Math.abs(reqQy - lotQy) : lotQy, //로트 수량
                unit : reqMtList[i].unit,            //단위
                prdctn_code : reqMtList[i].prdctn_code
            };
            //요청 수량에서 재고 수량 빼기
            reqQy -= lotQy;
            console.log('버튼 클릭후 새로만들어지는 obj', newObj);
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
    //console.log(dataList);

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
    //console.log("dlivyInfo: ", dlivyInfo);
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
                        dlivyInfo[i].prdctn_code
                    ];
        console.log('dataArr', dataArr);
        let result = await mariaDB.query('mt_requestCheckOut', dataArr)
                                  .catch(err => console.log(err));
        //성공하면 1을 리턴, 실패하면 0을 리턴
        //console.log(result);
        resultSum += result;
    };

    //성공한 수의 총합과 등록하는 데이터의 개수를 비교, 같으면 성공, 다르면 실패.
    if(resultSum = dlivyInfo.length) {
        return 'success';
    } else {
        return 'fail';
    }
};

//발주 관리 - 자재 발주 요청건 가져오기
const reqMtOrderList = async() => {
    let result = await mariaDB.query('mt_prRequestList')
                              .catch(err => console.log(err));
    return result;
};

//발주관리 - 발주건 검색
const mtOrderList = async(searchInfo) => {
    //발주명, 거래처명, 주문날짜1, 2, 납기일1, 2, 사원번호
    let infoArr = [searchInfo.order_name,
                    searchInfo.mtlty_name,
                    searchInfo.start_order,
                    searchInfo.end_order,
                    searchInfo.start_dedt,
                    searchInfo.end_dedt,
                    searchInfo.emp_id];

    let result = await mariaDB.query('mt_searchOrderWithKey', infoArr)
                              .catch(err=>console.log(err));

    return result;
};

//발주건 자재 리스트
const mtListOnOrder = async(orderCode) => {
    let result = await mariaDB.query('mt_listOnOrder', orderCode)
                              .catch(err=>console.log(err));
    console.log('결과',result);
    return result;
};

//발주 자재 입력
const insertMtToOrder = async(orderMtList) => {
    //insertId를 담을 변수
    let key = '';

    //리턴할 결과를 더할 변수 선언
    let resultCnt = 0;

    for(let i=0; i<orderMtList.length; i++) {
        //값이 없이 넘어오는게 있음. 구별하기 쉽게 none으로 임의 설정 프로시저 내에서 처리함.
        orderMtRowData = [
            orderMtList[i].dedt,
            orderMtList[i].emp_id,
            orderMtList[i].mt_code,
            orderMtList[i].mt_name,
            orderMtList[i].order_date,
            orderMtList[i].order_qy,
            orderMtList[i].req_code == '' ? 'none': orderMtList[i].req_code,
            orderMtList[i].company_code,
            orderMtList[i].order_name,
            orderMtList[i].company_name,
            orderMtList[i].price,
            key == '' ? 'none': key
        ];

        let queryResult = await mariaDB.query('mt_orderInsert', orderMtRowData)
                                  .catch(err=>console.log(err));
        console.log('쿼리 결과:', queryResult);

        
        //결과에서 인서트 아이디를 가지고 옴.
        if(key == "") {
            key = queryResult[0][0].id;
        };
        console.log('출력: ', queryResult);
        console.log('선택: ', queryResult[0][0].result);
        //결과가 1이면 성공 그 값을 모두 더함.
        resultCnt += queryResult[0][0].result;
    };
    console.log('쿼리결과: ',resultCnt);
    console.log('넘어온 데이터 길이: ', orderMtList.length);
    //결과로 돌아온 값의 합과 입력할 행의 수와 같으면 success리턴
    if(resultCnt == orderMtList.length) {
        return 'success';
    } else {
        return 'fail';
    };
    
};

//발주건 삭제
const mtOrderDelete = async(orderCode) => {
    let result = await mariaDB.query('mt_orderDelete', orderCode)
                              .catch(err=>console.log(err));
    console.log('결과',result);
    return result;
};

//발주건 수정
const mtOrderModify = async(modifyInfo) => {
    console.log('넘어온 데이터', modifyInfo);
    //order_code를 담을 변수 state가 insert인 경우 order_code가 공백임.
    let order_code = "";

    //order_code를 담기위해 for문 실행
    for(let i=0; i<modifyInfo.length; i++) {
        if(modifyInfo[i].req_code != "") {
            //공백이 아닌 req_code
            order_code = modifyInfo[i].req_code;
            //변수를 담은 즉시 for문 종료
            break;
        };
    };
    //결과를 더할 결과를 담을 변수 
    let resultSum = 0;
    for(let i=0; i<modifyInfo.length; i++) {
        let orderInfo = [
            modifyInfo[i].order_no,
            modifyInfo[i].company_code,
            modifyInfo[i].company_name,
            modifyInfo[i].dedt,
            modifyInfo[i].emp_id,
            modifyInfo[i].mt_code,
            modifyInfo[i].mt_name,
            modifyInfo[i].order_date,
            modifyInfo[i].order_name,
            modifyInfo[i].order_qy,
            modifyInfo[i].price,
            modifyInfo[i].state,
            modifyInfo[i].unit,
            modifyInfo[i].order_code
            ];
        //console.log('만들어진 배열:', arr);
        
        let result = await mariaDB.query('mt_ordermodify', orderInfo).catch(err=>console.log(err));

        //console.log('결과: ', result);
        
        //나온 결과를 모두 더함.
        resultSum += result[0][0].result;
    };
    
    if (resultSum == modifyInfo.length) {
        console.log('1실행');
        return 'success';
        
    } else {
        console.log('2실행');
        return 'fail';
    };
};

//자재검색 모달 코드, 이름 담당자
const searchMtModal = async(key) => {
    //검색 조건을 저장할 배열
    let searchKey = [key.mtril_name, key.mtril_code];
    let result = await mariaDB.query('mt_searchMtList', searchKey)
                              .catch(err=>console.log(err));

    return result;
};

//회사 검색 모달
const searchCompanyModal = async(key) => {
    //검색 조건을 저장할 배열
    let searchKey = [key.company_code, key.company_name, key.charger_name];
    let result = await mariaDB.query('mt_searchCompany', searchKey)
                              .catch(err=>console.log(err));
    return result;
};

//자재 총 재고 조회
const allMtQy = async() => {
    let result = await mariaDB.query('mt_selectQy')
                              .catch(err=>console.log(err));
    return result;
};

//로트별 자재 재고 조회
const mtLotQy = async(key) => {
    //db에 보낼 새로운 배열 생성
    let searchKeyArr = [
        key.mt_lot == "" ? null: key.mt_lot,
        key.start_wrhousng_date == "" ? null: key.start_wrhousng_date,
        key.end_wrhousng_date == "" ? null: key.end_wrhousng_date,
        key.charger == "" ? null: key.charger,
        key.mtril_code
    ];

    let result = await mariaDB.query('mt_lotInven', searchKeyArr)
                              .catch(err=>console.log(err));
    return result;
}

//전체 주문 목록 조회
const allOrderList = async(key) => {
    //검색조건 배열
    let searchKeyArr = [key.order_name == "" ? null : key.order_name,
                        key.mtril_name == "" ? null : key.mtril_name,
                        key.company_name == "" ? null : key.company_name,
                        key.start_order_date == "" ? null : key.start_order_date,
                        key.end_order_date == "" ? null : key.end_order_date,
                        key.start_dedt == "" ? null : key.start_dedt,
                        key.end_dedt == "" ? null : key.end_dedt,
                        key.charger_name == "" ? null : key.charger_name];

    let result = await mariaDB.query('mt_selectAllOrderList', searchKeyArr)
                              .catch(err=>console.log(err));
    console.log('조회 결과: ', result);
    return result;
};

//자재 입고조회
const wrhousingList = async(key) => {
    let searchKeyArr = [key.mtrilName == "" ? null : key.mtril_name,
                        key.selected == "" ? null : key.selected,
                        key.charger_name == "" ? null : key.charger_name,
                        key.start_date == "" ? null : key.start_date,
                        key.end_date == "" ? null : key.end_date
    ];
    let result = await mariaDB.query('mt_wrhousngList', searchKeyArr)
                              .catch(err => console.log(err));

    return result;
};

//자재 출고 조회
const dlivyList = async(key) => {
    let searchKeyArr = [key.req_name == "" ? null : key.req_name,
                        key.mtril_name == "" ? null : key.mtril_name,
                        key.charger_name == "" ? null : key.charger_name,
                        key.start_date == "" ? null : key.start_date,
                        key.end_date == "" ? null : key.end_date
    ];
    let result = await mariaDB.query('mt_dlivyList', searchKeyArr)
                              .catch(err => console.log(err));

    return result;
};

module.exports = {
    returnMt,
    orderMt,
    insertMtWrhous,
    requestList,
    requestMt,
    dlivyMt,
    reqMtOrderList,
    mtOrderList,
    mtListOnOrder,
    insertMtToOrder,
    mtOrderDelete,
    mtOrderModify,
    searchMtModal,
    searchCompanyModal,
    allMtQy,
    mtLotQy,
    allOrderList,
    wrhousingList,
    dlivyList
};
