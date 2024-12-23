devUSE dev;
-- 페이징
SELECT b.*
FROM (SELECT rownum() as rn, a.*
      FROM ( SELECT *
             FROM cmmn
             ORDER BY 1) a) b 
WHERE b.rn > (1-1) * 10
AND b.rn <= 3 * 10;

SELECT *
FROM cmmn
WHERE cmmn_name = '미처리'
ORDER BY cmmn_code ASC
LIMIT 10 OFFSET 0;

SELECT * FROM cmmn;
INSERT INTO cmmn(cmmn_code, upper_cmmn_code, cmmn_name)
VALUES ('RD', NULL, '재료요청처리구분'), ('RD01', 'RD', '처리'), ('RD02', 'RD', '미처리');
COMMIT;

-- 시퀀스 생성
DROP sequence plan_seq;
CREATE sequence plan_seq START WITH 1 increment BY 1;
select NEXTVAL(plan_seq);

DROP sequence req_seq;
CREATE sequence req_seq START WITH 1 increment BY 1;
SELECT NEXTVAL(req_seq);

-- 계획 순서 
-- 주문리스트에서 처리중, 생산인 품목이랑 수량, 주문번호, 주문일자, 납품기한, 우선순위 조회
-- 공정흐름도에서 품목별 공정 조회
-- 반복문 생산계획 삽입
-- 주문리스트 (주문번호, 품목번호, 품목명, 주문수량, 주문일자, 납품일자, 총 소요시간, 우선순위)
SELECT olist.order_list_no, 
		 olist.order_no, 
		 olist.prd_code, 
		 olist.prd_name, 
		 olist.order_qy, 
		 oreq.order_date, 
		 oreq.dete,
		 ROUND((TIMESTAMPDIFF(MINUTE, SYSDATE(), dete) - (SELECT IFNULL( SUM( expect_reqre_time ), 0) * olist.order_qy
       																  FROM procs_flowchart
       																  WHERE prd_code = olist.prd_code))/60) AS priort
FROM order_lists olist JOIN order_requst oreq ON (olist.order_no = oreq.order_no)
							  LEFT JOIN prdctn_plan pp ON (olist.order_list_no = pp.order_list_no)
WHERE prdctn_at = 'OP01'
AND process_status = 'OD01'
AND pp.mnfct_no IS NULL
ORDER BY 7;

-- 공정흐름도 조회
SELECT procs_code, procs_nm
FROM procs_flowchart
WHERE prd_code = 'aaa1'
ORDER BY procs_ordr_no;


-- 공정흐름도 조회해서 생산계획 삽입 프로시저
DELIMITER //
DROP PROCEDURE IF EXISTS insert_in_plan //
CREATE PROCEDURE insert_in_plan
(
IN c_prd_code VARCHAR(100),
IN c_prd_nm VARCHAR(20),
IN c_prdctn_co INT,
IN c_order_list_no VARCHAR(100),
IN c_order_no VARCHAR(100),
IN c_order_date DATE,
IN c_dedt DATE,
IN c_priort INT,
OUT c_com_rol INT
)
BEGIN
	DECLARE done INT DEFAULT FALSE;

	DECLARE v_procs_code VARCHAR(100);
	DECLARE v_procs_nm VARCHAR(20);
	
	DECLARE v_real_co INT;
	DECLARE v_row_co INT;
	DECLARE v_row_count INT;
	
		-- 공정흐름도 커서
	DECLARE cursor_flowchart CURSOR FOR
		SELECT procs_code, procs_nm
		FROM procs_flowchart
		WHERE prd_code = c_prd_code
		ORDER BY procs_ordr_no;
	
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
	
	-- 커밋 조건 초기화
		SET v_real_co = 0;
		SET v_row_co = 0;
		
		-- 공정흐름도
		OPEN cursor_flowchart; 
		in_loop: LOOP
			FETCH cursor_flowchart INTO v_procs_code, v_procs_nm;
			IF done THEN
				LEAVE in_loop;
			END IF;
			
			-- 생산 계획 삽입				
			INSERT INTO prdctn_plan( mnfct_no, procs_code, procs_nm, prd_code, prd_nm, prdctn_co, order_list_no,
			 order_no, order_date, dedt, priort)
			VALUES ( NEXTVAL(plan_seq), v_procs_code, v_procs_nm, c_prd_code, c_prd_nm, c_prdctn_co, c_order_list_no,
			 c_order_no, c_order_date, c_dedt, c_priort );
			
			SELECT ROW_COUNT()
			INTO v_row_count;
			
			-- 인서트 해야하는 행
			SET v_real_co = v_real_co + 1;
			 
			-- 실제로 인서트 되는 행
			IF v_row_count >= 0 THEN
				SET v_row_co = v_row_co + v_row_count;
			END IF;
			
		END LOOP in_loop;
		CLOSE cursor_flowchart;
		
		-- 실제와 해야하는 양 같으면 1 아니면 0
		IF v_row_co = v_real_co THEN
			SET c_com_rol = 1;
		ELSE
			SET c_com_rol = 0;
		END IF;
	
