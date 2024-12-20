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

// 점검할 기기 조회
const chck_fx_list = 
`SELECT fx_code, 
        eqp_code, 
        chck_nm, 
        chck_knd, 
        chck_de, 
        chck_time
 FROM chck_fx
 WHERE chck_de > NOW()
 ORDER BY 5`;

// 전체 점검 기기 조회
const chck_fx_all_list = 
`SELECT fx_code, 
        eqp_code, 
        chck_nm, 
        chck_knd, 
        chck_de, 
        chck_time
 FROM chck_fx
 ORDER BY 5 desc`;

// 일정코드로 점검일정 조회
const fx_code_list = 
`SELECT chck_fx.chck_nm, 
       eqp.model_nm, 
       eqp.eqp_code, 
       chck_fx.chck_knd, 
       chck_fx.charger, 
       chck_fx.chck_time, 
       chck_fx.last_bgnde, 
       eqp.chck_cycle
 FROM chck_fx
 JOIN eqp
 ON chck_fx.eqp_code = eqp.eqp_code
 WHERE fx_code = ?
`;

// 점검 일정 등록
const chck_fc_insert = 
`INSERT INTO chck_fx(fx_code, 
                     eqp_code, 
                     chck_nm, 
                     chck_knd, 
                     chck_sttus, 
                     charger, 
                     chck_time, 
                     chck_de, 
                     last_bgnde)
VALUE (nextval(chck_fx_seq), ?, ?, ?, ?, ?, ?, ?, ?)`;

// 점검 결과 등록
const chck_result_insert = 
`INSERT INTO chck_result(result_code, 
                        fx_code, 
                        iem_nm, 
                        mesure_value, 
                        stblt_at)
VALUE (nextval(chck_result_seq), ?, ?, ?, ?)`;

// 점검 결과 등록할 일정 코드 찾기
const find_last_fx_code = 
`SELECT fx_code
 FROM chck_fx
 ORDER BY 1 desc
 LIMIT 1;`; 

module.exports = {
    eqp_list, 
    eqp_list_prod, 
	chck_fx_list, 
	chck_fx_all_list, 
    fx_code_list, 
    chck_fc_insert, 
    chck_result_insert, 
    find_last_fx_code
};