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
`INSERT INTO bom_cmpds( cmpds_no
			  ,cmpds_prdlst_code 
                       ,cmpds_prdlst_name
                       ,stndrd_x
                       ,stndrd_y
                       ,stndrd_z
                       ,unit
                       ,cnsum_count)
values(?,?,?,?,?,?,?,?) `; 

 

module.exports = {
  cmmn,
  bom,
  bomInfo,
  bomInsert
};