END //
DELIMITER ;

-- 생산계획  삽입 프로시저
DELIMITER //
DROP PROCEDURE IF EXISTS insert_plan //
CREATE PROCEDURE insert_plan() 
BEGIN
	DECLARE done INT DEFAULT FALSE;
	
	-- 주문리스트 커서 변수
	DECLARE v_order_list_no VARCHAR(100);
	DECLARE v_order_no VARCHAR(100);
	DECLARE v_prd_code VARCHAR(100);
	DECLARE v_prd_name VARCHAR(20);
	DECLARE v_order_qy INT;
	DECLARE v_order_date DATE;
	DECLARE v_dete DATE;
	DECLARE v_priort INT;
   
	-- 커서에 들어갈 매개변수 
   DECLARE c_prd_code VARCHAR(100);
		
	-- 인서트할 행에 대해 커밋이나 롤백 조건 변수
	DECLARE v_com_rol INT;
	
	-- 주문리스트 커서
	DECLARE cursor_order CURSOR FOR 
		SELECT olist.order_list_no,
		 olist.order_no, 
		 olist.prd_code, 
		 olist.prd_name, 
		 olist.order_qy, 
		 oreq.order_date, 
		 oreq.dete,
		 ROUND((TIMESTAMPDIFF(MINUTE, SYSDATE(), dete) - (SELECT IFNULL( SUM( expect_reqre_time ), 0) * olist.order_qy
       																  FROM procs_flowchart
       																  WHERE prd_code = olist.prd_code))/60) AS priort
		FROM order_lists olist JOIN order_requst oreq ON (olist.order_no = oreq.order_no)
							  LEFT JOIN prdctn_plan pp ON (olist.order_list_no = pp.order_list_no)
		WHERE prdctn_at = 'OP01'
		AND process_status = 'OD01'
		AND pp.mnfct_no IS NULL
		ORDER BY 7;
			
    -- 루프 끝날 조건
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
	
	-- 주문 리스트
	OPEN cursor_order;
	out_loop: LOOP
		FETCH cursor_order INTO v_order_no, v_order_list_no, v_prd_code, v_prd_name, v_order_qy, v_order_date, v_dete, v_priort;
		IF done THEN
			LEAVE out_loop;
		END IF;
		
		-- 커서에 들어갈 매개변수 선언
		SET c_prd_code = v_prd_code;
		START TRANSACTION;
		
		CALL insert_in_plan(v_prd_code, v_prd_name, v_order_qy, v_order_list_no, v_order_no, v_order_date, v_dete, v_priort, v_com_rol);
						
		-- 실제와 해야하는 양 같으면 커밋 아니면 롤백
		IF v_com_rol = 1 THEN
			COMMIT;
		ELSE
			ROLLBACK;
		END IF;
		
	END LOOP out_loop;
	CLOSE cursor_order;
	
END //
DELIMITER ;

CALL insert_plan;

-- 우선순위 수정 프로시저
DELIMITER //
CREATE PROCEDURE update_plan()
BEGIN
	DECLARE plan_count INT;
	
	-- 생산계획 행 수
	SELECT COUNT(mnfct_no)
	INTO plan_count
	FROM prdctn_plan;
	
	START TRANSACTION;
	
	-- 모든 우선순위 - 1
	UPDATE prdctn_plan
	SET priort = priort - 1 ;
	
	-- 업데이트 수와 생산계획 행 수 같으면 커밋 아니면 롤백
	IF ROW_COUNT() = plan_count THEN
		COMMIT;
	ELSE
		ROLLBACK;
	END IF;
	
