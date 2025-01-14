//민규 기준정보 쿼리
// 공정 흐름도 조회
const procsFlowchartList = 
`SELECT prd_code, prd_nm, sum(expect_reqre_time) as all_time
 FROM procs_flowchart
 GROUP BY prd_code, prd_nm
`;

// 공정 흐름도 상세 조회
const procsFlowchartDetail = 
`SELECT DISTINCT procs_flowchart.procs_ordr_no, 
                 procs_flowchart.expect_reqre_time, 
                 procs_flowchart.procs_nm, 
                 procs_matrl.mtril_nm, 
                 procs_matrl.usgqty, 
                 procs_mchn.eqp_code
 FROM procs_flowchart
 left outer JOIN procs_matrl
 ON procs_flowchart.procs_code = procs_matrl.procs_code
 JOIN procs_mchn
 ON procs_flowchart.procs_code = procs_mchn.procs_code
 WHERE prd_code = ? 
 ORDER BY 1
`;

// 공정 흐름도 상세 조회 상단
const procsFlowchartDetailTop = 
`SELECT prd_code, prd_nm, sum(expect_reqre_time) AS all_time
 FROM procs_flowchart
 WHERE prd_code = ?
 GROUP BY prd_code, prd_nm
`;

// 공정 흐름도에 사용하는 BOM 코드 조회
const procsFlowchartSearchBom = 
`SELECT bom_code
 FROM bom
 WHERE prdlst_code = ?
`;

// 공정 흐름도에 사용하는 자재명 조회
const procsFlowchartSearchmtnm = 
`SELECT mtril_code
 FROM mtril
 WHERE mtril_name = ?
`;

// 공정 흐름도 생성
const procsFlowchartInsert = 
`INSERT INTO procs_flowchart(procs_code, 
                             procs_nm, 
                             prd_code, 
                             prd_nm, 
                             procs_ordr_no, 
                             expect_reqre_time, 
                             bom_code) 
 VALUES(?, ?, ?, ?, ?, ?, ?)
`;
 
// 공정별 재료 소모 생성
const procsMatrlInsert = 
`INSERT INTO procs_matrl(procs_matrl_no, 
                         procs_code, 
                         procs_nm, 
                         mtril_code, 
                         mtril_nm, 
                         usgqty
)
 VALUES (nextval(procs_matrl_seq), ?, ?, ?, ?, ?)
`;

// 공정별 작업기기 생성
const procsMchnInsert = 
`INSERT INTO procs_mchn(procs_mhrls_no, 
                        procs_code, 
                        eqp_code
)
 VALUES (nextval(procs_mchn_seq), ?, ?)
`;

// 품목 코드로 공정 코드 조회
const prdCodeToProcsCode = 
`SELECT procs_code
 FROM procs_flowchart
 WHERE prd_code = ?
`;

// 공정 코드로 공정 흐름도 삭제 (테이블 3개)
const ProcsCodeToDeleteMchn = 
`DELETE FROM procs_mchn
 WHERE procs_code = ?
`;

const ProcsCodeToDeleteMatrl = 
`DELETE FROM procs_matrl
 WHERE procs_code = ?
`;

const ProcsCodeToDeleteFlowchart = 
`DELETE FROM procs_flowchart
 WHERE procs_code = ?
`;

module.exports = {
    procsFlowchartList, 
    procsFlowchartDetail, 
    procsFlowchartDetailTop, 
    procsFlowchartSearchBom, 
    procsFlowchartSearchmtnm, 
    procsFlowchartInsert, 
    procsMatrlInsert, 
    procsMchnInsert, 
    prdCodeToProcsCode, 
    ProcsCodeToDeleteMchn, 
    ProcsCodeToDeleteMatrl, 
    ProcsCodeToDeleteFlowchart
};