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
ORDER BY m.req_de
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
WHERE   bcnc_code LIKE CONCAT('%', IFNULL(?, bcnc_code), '%')
AND     mtlty_name LIKE CONCAT('%', IFNULL(?, mtlty_name), '%')
AND     charger_name LIKE CONCAT('%', IFNULL(?, charger_name), '%')
`;

//수정할 발주건 검색 - mt004 조건
const mt_searchOrderWithKey =
`
SELECT  m.order_code,
        m.order_name,
        m.mtlty_name,
        m.bcnc_code,
        m.order_date,
        m.dedt,
        s.empl_name
FROM    mtril_order m JOIN empl s
                        ON (m.empl_no = s.empl_no)
WHERE   m.order_name LIKE CONCAT('%', IFNULL(?, m.order_name), '%')
AND     m.mtlty_name LIKE CONCAT('%', IFNULL(?, m.mtlty_name), '%')
AND     m.order_date BETWEEN IFNULL(?, m.order_date) AND IFNULL(?, m.order_date)
AND     m.dedt BETWEEN IFNULL(?, m.dedt) AND IFNULL(?, m.dedt)
AND     s.empl_no IN (SELECT t.empl_no
                      FROM   empl t
                      WHERE  t.empl_name LIKE CONCAT('%', IFNULL(?, t.empl_name), '%'))
AND     m.order_no NOT IN (SELECT t.order_no
			   FROM   inspection_check t)
GROUP BY m.order_code
ORDER BY m.order_no DESC
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
        s.unit,
        m.dedt AS dedt
FROM    mtril_order m JOIN mtril s
                        ON (m.mtril_code = s.mtril_code)
WHERE   order_code = ?
`;

//자재 발주 조회 - mt005
const mt_selectAllOrderList = 
`
SELECT  m.order_no AS order_no,
        m.order_code AS order_code,
        m.order_name AS order_name,
        m.mtlty_name AS mtlty_name,
        m.bcnc_code AS bcnc_code,
        m.order_date AS order_date,
        m.dedt AS dedt,
        t.empl_name AS empl_name,
        m.mtril_name AS mtril_name,
        m.mtril_code AS mtril_code,
        m.order_price AS order_price,
        m.order_qy AS order_qy,
        s.unit AS unit
FROM    mtril_order m JOIN mtril s
			ON (m.mtril_code = s.mtril_code)
		      JOIN empl t
                        ON (t.empl_no = m.empl_no)
WHERE   m.order_name LIKE CONCAT('%', IFNULL(?, m.order_name), '%')
AND     m.mtril_name LIKE CONCAT('%', IFNULL(?, m.mtril_name), '%')
AND     m.mtlty_name LIKE CONCAT('%', IFNULL(?, m.mtlty_name), '%')
AND     m.order_date BETWEEN IFNULL(?, m.order_date) AND IFNULL(?, m.order_date)
AND     m.dedt BETWEEN IFNULL(?, m.dedt) AND IFNULL(?, m.dedt)
AND     t.empl_name LIKE CONCAT('%', IFNULL(?, t.empl_name), '%')
ORDER BY m.order_no desc
`;
//자재 발주 조회 pdf출력용 - mt005
const mt_selectOrderListForPDF = 
`
SELECT  m.order_code AS order_code,
        m.order_name AS order_name,
        m.mtlty_name AS mtlty_name,
        m.order_date AS order_date,
        m.dedt AS dedt,
        s.empl_name AS empl_name
FROM    mtril_order m JOIN empl s
                        ON (m.empl_no = s.empl_no)
WHERE   m.order_name LIKE CONCAT('%', IFNULL(?, m.order_name), '%')
AND     m.mtlty_name LIKE CONCAT('%', IFNULL(?, m.mtlty_name), '%')
AND     m.order_date BETWEEN IFNULL(?, m.order_date) AND IFNULL(?, m.order_date)
AND     m.dedt BETWEEN IFNULL(?, m.dedt) AND IFNULL(?, m.dedt)
AND     s.empl_no IN (SELECT t.empl_no
                      FROM   empl t
                      WHERE  t.empl_name LIKE CONCAT('%', IFNULL(?, t.empl_name), '%'))
GROUP BY m.order_code
ORDER BY m.order_no DESC
`;
//발주서 양식에 들어가는 정보 
/*상호, 사업자번호, 대표자, 주소, 
발주일, 납기일, 합계금액, 발주담당자
품목명, 수량, 단위, 단가
*/
const mt_orderFormCompanyInfo =
`
SELECT  m.mtlty_name AS mtlty_name,
        m.bizrno AS bizrno,
        m.charger_name AS charger_name,
        m.dvyfg_adres AS dvyfg_adres
FROM    bcnc m
WHERE   m.bcnc_code IN (SELECT s.bcnc_code
                       FROM   mtril_order s
                       WHERE  order_code = ?)