END //
DELIMITER ;

-- 이벤트 스케줄러
SHOW VARIABLES LIKE 'event%';
SET GLOBAL event_scheduler = ON;
SELECT * FROM information_schema.events;

-- 계획 인서트 하루단위
CREATE EVENT plan_insert
ON SCHEDULE EVERY 1 DAY
STARTS '2024-12-17 09:00:00'
COMMENT '생산 계획 삽입'
DO
CALL insert_plan; 

DROP EVENT plan_insert;

-- 계획 수정 시간 단위
CREATE EVENT plan_update
ON SCHEDULE EVERY 1 HOUR
STARTS '2024-12-17 10:55:00'
COMMENT '생산 계획 수정 한시간 마다 우선순위-1 '
DO
CALL update_plan;

-- 순서 
-- 지시 안들어간 생산 계획 조회
-- 품목코드랑 주문 수량 가져와서 bom 조회 후 자재량 조회(아니면 공정 흐름도에서 가져와서 예상시간도 함께 조회)
-- 자재 우리가 가지고 있는 총 재고 > bom 자재량* (생산 개수) + 요청물품(미처리)(합)  이면 
-- 공정별 설비 가동 미가동 조회
-- 미가동 상태 아닌 설비 중 첫번째 설비에 생산 지시 하도록
-- 예측 시작 시간 => 

-- 생산 계획에서 주문별 물품별 수량 조회
SELECT pp.order_list_no, pp.order_no, pp.prd_code, pp.prd_nm, pp.prdctn_co
FROM prdctn_plan pp LEFT JOIN prdctn_drct pd ON (pp.mnfct_no = pd.mnfct_no)
WHERE prdctn_code IS NULL
GROUP BY order_list_no, order_no, prd_code
ORDER BY pp.priort;

-- 생산 계획에서 생산 지시가 안들어간 계획만 조회
SELECT pp.mnfct_no, pp.procs_code, pp.procs_nm, pp.prd_code, pp.prd_nm, pp.prdctn_co, pp.priort
FROM prdctn_plan pp LEFT JOIN prdctn_drct pd ON (pp.mnfct_no = pd.mnfct_no)
WHERE prdctn_code IS NULL
AND pp.order_list_no = '' ;

-- 소모재료 (자재코드, 자재명, 소모수량)
SELECT mtril_code, mtril_nm, sum(usgqty)
FROM procs_flowchart fc JOIN procs_matrl mt ON (fc.procs_code = mt.procs_code)
WHERE prd_code = ?
GROUP BY mtril_code
ORDER BY 1;

-- 요청 중에서 미처리인 물품별 수량 조회
SELECT SUM(req_qy)
FROM thng_req
WHERE prd_code = ?
AND procs_at = 'RD01'
AND prdctn_code IS NULL;

-- 자재별 재고수량
SELECT mtril_code, mtril_name, SUM(mtril_qy)
FROM mtril_wrhousing
WHERE mtril_code = ?
GROUP BY mtril_code;

-- 반제품별 재고수량
SELECT prdlst_code, prduct_name, SUM(prduct_n_wrhousng_qy)
FROM prduct_n_wrhousng
WHERE prdlst_code = ?
GROUP BY prdlst_code;

-- 설비 코드, 설비명 조회
SELECT pm.eqp_code, eqp.model_nm
FROM procs_mchn pm JOIN eqp ON (pm.eqp_code = eqp.eqp_code)			 
WHERE procs_code = ?;

SELECT pm.eqp_code, eqp.model_nm
FROM procs_mchn pm JOIN eqp ON (pm.eqp_code = eqp.eqp_code)	
						 LEFT JOIN not_opr nopr ON (eqp.eqp_code = nopr.eqp_code)
WHERE procs_code = ''
AND (process_step = 'FS02'
OR not_opr_code IS NULL);

-- 공정별 소요시간
SELECT expect_reqre_time * pp.order_qy
FROM procs_flowchart pf JOIN prdctn_plan pp ON (pf.procs_code = pp.procs_code)
WHERE pp.mnfct_no = ?;

-- 분단위로 날짜 더하기
SELECT DATE_ADD(NOW(), INTERVAL 240 MINUTE);

