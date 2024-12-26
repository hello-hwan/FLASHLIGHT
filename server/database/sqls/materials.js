//자재 

//자재 발주 관리 - mt001 / 생산으로부터 발주 요청 리스트 select
const mt_prRequestList = 
`
SELECT  m.req_code req_code,
        m.req_name req_name,
        m.prd_nm mt_name,
        m.prd_code mt_code,
        m.req_qy order_qy,
        s.unit unit,
        m.req_de date
FROM    thng_req m JOIN mtril s
                     ON (m.prd_code = s.mtril_code)
WHERE   m.prdctn_code IS NULL
AND     m.prd_se = 'PI01'
AND     m.procs_at = 'RD02'
`;

//자재 발주 관리 - mt001 / 발주서 등록
const mt_orderInsert =
`
Call mt_order_process(
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?)
`;


//자재 발주관리 - mt001 / 발주서 수정 프로시저
const mt_ordermodify =
`
Call mt_order_modify_process(?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?)
`;

//자재 발주관리 - mt001 / 발주서 삭제
const mt_orderDelete = 
`
DELETE FROM mtril_order
WHERE  order_code = ?
`;

//자재 검색 모달 - mt002 
const mt_searchMtList =
`
select mtril_code,
       mtril_name,
       unit
from   mtril
WHERE  mtril_name = IFNULL(?, mtril_name)
AND    mtril_code = IFNULL(?, mtril_code)
`;

//거래처 검색 모달 - mt003
const mt_searchCompany = 
`
SELECT  bcnc_code,
	mtlty_name,
        charger_name
FROM    bcnc
WHERE   bcnc_code = IFNULL(?, bcnc_code)
AND     mtlty_name = IFNULL(?, mtlty_name)
AND     charger_name = IFNULL(?, charger_name)
`;

//수정할 발주건 검색 - mt004 조건
const mt_searchOrderWithKey =
`
SELECT  order_no,
        order_code,
        order_name,
        mtlty_name,
        bcnc_code,
        order_date,
        dedt,
        empl_no
FROM    mtril_order
WHERE   order_name LIKE CONCAT('%', IFNULL(?, order_name), '%')
AND     mtlty_name LIKE CONCAT('%', IFNULL(?, mtlty_name), '%')
AND     order_date BETWEEN IFNULL(?, order_date) AND IFNULL(?, order_date)
AND     dedt BETWEEN IFNULL(?, dedt) AND IFNULL(?, dedt)
AND     empl_no = IFNULL(?, empl_no)
GROUP BY order_code
ORDER BY order_no DESC
`;

//발주한 건 자재 목록
const mt_listOnOrder =
`
SELECT  m.order_no AS order_no,
        m.order_code AS req_code, 
        m.order_name AS req_name, 
        m.mtril_name AS mt_name,
        m.mtril_code AS mt_code,
        m.mtlty_name AS company_name,
        m.bcnc_code AS company_code,
        m.order_price AS price,
        m.order_qy AS order_qy,
        s.unit
FROM    mtril_order m JOIN mtril s
                        ON (m.mtril_code = s.mtril_code)
WHERE   order_code = ?
`;

//자재 발주 조회 - mt005
const mt_orderList = 
`
`;

//자재 발주 조회 - mt005 조건
const mt_orderListWithKey =
`
`;

//발주서 양식에 들어가는 정보 - mt006
const mt_orderForm =
`
`;

//자재 입고처리 - mt007 생산 반환 리스트
const mt_fromProduction =
`
SELECT  m.mtril_lot AS lot,
        m.mtril_name AS name,
        m.mtril_code AS code,
        m.nusgqty AS qy,
        t.unit AS unit,
        s.wrhousng_date AS wrdate
FROM    mtril_dlivy m JOIN mtril_wrhousing s
                         ON (m.mtril_lot = s.mtril_lot)
                       JOIN mtril t
                         ON (m.mtril_code = t.mtril_code)
WHERE   m.usgstt = 'MU02'
`;

//자재 입고처리 - mt007 풀질검사 끝난 자재 리스트
//입고날짜는 js에서 당일 날짜를 보여주도록 한다.
const mt_fromOrder =
`
SELECT m.mtril_name AS name,         
       m.prd_code AS code, 
       m.pass_amount AS qy, 
       m.mtril_check_code AS checkCode, 
       s.unit AS unit, 
       CURDATE() AS wrdate          
FROM inspection_check m JOIN mtril s 
			  ON (m.prd_code = s.mtril_code)
WHERE m.mtril_check_code NOT IN (SELECT t.mtril_check_code
				FROM mtril_wrhousing t
                                WHERE t.mtril_check_code IS NOT NULL)
`;