`;

//합계금액은 데이터 가져와서 구하기
const mt_orderFormMtList = 
`
SELECT  m.mtril_name AS mtril_name,
        m.order_qy AS order_qy,
        s.unit AS unit,
        m.order_price AS order_price,
        TO_CHAR(m.order_date, 'yyyy-MM-dd') AS order_date,
        TO_CHAR(m.dedt, 'yyyy-MM-dd') AS dedt,
        t.empl_name AS empl_name
FROM    mtril_order m JOIN mtril s
                        ON (m.mtril_code = s.mtril_code)
                      JOIN empl t
                        ON (m.empl_no = t.empl_no)
WHERE   order_code = ?

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
       m.test_date AS wrdate          
FROM inspection_check m JOIN mtril s 
			  ON (m.prd_code = s.mtril_code)
WHERE m.mtril_check_code NOT IN (SELECT t.mtril_check_code
				FROM mtril_wrhousing t
                                WHERE t.mtril_check_code IS NOT NULL)
ORDER BY m.test_date;
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

//자재 입고 조회 - mt008 조건 자재명, 구분, 담당자, 날짜1,2
const mt_wrhousngList =
`
SELECT   m.mtril_code AS mtril_code,
         m.mtril_name AS mtril_name,
         m.wrh_qy AS wrh_qy,
         s.unit AS unit,
         m.mtril_lot AS mtril_lot,
	 (CASE WHEN m.wrhousng_se = 'MW01' THEN  '발주' ELSE '반환' END) AS wrhousng_se,
         m.wrhousng_date AS wrhousng_date,
         t.empl_name AS empl_name
FROM     mtril_wrhousing m JOIN mtril s
                             ON (m.mtril_code = s.mtril_code)
                           JOIN empl t
                             ON (m.empl_no = t.empl_no)
WHERE    m.mtril_name LIKE CONCAT('%', IFNULL(?, m.mtril_name) ,'%')
AND      m.wrhousng_se LIKE CONCAT('%', IFNULL(?, m.wrhousng_se), '%')
AND      t.empl_name LIKE CONCAT('%', IFNULL(?, t.empl_name), '%')
AND      m.wrhousng_date BETWEEN IFNULL(?, m.wrhousng_date) AND IFNULL(?, m.wrhousng_date)
ORDER BY m.wrhousng_date DESC, m.mtril_lot DESC;
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

//자재 출고 조회 - mt011
const mt_dlivyList =
`
SELECT  m.req_name AS req_name,
        m.requst_date AS requst_date,
        m.mtril_code AS mtril_code,
        m.mtril_name AS mtril_name,
        m.mtril_lot AS mtril_lot,
        m.requst_qy AS dlivy_qy,
        s.unit AS unit,
        t.empl_name AS charger
FROM    mtril_dlivy m JOIN mtril s
                        ON (m.mtril_code = s.mtril_code)
                      JOIN empl t
                        ON (m.empl_no = t.empl_no)
WHERE   m.req_name LIKE CONCAT('%', IFNULL(?, m.req_name), '%')
AND     m.mtril_name LIKE CONCAT('%', IFNULL(?, m.mtril_name), '%')
AND     t.empl_name LIKE CONCAT('%', IFNULL(?, t.empl_name), '%')
AND     m.requst_date BETWEEN IFNULL(?, m.requst_date) AND IFNULL(?, m.requst_date)
ORDER BY m.dlivy_no desc
`;

//자재 재고 조회 -mt012 자재별
const mt_selectQy =
`
SELECT  m.mtril_name AS mtril_name,
        m.mtril_code AS mtril_code,
        (SELECT SUM(s.mtril_qy)
        FROM   mtril_wrhousing s
        WHERE  s.mtril_code = m.mtril_code) AS qy,
        m.unit AS unit,
        m.sfinvc AS sfinvc
FROM    mtril m
`;

//자재 재고 조회 - mt013 로트별 로트, 수량, 단위, 입고일, 입고담당자 이름
const mt_lotInven =
`
SELECT m.mtril_name AS mtril_name, 
       m.mtril_lot AS mtril_lot,
       m.mtril_qy AS mtril_qy,
       s.unit AS unit,
       m.wrhousng_date AS wrhousng_date,
       t.empl_name AS empl_name
FROM   mtril_wrhousing m JOIN mtril s
                           ON (m.mtril_code = s.mtril_code)
					     JOIN empl t
                           ON (m.empl_no = t.empl_no)
WHERE  m.mtril_lot LIKE CONCAT('%', IFNULL(?, m.mtril_lot), '%')
AND    m.wrhousng_date BETWEEN IFNULL(?, m.wrhousng_date) AND IFNULL(?, m.wrhousng_date)
AND    m.mtril_qy > 0
AND    t.empl_name LIKE CONCAT('%', IFNULL(?, t.empl_name), '%')
AND    m.mtril_code = ?
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
        mt_searchCompany,
        mt_selectQy,
        mt_lotInven,
        mt_selectAllOrderList,
        mt_wrhousngList,
        mt_dlivyList,
        mt_orderFormCompanyInfo,
        mt_orderFormMtList,
        mt_selectOrderListForPDF
};