-- 생산지시 실행할 프로시저
DELIMITER //
DROP PROCEDURE IF EXISTS play_drct //
CREATE PROCEDURE play_drct()
BEGIN
	DECLARE v_pdn_plan INT DEFAULT 2;
	play_loop : LOOP
		IF v_pdn_plan = 0 THEN
			LEAVE play_loop;
		END IF;
		
		CALL insert_out_drct(v_pdn_plan);
		
	END LOOP play_loop;
END //
DELIMITER ;


-- 생산지시 삽입 바깥 프로시저
DELIMITER //
DROP PROCEDURE IF EXISTS insert_out_drct //
CREATE PROCEDURE insert_out_drct
(
INOUT c_pdn_plan INT
)
BEGIN 
	DECLARE done INT DEFAULT FALSE;
	
	-- 매개변수로 들어갈 변수 선언
	DECLARE c_prd_code VARCHAR(100);
	
	-- 계획  커서에 넣을 변수 선언
	DECLARE v_order_list_no VARCHAR(100);
	DECLARE v_order_no VARCHAR(100);
	DECLARE v_prd_code VARCHAR(100);
	DECLARE v_prd_nm VARCHAR(20);
	DECLARE v_prdctn_co INT;
	DECLARE v_order_date DATE;
	DECLARE v_dedt DATE;
	DECLARE v_priort INT;
	
	-- 소모자재 커서에 넣을 변수 선언
	DECLARE v_mtril_code VARCHAR(100);
	DECLARE v_mtril_nm VARCHAR(20);
	DECLARE v_sum_qy INT;
	
	-- 상태표시 변수 선언
	DECLARE v_not_ok INT;
	DECLARE v_com_rol INT;
	
	-- 추가 조회문 변수 선언
	DECLARE v_req_qy INT;
	DECLARE v_matrl_co INT;
	DECLARE v_prdn_co INT;
	DECLARE v_prd_se VARCHAR(20);
	DECLARE v_mtril_qy INT;
	DECLARE v_sfinvc INT;
	DECLARE v_real_qy INT;
	
	-- 생산 계획 커서
	DECLARE cursor_plan CURSOR FOR 
		SELECT pp.order_list_no, pp.order_no, pp.prd_code, pp.prd_nm, pp.prdctn_co, pp.order_date, pp.dedt, pp.priort
		FROM prdctn_plan pp LEFT JOIN prdctn_drct pd ON (pp.mnfct_no = pd.mnfct_no)
		WHERE prdctn_code IS NULL
		GROUP BY order_list_no, order_no, prd_code
		ORDER BY pp.priort;
					
	-- 소모 재료 커서	
	DECLARE cursor_useqy CURSOR FOR
		SELECT mtril_code, mtril_nm, sum(usgqty)
		FROM procs_flowchart fc JOIN procs_matrl mt ON (fc.procs_code = mt.procs_code)
		WHERE prd_code = c_prd_code
		GROUP BY mtril_code
		ORDER BY 1;
	
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
	
	OPEN cursor_plan;
	out_loop: LOOP
		FETCH cursor_plan INTO v_order_list_no, v_order_no, v_prd_code, v_prd_nm, v_prdctn_co, v_order_date, v_dedt, v_priort;
		IF done THEN
			LEAVE out_loop;
		END IF;
					
			-- 커서에 넣을 매개변수 초기화
			SET c_prd_code = v_prd_code;
			-- 자재가 하나라도 비면 표시할 매개변수 초기화
			SET v_not_ok = FALSE;
			-- 반제품 생산 계획 추가시 구분할 매개변수 초기화
			SET c_pdn_plan = 0;
		 
			OPEN cursor_useqy;
			useqy_loop: LOOP
		 		FETCH cursor_useqy INTO v_mtril_code, v_mtril_nm, v_sum_qy;
		 		IF done THEN
		 			LEAVE useqy_loop;
		 		END IF;
		 		
				-- 여기서 부터 변수 지정 안함 
				
				-- 물품 요청 수량 조회
				SELECT IFNULL( SUM(req_qy), 0 )
				INTO v_req_qy
				FROM thng_req
				WHERE prd_code = v_mtril_code
				AND procs_at = 'RD01'
				AND prdctn_code IS NULL; 
				
				-- 자재 조회
				SELECT COUNT( mtril_code )
				INTO v_matrl_co
				FROM mtril
				WHERE mtril_code = v_mtril_code;

				-- 반제품 조회
				SELECT COUNT( prdlst_code )
				INTO v_prdn_co
				FROM prduct_n
				WHERE prdlst_code = v_mtril_code;
				
				-- 자재 일 때
				IF v_matrl_co > 0 AND v_prdn_co = 0 THEN
					SET v_prd_se = 'PI01';
					
					-- 자재 재고 수량 조회
					SELECT IFNULL( SUM(mtril_qy), 0 )
					INTO v_mtril_qy
					FROM mtril_wrhousing 
					WHERE mtril_code = v_mtril_code;
					
					SELECT sfinvc
					INTO v_sfinvc
					FROM mtril
					WHERE mtril_code = v_mtril_code;
					
				-- 반제품 일 때
				ELSEIF v_matrl_co = 0 AND v_prdn_co > 0 THEN
					SET v_prd_se = 'PI02';
					
					-- 반제품 재고 수량 조회
					SELECT IFNULL( SUM(prduct_n_invntry_qy), 0 )
					INTO v_mtril_qy
					FROM prduct_n_wrhousng 
					WHERE pprdlst_code = v_mtril_code;
					
					SELECT sfinvc
					INTO v_sfinvc
					FROM prduct_n
					WHERE prdlst_code = v_mtril_code;
						
				END IF;			-- 자재/ 반제품 구분
				
				-- 재고수량 < (소모수량*주문량) + 요청수량
				IF v_mtril_qy < (v_sum_qy * v_prdctn_co) + v_req_qy THEN
					
					-- 제작이나 발주요청 해야하는 수량 = 0 - (재고 - (소모수량 * 주문량) - 요청수량 - 안전재고)
					SET v_real_qy = 0 - ( v_mtril_qy - ( v_sum_qy * v_prdctn_co ) - v_req_qy - v_sfinvc);
					
					SET v_not_ok = TRUE;
					LEAVE useqy_loop;
									
				END IF;		-- 재고수량 모자랄때
					
			END LOOP useqy_loop;
			CLOSE cursor_useqy;
			
			-- 재고 수량 모자랄때
			IF v_not_ok THEN
				-- 반제품일때
				IF v_prd_se = 'PI02' THEN
					
					-- 반제품 부족 > 반제품 생산계획 등록 후 완전 처음으로 돌아가 ( 커밋 하고 다시 실행)
					CALL insert_in_plan(v_mtril_code, v_mtril_nm, v_real_qy, v_order_list_no, v_order_no, v_order_date, v_dedt, v_priort, v_com_rol);
			
					IF v_com_rol = 1 THEN
						COMMIT;
					ELSE
						ROLLBACK;
					END IF;
				
				-- 자재일때
				ELSE 	
					-- 자재 제작번호 제일 처음으로 구분
					SELECT mnfct_no
					INTO v_mnfct_no
					FROM prdctn_plan
					WHERE order_list_no = v_order_list_no
					ORDER BY 1
					LIMIT 1 OFFSET 0;
					
					INSERT INTO thng_req (req_code, req_name, mnfct_no, prd_code, prd_nm, req_qy, prd_se, procs_at, req_de)
					VALUES ( NEXTVAL(req_seq), '', v_mnfct_no, )
							
				END IF;
				
				SET c_pdn_plan = 1;
				LEAVE out_loop;
				
			ELSE 
				CALL insert_in_drct(v_order_list_no);
				COMMIT;
			END IF;
		
	END LOOP out_loop;
	CLOSE cursor_plan;
	
