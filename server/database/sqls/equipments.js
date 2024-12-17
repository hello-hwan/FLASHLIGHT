//설비 sql
//설비 상태 조회
const eqp_list = 
`SELECT eqp.eqp_code, 
        eqp.model_nm, 
		eqp_sttus.model_tp, 
		eqp.regsde
 FROM eqp
 JOIN eqp_sttus
 ON eqp.eqp_code = eqp_sttus.eqp_code
 ORDER BY eqp.eqp_code ASC`;

 // 설비 상태 조회 2
const eqp_list_prod =
`SELECT begin_time, 
		end_time, 
		procs_nm
 FROM product_state
 WHERE eqp_code = ?
 ORDER BY begin_time DESC
 LIMIT 1`;

module.exports = {
    eqp_list, 
    eqp_list_prod
};