//자재 입고 테이블에 insert, 생산 반환 리스트 상태 업데이트
const mt_wrhousingInsert = 
`
CALL mt_wrhousing_process(
    ?,
    ?,
    ?,              
    ?,           
    ?,           
    ?,       
    ?,      
    ?
)
`;

//자재 입고 조회 - mt008 
const mt_wrhousngList =
`
`;

//자재 출고 관리 - mt009 요청가져오기
const mt_requestList =
`
SELECT req_name name,
        prdctn_code code,
        req_de req_date
FROM    thng_req
WHERE   procs_at = 'RD02'
AND     prdctn_code IS NOT NULL
AND     prd_se = 'PI01'
GROUP BY prdctn_code
`;

//자재 출고 관리 - mt009 자재별 상세 수량 출력
const mt_requestDetails =
`
SELECT  m.req_name AS req_name,
	m.req_code AS req_code,
	m.prd_nm AS mt_name,
	m.prd_code AS mt_code,
	m.req_qy AS qy,
	s.unit AS unit,
        m.prdctn_code AS prdctn_code
FROM    thng_req m JOIN mtril s
		     ON (m.prd_code = s.mtril_code)
WHERE   procs_at = 'RD02'
AND     prdctn_code = ?
`;

//자재 출고 관리 = mt009 자재 로트 수량 가져오기
const mt_lotInvenList =
`
SELECT  mtril_lot,
        mtril_qy
FROM    MTRIL_WRHOUSING
WHERE   mtril_code = ?
AND     mtril_qy > 0
`;

//자재 출고 관리 - mt009 자재 출고 등록
const mt_requestCheckOut =
`
CALL mt_dlivy_process(
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?
)
`;

//자재 출고 관리 요청명 검색 모달 - mt010
const mt_searchRequest = 
`
`;

//자재 출고 관리 요청명 검색 모달 - mt010 조건
const mt_searchRequestWithKey =
`
`;

//자재 출고 조회 - mt011
const mt_dlivyList =
`
`;

//자재 출고 조회 조건 - mt011
const mt_dlivyListWithKey =
`
`;

//자재 재고 조회 -mt012 자재별
const mt_inven =
`
`;

//자재 재고 조회 - mt013 로트별
const mt_lotInven =
`
`;

//자재 재고 조회 - mt013 로트별 조건
const mt_lotInvenWithKey =
`
`;

//자재 조정관리 - mt014 자재별 조정 내용 입력
const mt_mdatInsert =
`
`;

//자재 조정관리 - mt015 자재별 로트 검색
const mt_lotList =
`
`;

//자재 조정관리 - mt015 자재별 로트 검색 조건
const mt_lotListWithKey =
`
`;

//자재 조정관리 - mt016 자재 조정건 수정을 위한 모달 출력내용
const mt_invelExaminList =
`
`;

//자재 조정관리 - mt016 자재 조정건 수정을 위한 모달 출력내용 조건
const mt_invelExaminListWithKey =
`
`;

//자재 조정 조회 - mt017 
const mt_mdatList =
`
`;

//자재 조정 조회 - mt017 조건
const mt_mdatListWithKey =
`
`;

//자재 반품 관리 - mt018 반품 등록
const mt_returnGoodsInsert =
`
`;

//자재 반품 관리 - mt018 반품 수정
const mt_returnGoodsUpdate =
`
`;

//자재 반품 관리 - mt019 자재 반품건 수정 선택 모달
const mt_returnNameList =
`
`;

//자재 반품 관리 - mt019 자재 반품건 수정 선택 모달 조건
const mt_returnNameListWithKey =
`
`;

//자재 반품 조회 - mt020 자재 반품 조회
const mt_returnList =
`
`;

//자재 반품 조회 - mt020 자재 반품 조회 조건
const mt_returnListWithKey =
`
`;

module.exports = {
        mt_prRequestList,
        mt_fromProduction,
        mt_fromOrder,
        mt_wrhousingInsert,
        mt_requestList,
        mt_requestDetails,
        mt_lotInvenList,
        mt_requestCheckOut,
        mt_searchOrderWithKey,
        mt_listOnOrder,
        mt_orderInsert,
        mt_orderDelete,
        mt_ordermodify,
        mt_searchMtList,
        mt_searchCompany
};