END //
DELIMITER ;


-- 생산지시 안 프로시저 (생산계획에서 주문에 있는 품목 공정별로 설비 조회해서 가장 빠른 시간으로 할수 있는 설비로 생산지시에 삽입)
DELIMITER //
DROP PROCEDURE IF EXISTS insert_in_drct //

CREATE PROCEDURE insert_in_drct
( 
	OUT c_order_list_no VARCHAR(100)
)
BEGIN
	DECLARE done INT DEFAULT FALSE;
		
	-- 매개변수로 넣을 변수 선언
	DECLARE c_procs_code VARCHAR(100);
	DECLARE c_eqp_code VARCHAR(100);
	
	-- 생산 계획 커서로 넣을 변수 선언
	DECLARE v_mnfct_no INT;
	DECLARE v_procs_code VARCHAR(100);
	DECLARE v_procs_nm VARCHAR(20);
	DECLARE v_prd_code VARCHAR(100);
	DECLARE v_prd_nm VARCHAR(20);
	DECLARE v_prdctn_co INT;
	
	-- 예상 소요 시간 조회
	DECLARE v_expect_reqre_time DOUBLE;
	
	-- 설비 조회 커서로 넣을 변수 선언	
	DECLARE v_eqp_code VARCHAR(100);
	DECLARE v_model_nm VARCHAR(20);
	
	-- 생산 지시 커서로 넣을 변수 선언
	DECLARE v_pre_end_time DATETIME;
	
	-- 점검일정 조회 커서로 넣을 변수 선언
	DECLARE v_chck_de DATE;
	DECLARE v_chck_time VARCHAR(50);
	
	-- 추가로 들어가는 변수 선언
	DECLARE v_begin_time DATETIME;
	DECLARE v_end_time DATETIME;
	DECLARE v_chck_begin DATETIME;
	DECLARE v_chck_end DATETIME;
	DECLARE v_null INT;
	DECLARE v_chck_null INT;
	
	-- 실제로 삽입할 변수 선언
	DECLARE v_real_begin DATETIME;
	DECLARE v_real_end DATETIME;
	DECLARE v_real_code VARCHAR(100);
	DECLARE v_real_nm VARCHAR(20);
	
	-- 주문등록번호로 생산계획 조회 커서
	DECLARE cursor_plan CURSOR FOR 
		SELECT pp.mnfct_no, pp.procs_code, pp.procs_nm, pp.prd_code, pp.prd_nm, pp.prdctn_co
		FROM prdctn_plan pp LEFT JOIN prdctn_drct pd ON (pp.mnfct_no = pd.mnfct_no)
		WHERE prdctn_code IS NULL
		AND pp.order_list_no = c_order_list_no;
	
	-- 공정코드로 가동가능한 설비 조회 커서 
	DECLARE cursor_eqp CURSOR FOR 
		SELECT pm.eqp_code, eqp.model_nm
		FROM procs_mchn pm JOIN eqp ON (pm.eqp_code = eqp.eqp_code)
								 LEFT JOIN not_opr nopr ON (eqp.eqp_code = nopr.eqp_code)
		WHERE procs_code = c_procs_code
		AND (process_step = 'FS02'
		OR not_opr_code IS NULL);
		
	-- 설비코드로 생산지시 조회 마지막 1건만 커서
	DECLARE cursor_drct CURSOR FOR
		SELECT pre_end_time
		FROM prdctn_drct
		WHERE eqp_code = c_eqp_code
		ORDER BY pre_end_time DESC
		LIMIT 1 OFFSET 0;
	
	-- 설비코드로 점검일정 조회 마지막 1건만 커서
	DECLARE cursor_chck CURSOR FOR
		SELECT chck_de, chck_time
		FROM chck_fx
		WHERE eqp_code = c_eqp_code
		ORDER BY chck_de
		LIMIT 1 OFFSET 0;
	
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
	
	-- 생산 계획 커서
	OPEN cursor_plan;
	plan_loop : LOOP
		FETCH cursor_plan INTO v_mnfct_no, v_procs_code, v_procs_nm, v_prd_code, v_prd_nm, v_prdctn_co;
		IF done THEN
			LEAVE plan_loop;
		END IF;
		
		-- 매개변수 초기화 (공정 코드)
		SET c_procs_code = v_procs_code;
		
		-- 예상 소요 시간 조회
		SELECT expect_reqre_time
		INTO v_expect_reqre_time
		FROM procs_flowchart
		WHERE procs_code = c_procs_code;
		
		-- 설비 커서
		OPEN cursor_eqp;
		eqp_loop : LOOP
			FETCH cursor_eqp INTO v_eqp_code, v_model_nm;
			IF done THEN
				LEAVE eqp_loop;
			END IF;
			
			-- 매개변수 초기화 (설비 코드)
			SET c_eqp_code = v_eqp_code;
			-- 생산지시가 없을때 확인할 변수 초기화
			SET v_null = 0 ;
			SET v_chck_null = 0;
			SET v_real_begin = STR_TO_DATE('9999-12-31 23:59:59', '%Y-%m%d %H:%i%s');
						
			-- 생산 지시 커서
			OPEN cursor_drct;
			drct_loop : LOOP
				FETCH cursor_drct INTO v_pre_end_time;
				IF done THEN
					LEAVE drct_loop;
				END IF;
			
				SET v_null = 1;
						
			-- 생산지시 커서 닫음
			END LOOP drct_loop;
			CLOSE cursor_drct;
			
			-- 점검일정 커서
			OPEN cursor_chck;
			chck_loop : LOOP
				FETCH cursor_chck INTO v_chck_de, v_chck_time;
				IF done THEN
					LEAVE chck_loop;
				END IF;
				
				-- STR_TO_DATE(CONCAT(DATE_FORMAT(NOW(), '%Y-%m-%d'), ' ','09:00', ':00'), '%Y-%m-%d %H:%i:%s')
				SET v_chck_null = 1;
				SET v_chck_begin = STR_TO_DATE(CONCAT(DATE_FORMAT(v_chck_de, '%Y-%m-%d'), ' ', LEFT(v_chck_time, 5), ':00'), '%Y-%m-%d %H:%i:%s');
				SET v_chck_end = STR_TO_DATE(CONCAT(DATE_FORMAT(v_chck_de, '%Y-%m-%d'), ' ', RIGHT(v_chck_time, 5), ':00'), '%Y-%m-%d %H:%i:%s');
			
			-- 점검일정 커서 닫음
			END LOOP chck_loop;
			CLOSE cursor_chck;
			
			-- 생산 지시 조회 결과가 있을때
			IF v_null = 1 THEN
				SET v_begin_time = v_pre_end_time;
												
			-- 생산 지시 결과가 없을 때
			ELSE 
			
				SET v_begin_time = DATE_ADD(NOW(), INTERVAL 10 MINUTE);
												
			END IF;
			
			SET v_end_time = DATE_ADD(v_begin_time, INTERVAL (v_expect_reqre_time * v_prdctn_co) MINUTE);
			
			-- 점검 일정이 있을때
			IF v_chck_null = 1 THEN
				
				-- 끝나는 시간이 점검 시간 사이 일 때
				IF v_end_time BETWEEN v_chck_begin AND v_chck_end THEN
					
					-- 점검 끝나는 시간이 작업 시작 시간
					SET v_begin_time = v_chck_end;
					SET v_end_time = DATE_ADD(v_begin_time, INTERVAL (v_expect_reqre_time * v_prdctn_co) MINUTE);
					
				END IF;
										
			END IF;
			
			-- for문 돌려서 직접 넣을 값 선정 (실제로 입력할 값 > 지금 루프 안에서 나온 값)(가장 빠른 일정을 선택하겠다 이말이야)
			IF v_real_begin > v_begin_time THEN
				SET v_real_begin = v_begin_time;
				SET v_real_end = v_end_time;
				SET v_real_code = v_eqp_code;
				SET v_real_nm = v_model_nm;
			END IF;
									
		-- 설비 커서 닫음
		END LOOP eqp_loop;
		CLOSE cursor_eqp;	
		
		INSERT INTO prdctn_drct ( prdctn_code, mnfct_no, procs_code, procs_nm, eqp_code, model_nm, prd_code, prd_nm, prdctn_co, pre_begin_time, pre_end_time)
		VALUES ( IFNULL(CONCAT(v_mnfct_no, '-', v_real_code ), '-') , v_mnfct_no, v_procs_code, v_procs_nm, v_real_code, v_real_nm, v_prd_code, v_prd_nm, v_prdctn_co, v_real_begin, v_real_end );
	
	-- 생산계획 커서 닫음
	END LOOP plan_loop;
	CLOSE cursor_plan;
END //
DELIMITER ;

CALL play_drct();

SELECT * FROM prdctn_plan;
SELECT * FROM prdctn_drct;
SELECT * FROM thng_req;
SELECT * FROM cmmn;

SELECT * FROM repduct;

SELECT prdlst_code, prdlst_name
FROM repduct
WHERE prdlst_name LIKE '%' || '123'