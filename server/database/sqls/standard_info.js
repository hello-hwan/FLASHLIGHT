//기준정보 sql

const cmmn =
`SELECT cmmn_code
       ,upper_cmmn_code
       ,cmmn_name
FROM cmmn`;

const bom =
`SELECT bom_code
       ,prdlst_code
       ,prdist_name
       ,prdctn_qy
       ,sumry 
FROM bom`;


// BOM 상세보기 쿼리
const bomInfo =
`SELECT bc.cmpds_no
	,bc.cmpds_prdlst_name
	,bc.stndrd_y
       ,bc.unit
       ,bc.cnsum_count
FROM bom b JOIN bom_cmpds bc 
on b.bom_code = bc.bom_code
WHERE b.bom_code = ?`;

// BOM 등록 쿼리
const bomInsert =  
`INSERT INTO bom_cmpds
SET ? `;

// 품질검사항목관리
const qiList =
`SELECT inspec_item  
        ,inspec_standard
FROM inspection_detail
WHERE prd_code=?`;


module.exports = {
  cmmn,
  bom,
  bomInfo,
  bomInsert,
  qiList
};