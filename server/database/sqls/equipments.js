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
`SELECT chck_fx.fx_code, 
        chck_fx.eqp_code, 
        chck_fx.chck_nm, 
        chck_fx.chck_knd, 
        chck_fx.chck_time, 
        chck_fx.last_bgnde, 
        eqp.chck_cycle, 
        ADDDATE(chck_fx.last_bgnde, eqp.chck_cycle)
 FROM chck_fx
 JOIN eqp
 ON chck_fx.eqp_code = eqp.eqp_code
 WHERE chck_fx.chck_de is NULL
 ORDER BY 8`;

// 전체 점검 기기 조회
const chck_fx_all_list = 
`SELECT fx_code, 
        eqp_code, 
        chck_nm, 
        chck_knd, 
        chck_time, 
        chck_de, 
        last_bgnde
 FROM chck_fx
 ORDER BY 7 desc`;

// 일정코드로 점검일정 조회
const fx_code_list = 
`SELECT chck_fx.chck_nm, 
        eqp.model_nm, 
        eqp.eqp_code, 
        chck_fx.chck_knd, 
        chck_fx.charger, 
        chck_fx.chck_time, 
        chck_fx.last_bgnde, 
        eqp.chck_cycle,
        chck_fx.not_chck_resn
 FROM chck_fx
 JOIN eqp
 ON chck_fx.eqp_code = eqp.eqp_code
 WHERE fx_code = ?`;

// 점검 일정 등록
const chck_fc_insert = 
`INSERT INTO chck_fx(fx_code, 
                     eqp_code, 
                     chck_nm, 
                     chck_knd, 
                     charger, 
                     chck_time, 
                     last_bgnde)
VALUE (nextval(chck_fx_seq), ?, ?, ?, ?, ?, ?)`;

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
 LIMIT 1`; 

// 미점검 업데이트
const not_check_update = 
`UPDATE chck_fx
 SET not_chck_resn = ?, 
     chck_de = NOW(), 
     charger = ?, 
     chck_time = ?, 
     chck_sttus = ?
 WHERE fx_code = ?`;

// 점검 항목 조회
const chck_iem_list = 
`SELECT iem_nm
 FROM chck_iem
 WHERE eqp_code = ?`;

 // 미점검 기기 조회
 const not_check_list = 
 `SELECT chck_fx.fx_code, 
        chck_fx.eqp_code, 
        eqp.model_nm, 
        chck_fx.chck_nm, 
        chck_fx.chck_knd, 
        chck_fx.chck_de, 
        chck_fx.chck_time, 
        chck_fx.not_chck_resn
FROM chck_fx
JOIN eqp
ON chck_fx.eqp_code = eqp.eqp_code
WHERE chck_sttus = '미점검'
ORDER BY 6 DESC`;

// 장비 전체 조회
const eqp_all_list = 
`SELECT eqp_code, 
        eqp_nm, 
        model_nm, 
        regsde, 
        mfbiz, 
        mg, 
        chck_cycle, 
        mnfctur_de
FROM eqp`;

// 설비 등록
const eqp_insert = 
`INSERT INTO eqp(eqp_code, 
                 eqp_nm, 
                 model_nm, 
                 regsde, 
                 mfbiz, 
                 mg, 
                 chck_cycle, 
                 mnfctur_de, 
                 rm)
VALUE (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

// 미가동 등록
const not_opr_insert = 
`INSERT INTO not_opr(not_opr_code, 
                     eqp_code, 
                     stop_time, 
                     eqp_charger, 
                     not_opr_resn, 
                     process_step)
VALUE (nextval(not_opr_seq), ?, NOW(), ?, ?, ?)`;

// 미가동 설비 조회
const not_opr_list = 
`SELECT not_opr_code,
        eqp_code, 
        stop_time, 
        eqp_charger, 
        not_opr_resn
FROM not_opr
WHERE process_step = 'OD01'`;

// 미가동 설비 가동 변경
const not_opr_update = 
`UPDATE not_opr
 SET process_step = 'OD02', 
     after_begin_time = NOW(), 
     flpmn_cn = ?
WHERE not_opr_code = ?`;

module.exports = {
    eqp_list, 
    eqp_list_prod, 
	chck_fx_list, 
	chck_fx_all_list, 
    fx_code_list, 
    chck_fc_insert, 
    chck_result_insert, 
    find_last_fx_code, 
    not_check_update, 
    chck_iem_list, 
    not_check_list, 
    eqp_all_list, 
    eqp_insert, 
    not_opr_insert, 
    not_opr_list, 
    not_opr_update
};