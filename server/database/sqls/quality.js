/*태백 작업 */
//발주 목록 가져오기
const mtrilOrderList = 
`
SELECT  m.order_no AS order_no,
		m.order_code AS order_code,
        m.order_name AS order_name,
        m.mtlty_name AS mtlty_name,
        m.bcnc_code AS bcnc_code,
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
AND     m.order_no NOT IN (SELECT n.order_no
						   FROM   inspection_check n)
GROUP BY m.order_code
ORDER BY m.order_no
`;

//발주 자재 리스트 가져오기
const mtrilList =
`
SELECT  m.order_no AS order_no,
	    m.mtril_code AS mtril_code,
		m.mtril_name AS mtril_name,
		s.inspec_standard AS inspec_standard,
		m.order_qy AS order_qy,
		t.unit AS unit,
		0 AS error_amount
FROM    mtril_order m JOIN inspection_detail s
						ON (m.mtril_code = s.prd_code)
					  JOIN mtril t 
					    ON (m.mtril_code = t.mtril_code)
WHERE   m.order_code = ?
`;

//품질입고검사 등록
const quailtyInsert = 
`
INSERT INTO inspection_check(mtril_check_code,
							 prd_code,
							 mtril_name,
							 rec_num,
							 mtlty_name,
							 empl_no,
							 pass_amount,
							 order_no,
							 bcnc_code,
							 test_date)
VALUES(?,
	   ?,
	   ?,
	   ?,
	   ?,
	   ?,
	   ?,
	   ?,
	   ?,
	   now())
`;

//품질입고검사 check_code가져오기
const getSequence =
`SELECT CONCAT('INS', LPAD(IFNULL(MAX(CAST(SUBSTR(mtril_check_code, 5) AS UNSIGNED)) + 1, 1), 5, '0')) AS mtril_check_code
FROM inspection_check`;

//품질입고검사 검사 결과 등록
const quailtyResultInsert =
`
INSERT INTO check_result(inspec_standard,
						 inspec_item,
						 p_result,
						 error_amount,
						 mtril_check_code)
VALUES(?,
	   ?,
	   ?,
	   ?,
	   ?)
`;

//품질검사 결과 리스트
const qiResult =
`
SELECT  m.mtril_check_code AS mtril_check_code,
		s.inspec_standard AS inspec_standard,
        s.p_result AS p_result,
        m.mtlty_name AS mtlty_name,
        m.prd_code AS prd_code,
        m.mtril_name AS mtril_name,
        m.rec_num AS rec_num,
        m.pass_amount AS pass_amount,
        s.error_amount AS error_amount,
        t.unit AS unit,
        m.test_date AS test_date,
        f.empl_name AS empl_name
FROM    inspection_check m JOIN check_result s
							 ON (m.mtril_check_code = s.mtril_check_code)
						   JOIN mtril t
                             ON (m.prd_code = t.mtril_code)
						   JOIN empl f
                             ON (m.empl_no = f.empl_no)
WHERE  m.mtril_check_code LIKE CONCAT('%', IFNULL(?, m.mtril_check_code), '%')
AND    s.p_result = IFNULL(?, s.p_result)
AND    m.mtril_name LIKE CONCAT('%', IFNULL(?, m.mtril_name), '%')
AND    m.mtlty_name LIKE CONCAT ('%', IFNULL(?, m.mtlty_name), '%')
AND    m.test_date BETWEEN IFNULL(?, m.test_date) AND IFNULL(?, m.test_date)
AND    m.empl_no IN (SELECT d.empl_no
                     FROM   empl d
                     WHERE  d.empl_name LIKE CONCAT('%', IFNULL(?, d.empl_name), '%'))
ORDER BY m.mtril_check_code desc
`;

module.exports = {
	quailtyInsert,
	quailtyResultInsert,
	qiResult,
	getSequence,
	mtrilOrderList,
	mtrilList

};