//품질 service
const mariaDB = require('../database/mapper.js');
    
//발주요청 리스트
const mtrilOrderList = async (key) => {
    //검색 데이터 ifnull에 공백이 들어가면 하나의 문자열로 인식해서 모두 검색되지 않음. 공백일경우 null로 변경
    let infoArr = [ key.order_name == "" ? null : key.order_name,
        key.mtlty_name == "" ? null : key.mtlty_name,
        key.start_order == "" ? null : key.start_order,
        key.end_order == "" ? null : key.end_order,
        key.start_dedt == "" ? null : key.start_dedt,
        key.end_dedt == "" ? null : key.end_dedt,
        key.emp_name == "" ? null : key.emp_name];

    let list = await mariaDB.query('mtrilOrderList', infoArr)
                            .catch(err => console.log(err));

    return list;
};

//발주건 자재 목록 가져오기
const mtrilList = async(key) => {
    let infoList = await mariaDB.query('mtrilList', key)
                                .catch(err=>console.log(err));
    return infoList;
};

//발주 등록
const insertResult = async(key) => {
    console.log('------------------------', key);

    //tableSeq[0].mtril_check_code ==> primary key
    let resultSum = 0;
    for(let i=0; i<key.length; i++) {
        //검사 체크 코드 가져오기
        let tableSeq = await mariaDB.query('getSequence')
        .catch(err=>console.log(err));

        //inspection_check 테이블에 입력
        let checkArr = [tableSeq[0].mtril_check_code,
                        key[i].mtril_code,
                        key[i].mtril_name,
                        key[i].rec_num,
                        key[i].mtlty_name,
                        key[i].empl_no,
                        key[i].pass_amount,
                        key[i].order_no,
                        key[i].bcnc_code];
        console.log('checkArr-----------',checkArr);
        let checkInsertData = await mariaDB.query('quailtyInsert', checkArr)
                                           .catch(err=>console.log(err));
        
        //check_result에 입력
        let resultArr = [key[i].inspec_standard,
                         key[i].inspec_item,
                         key[i].p_result,
                         key[i].error_amount,
                         tableSeq[0].mtril_check_code];
        console.log('resultArr-----------',resultArr);

        let resultInsertData = await mariaDB.query('quailtyResultInsert', resultArr)
                                            .catch(err=>console.log(err));
                                                
        //console.log('checkInsertData------------', checkInsertData);
        //console.log('resultInsertData-----------', resultInsertData); 
        
        //결과를 더하고 2로 나눔.
        resultSum += (checkInsertData.affectedRows + resultInsertData.affectedRows)/2;
    };

    if(resultSum == key.length) {
        //결과의 합의 평균이 넘어온 배열의 길이와 같으면 성공
        return 'success';
    } else {
        return 'fail';
    }
};

//검사 완료 목록 가져오기
const qiResultList = async(key) => {
    //검색 데이터
    let infoArr = [key.mtril_check_code == "" ? null : key.mtril_check_code,
                    key.p_result == "" ? null : key.p_result,
                    key.mtril_name == "" ? null : key.mtril_name,
                    key.mtlty_name == "" ? null : key.mtlty_name,
                    key.test_date_start == "" ? null : key.test_date_start,
                    key.test_date_end == "" ? null : key.test_date_end,
                    key.empl_name == "" ? null : key.empl_name];
    console.log('-----------infoArr', infoArr);
    let result = await mariaDB.query('qiResult', infoArr)
                              .catch(err => console.log(err));

    return result;
                 
};



module.exports = {
    mtrilOrderList,
    mtrilList,
    insertResult,
    qiResultList

};
