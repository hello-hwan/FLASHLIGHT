devUSE dev;
-- 페이징 -----------------------------------------------------
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


-- 이벤트 스케줄러 ---------------------------------------------
SHOW VARIABLES LIKE 'event%';
SET GLOBAL event_scheduler = ON;
SELECT * FROM information_schema.events;

-- 생산 계획 인서트 하루단위
CREATE EVENT plan_insert
ON SCHEDULE EVERY 1 DAY
STARTS '2025-01-03 07:00:00'
COMMENT '생산 계획 삽입'
DO
CALL insert_plan(); 

DROP EVENT plan_insert;

-- 생산 계획 수정 시간 단위
CREATE EVENT plan_update
ON SCHEDULE EVERY 1 HOUR
STARTS '2025-01-03 11:55:00'
COMMENT '생산 계획 수정 한시간 마다 우선순위-1 '
DO
CALL update_plan();

DROP EVENT plan_update;

-- 생산 지시 삽입 하루 단위
CREATE EVENT drct_insert
ON SCHEDULE EVERY 1 DAY
STARTS '2025-01-03 08:00:00'
COMMENT '생산 지시 삽입'
DO
CALL play_drct();

DROP EVENT drct_insert;

-- 물품 요청 삽입 하루 단위
CREATE EVENT req_insert
ON SCHEDULE EVERY 1 DAY
STARTS '2025-01-03 09:00:00'
COMMENT '물품 요청 삽입'
DO
CALL insert_req();

DROP EVENT req_insert;

-- 시퀀스 생성 ---------------------------------------------
DROP sequence plan_seq;
CREATE sequence plan_seq START WITH 1 increment BY 1;
select NEXTVAL(plan_seq);

DROP sequence req_seq;
CREATE sequence req_seq START WITH 1 increment BY 1;
SELECT NEXTVAL(req_seq);

DROP sequence use_seq;
CREATE sequence use_seq START WITH 1 increment BY 1;
SELECT NEXTVAL(use_seq);



-- 생산 계획 순서 -------------------------------------------
-- 주문리스트에서 처리중, 생산인 품목이랑 수량, 주문번호, 주문일자, 납품기한, 우선순위 조회
-- 공정흐름도에서 품목별 공정 조회
-- 반복문 생산계획 삽입
-- 주문리스트 (주문번호, 품목번호, 품목명, 주문수량, 주문일자, 납품일자, 총 소요시간, 우선순위)

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
		AND order_qy > 0
		AND pp.mnfct_no IS NULL
		ORDER BY 7;
			
    -- 루프 끝날 조건
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
	
	-- 주문 리스트
	OPEN cursor_order;
	out_loop: LOOP
		FETCH cursor_order INTO v_order_list_no, v_order_no, v_prd_code, v_prd_name, v_order_qy, v_order_date, v_dete, v_priort;
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

-- 생산 지시 순서 ------------------------------------------------
-- 지시 안들어간 생산 계획 조회
-- 품목코드랑 주문 수량 가져와서 bom 조회 후 자재량 조회(아니면 공정 흐름도에서 가져와서 예상시간도 함께 조회)
-- 자재 우리가 가지고 있는 총 재고 > bom 자재량* (생산 개수) + 요청물품(미처리)(합)  이면 
-- 공정별 설비 가동 미가동 조회
-- 미가동 상태 아닌 설비 중 첫번째 설비에 생산 지시 하도록
-- 예측 시작 시간 => 

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
		
		IF v_pdn_plan = 0 THEN
			LEAVE play_loop;
		END IF;
	END LOOP play_loop;
END //
DELIMITER ;

CALL play_drct();
CALL insert_req();

SELECT * FROM prdctn_plan;


SELECT * FROM prdctn_drct;
DELETE FROM prdctn_drct WHERE mnfct_no = 26;

COMMIT;

SELECT * FROM thng_req;
DELETE FROM thng_req WHERE mnfct_no = 26;


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
	DECLARE v_mnfct_no INT;
	DECLARE v_req_co INT;
	DECLARE v_plan_co INT;
	
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
		 				
				-- 물품 요청 수량 조회 - 출고 요청만
				SELECT IFNULL( SUM(req_qy), 0 )
				INTO v_req_qy
				FROM thng_req
				WHERE prd_code = v_mtril_code
				AND procs_at = 'RD02'
				AND prdctn_code IS NOT NULL; 
				
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
					
					-- 안전재고 조회
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
					
					-- 안전재고 조회
					SELECT sfinvc
					INTO v_sfinvc
					FROM prduct_n
					WHERE prdlst_code = v_mtril_code;
						
				END IF;			-- 자재/ 반제품 구분
				
				-- 재고수량 < (소모수량*주문량) + 요청수량 + 안전재고
				IF v_mtril_qy < (v_sum_qy * v_prdctn_co) + v_req_qy + v_sfinvc THEN
					
					-- 제작이나 발주요청 해야하는 수량 = 0 - (재고 - (소모수량 * 주문량) - 요청수량 - 안전재고)
					SET v_real_qy = 0 - ( v_mtril_qy - ( v_sum_qy * v_prdctn_co ) - v_req_qy - v_sfinvc);
					
					-- 자재일 때
					IF v_prd_se = 'PI01' THEN 
						
						-- 자재 제작번호 제일 처음으로 구분
						SELECT mnfct_no
						INTO v_mnfct_no
						FROM prdctn_plan
						WHERE order_list_no = v_order_list_no
						ORDER BY 1
						LIMIT 1 OFFSET 0;
					
						-- 자재 요청 일어났는지
						SELECT COUNT(mnfct_no)
						INTO v_req_co
						FROM thng_req
						WHERE prd_code = v_mtril_code
						AND mnfct_no = v_mnfct_no
						AND req_qy = v_real_qy;
					
						-- 요청 안일어났으면
						IF v_req_co = 0 THEN
					
							-- 물품 요청 테이블에 삽입
							INSERT INTO thng_req (req_code, req_name, mnfct_no, prd_code, prd_nm, req_qy, prd_se, procs_at, req_de)
							VALUES ( CONCAT('req-', NEXTVAL(req_seq)), CONCAT(v_mtril_nm, '-', v_real_qy,'-발주요청'), v_mnfct_no, v_mtril_code, v_mtril_nm, v_real_qy, v_prd_se, 'RD03', NOW());
							
							SET v_not_ok = TRUE;

						END IF;						
						
					ELSE
					-- 반제품일 때
					SET v_not_ok = TRUE;
					LEAVE useqy_loop;
					
					END IF;				
				END IF;		-- 재고수량 모자랄때
					
			END LOOP useqy_loop;
			CLOSE cursor_useqy;
			
			SET done = FALSE;
			
			-- 재고 수량 모자랄때
			IF v_not_ok THEN
				-- 반제품일때
				IF v_prd_se = 'PI02' THEN
					
					SELECT COUNT(mnfct_no)
					INTO v_plan_co
					FROM prdctn_plan
					WHERE order_list_no = v_order_list_no
					AND prd_code = v_mtril_code
					AND prdctn_co = v_real_qy;
					
					IF v_plan_co = 0 THEN
						-- 반제품 부족 > 반제품 생산계획 등록 후 완전 처음으로 돌아가 ( 커밋 하고 다시 실행)
						CALL insert_in_plan(v_mtril_code, v_mtril_nm, v_real_qy, v_order_list_no, v_order_no, v_order_date, v_dedt, v_priort, v_com_rol);
			
						IF v_com_rol = 1 THEN
							COMMIT;
						ELSE
							ROLLBACK;
						END IF;
					
						SET c_pdn_plan = 1;
						LEAVE out_loop;
						
					END IF;
							
				END IF;
				
			ELSE 
				START TRANSACTION;
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
	IN c_order_list_no VARCHAR(100)
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
	
	DECLARE v_before DATETIME DEFAULT DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 9 HOUR), INTERVAL 1 DAY);
	
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
		
		SET v_real_begin = STR_TO_DATE('2999-12-31 23:59:59', '%Y-%m-%d %H:%i:%s');
		
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
			
			SET done = FALSE;
			
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
			
			SET done = FALSE;
			
			-- 생산 지시 조회 결과가 있을때 => 바로 뒤 타임 + 1 시간(장비 교체나 뒷정리 시간)
			IF v_null = 1 THEN
				SET v_begin_time = DATE_ADD(v_pre_end_time, INTERVAL 1 HOUR);
												
			-- 생산 지시 결과가 없을 때 => 내일 9시
			ELSE 
			
				SET v_begin_time = DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 9 HOUR), INTERVAL 1 DAY);
												
			END IF;
			
			-- 이전 작업 끝나는 시간이 지금 시작 설정한 시간 보다 클 때
			IF v_before > v_begin_time THEN
			
				SET v_begin_time = v_before;
				
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
		
		SET done = FALSE;
		
		INSERT INTO prdctn_drct ( prdctn_code, mnfct_no, procs_code, procs_nm, eqp_code, model_nm, prd_code, prd_nm, prdctn_co, pre_begin_time, pre_end_time)
		VALUES ( IFNULL(CONCAT(v_mnfct_no, '-', v_real_code ), '-') , v_mnfct_no, v_procs_code, v_procs_nm, v_real_code, v_real_nm, v_prd_code, v_prd_nm, v_prdctn_co, v_real_begin, v_real_end );
		
		SET v_before = v_real_end;
	
	-- 생산계획 커서 닫음
	END LOOP plan_loop;
	CLOSE cursor_plan;
END //
DELIMITER ;

CALL play_drct();

-- 생산 완료 보고로 일어나는 프로시저(물품당) -> 출고 테이블에서 수정, 공정별 사용재료 삽입(동시에 일어나야함)
DELIMITER //
DROP PROCEDURE IF EXISTS play_state //
CREATE PROCEDURE play_state
(
 IN c_prdctn_code VARCHAR(100),
 IN c_matril_code VARCHAR(100),
 IN c_matril_qy INT,
 OUT c_result INT
)
BEGIN
	DECLARE done INT DEFAULT FALSE;
	
	-- 자재, 반제품 구분 변수
	DECLARE v_prd_se VARCHAR(20);
	-- 사용량 처리 변수
	DECLARE v_matril_qy INT;
	-- 실제 처리 되는 내용
	DECLARE v_real_co INT DEFAULT 0;
	DECLARE v_up_co INT;
	DECLARE v_ins_co INT;
	-- 비교 값
	DECLARE v_up_cnt INT DEFAULT 0;
	DECLARE v_ins_cnt INT DEFAULT 0;
	
	-- 커서에 넣을 변수 선언
	DECLARE v_dlivy_no INT;
	DECLARE v_lot VARCHAR(100);
	DECLARE v_name VARCHAR(20);
	DECLARE v_requst_qy INT;
	DECLARE v_usgqty INT;
	DECLARE v_nusgqty INT;
	DECLARE v_usgstt VARCHAR(20);

	-- 생산지시로 일어난 자재  출고 lot
	DECLARE cursor_matrl CURSOR FOR
		SELECT md.dlivy_no, md.mtril_lot, md.mtril_name, md.requst_qy, md.usgqty, md.nusgqty, md.usgstt
		FROM mtril_dlivy md JOIN thng_req tr ON (md.req_code = tr.req_code)
								  LEFT JOIN mtril_wrhousing mw ON (md.mtril_lot = mw.mtril_lot)
		WHERE tr.prdctn_code = c_prdctn_code
		AND tr.prd_code = c_matril_code
		ORDER BY mw.wrhousng_date;
		
	-- 생산지시로 일어난 반제품 출고 lot
	DECLARE cursor_prdn CURSOR FOR 
		SELECT pnd.prduct_n_dlivy_no, pnd.prduct_n_lot, pnd.prduct_n_name, pnd.requst_qy, pnd.usgqty, pnd.nusgqty, pnd.usgstt
		FROM prduct_n_dlivy pnd JOIN thng_req tr ON (pnd.req_code = tr.req_code)
										LEFT JOIN prduct_n_wrhousng pnw ON (pnd.prduct_n_lot = pnw.prduct_n_lot)
		WHERE tr.prdctn_code = c_prdctn_code
		AND tr.prd_code = c_matril_code
		ORDER BY pnw.prduct_n_wrhousng_day;
		
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
	
	SELECT prd_se
	INTO v_prd_se
	FROM thng_req
	WHERE prdctn_code = c_prdctn_code
	AND prd_code = c_matril_code;
	
	-- 내가 넣은 사용량 초기화
	SET v_matril_qy = c_matril_qy;
	
	START TRANSACTION;
	
	IF v_prd_se = 'PI01' THEN
	-- 자재 일때
		OPEN cursor_matrl;
		mt_loop : LOOP
			FETCH cursor_matrl INTO v_dlivy_no, v_lot, v_name, v_requst_qy, v_usgqty, v_nusgqty, v_usgstt;
			IF done THEN
				LEAVE mt_loop;
			END IF;
			
			IF v_matril_qy = 0 THEN
			-- 내가 넣은 사용량 = 0 이면 루프문 빠져 나가기
				LEAVE mt_loop;
			END IF;
			
			SET v_real_co = v_real_co + 1;
			
			IF v_matril_qy >= v_requst_qy THEN
			-- 내가 넣은 사용량 >= 요청수량 이면 
			
			-- 사용재료 테이블에 사용량 = 요청수량 으로 삽입
				INSERT INTO use_mtril(mtril_no, thng_lot, mtril_code,	mtril_nm, mtril_se, qy, prdctn_code, dlivy_no)
				VALUES (NEXTVAL(use_seq), v_lot, c_matril_code, v_name, v_prd_se, v_requst_qy, c_prdctn_code, v_dlivy_no);
				
				SELECT ROW_COUNT()
				INTO v_ins_co;
				
			
			-- 출고 테이블에 사용량 = 요청수량, 미사용량 = 0 으로 수정 
				UPDATE mtril_dlivy
				SET usgstt = 'MU01', usgqty = v_requst_qy, nusgqty = 0
				WHERE dlivy_no = v_dlivy_no;
				
				SELECT ROW_COUNT()
				INTO v_up_co;
			
			-- 내가 넣은 사용량 = 사용량 - 요청수량				
				SET v_matril_qy = v_matril_qy - v_requst_qy;
				
			ELSE
			-- 내가 넣은 사용량 < 요청수량 이면 
				
			-- 사용재료 테이블에 사용량 = 내가 넣은 사용량 으로 삽입
				INSERT INTO use_mtril(mtril_no, thng_lot, mtril_code,	mtril_nm, mtril_se, qy, prdctn_code, dlivy_no)
				VALUES (NEXTVAL(use_seq), v_lot, c_matril_code, v_name, v_prd_se, v_matril_qy, c_prdctn_code, v_dlivy_no);
				
				SELECT ROW_COUNT()
				INTO v_ins_co;
				
			-- 출고 테이블에 사용량 = 내가 넣은 사용량 , 미사용량 = 요청수량 - 내가 넣은 사용량  으로 수정 
				UPDATE mtril_dlivy
				SET usgstt = 'MU01', usgqty = v_matril_qy, nusgqty = v_requst_qy - v_matril_qy
				WHERE dlivy_no = v_dlivy_no;
				
				SELECT ROW_COUNT()
				INTO v_up_co;
				
			-- 내가 넣은 사용량 = 0
				SET v_matril_qy = 0;
				
			END IF;
			
			SET v_ins_cnt = v_ins_cnt + v_ins_co;
			SET v_up_cnt = v_up_cnt + v_up_co;
			
		END LOOP mt_loop;
		CLOSE cursor_matrl;
		
	ELSE
	-- 반제품 일때
		OPEN cursor_prdn;
		prdn_loop : LOOP
			FETCH cursor_prdn INTO v_dlivy_no, v_lot, v_name, v_requst_qy, v_usgqty, v_nusgqty, v_usgstt;
			IF done THEN
				LEAVE prdn_loop;
			END IF;
			
			IF v_matril_qy = 0 THEN
			-- 내가 넣은 사용량 = 0 이면 루프문 빠져 나가기
				LEAVE prdn_loop;	
			END IF;
			
			SET v_real_co = v_real_co + 1;
			
			IF v_matril_qy >= v_requst_qy THEN
			-- 내가 넣은 사용량 >= 요청수량 이면 
			
			-- 사용재료 테이블에 사용량 = 요청수량 으로 삽입
				INSERT INTO use_mtril(mtril_no, thng_lot, mtril_code,	mtril_nm, mtril_se, qy, prdctn_code, dlivy_no)
				VALUES (NEXTVAL(use_seq), v_lot, c_matril_code, v_name, v_prd_se, v_requst_qy, c_prdctn_code, v_dlivy_no);
				
				SELECT ROW_COUNT()
				INTO v_ins_co;	
			
			-- 출고 테이블에 사용량 = 요청수량, 미사용량 = 0 으로 수정 
				UPDATE prduct_n_dlivy
				SET usgstt = 'MU01', usgqty = v_requst_qy, nusgqty = 0
				WHERE prduct_n_dlivy_no = v_dlivy_no;
				
				SELECT ROW_COUNT()
				INTO v_up_co;
				
			-- 내가 넣은 사용량 = 사용량 - 요청수량				
				SET v_matril_qy = v_matril_qy - v_requst_qy;
			
			ELSE
			-- 내가 넣은 사용량 < 요청수량 이면 
				
			-- 사용재료 테이블에 사용량 = 내가 넣은 사용량 으로 삽입
				INSERT INTO use_mtril(mtril_no, thng_lot, mtril_code,	mtril_nm, mtril_se, qy, prdctn_code, dlivy_no)
				VALUES (NEXTVAL(use_seq), v_lot, c_matril_code, v_name, v_prd_se, v_matril_qy, c_prdctn_code, v_dlivy_no);
				
				SELECT ROW_COUNT()
				INTO v_ins_co;	
				
			-- 출고 테이블에 사용량 = 내가 넣은 사용량 , 미사용량 = 요청수량 - 내가 넣은 사용량  으로 수정 
				UPDATE prduct_n_dlivy
				SET usgstt = 'MU01', usgqty = v_matril_qy, nusgqty = v_requst_qy - v_matril_qy
				WHERE prduct_n_dlivy_no = v_dlivy_no;
				
				SELECT ROW_COUNT()
				INTO v_up_co;
				
			-- 내가 넣은 사용량 = 0
				SET v_matril_qy = 0;
				
			END IF;
			
			SET v_ins_cnt = v_ins_cnt + v_ins_co;
			SET v_up_cnt = v_up_cnt + v_up_co;
		
		END LOOP prdn_loop;
		CLOSE cursor_prdn;
			
	END IF;
	
	IF v_real_co = v_ins_cnt AND v_real_co = v_up_cnt THEN
		COMMIT;
		SELECT 1 AS result;
	ELSE
		ROLLBACK;
		SELECT 0 AS result;
	END IF;
	
END //
DELIMITER ;

-- 물품 요청 프로시저
DELIMITER //
DROP PROCEDURE IF EXISTS insert_req //
CREATE PROCEDURE insert_req()
BEGIN

	-- 커서 종료 변수 선언
	DECLARE done INT DEFAULT FALSE;
	
	-- 생산지시에 넣을 커서 선언
	DECLARE v_prdctn_code VARCHAR(100);
	DECLARE v_mnfct_no INT;
	DECLARE v_procs_code VARCHAR(100);
	DECLARE v_prd_code VARCHAR(100);
	DECLARE v_prd_nm VARCHAR(20);
	DECLARE v_prdctn_co INT;
	DECLARE v_rate DOUBLE;
	
	-- 공정별 재료 커서에 넣을 변수 선언
	DECLARE v_mtril_code VARCHAR(100);
	DECLARE v_mtril_nm VARCHAR(20);
	DECLARE v_usgqty INT;
	
	-- 추가 조회문 담을 변수 선언
	DECLARE v_prdn INT;
	DECLARE v_matrl INT;
	DECLARE v_se VARCHAR(20);
	DECLARE v_real_qy INT;
	DECLARE v_row INT;
	DECLARE v_real INT DEFAULT 0;
	DECLARE v_total INT DEFAULT 0;
	
	-- 생산 지시 커서(내일 9시 부터 모레 9시 까지, 생산지시가 안일어났고, 물품 요청이 없는 거)
	DECLARE cursor_drct CURSOR FOR 
		SELECT pd.prdctn_code, pd.mnfct_no, pd.procs_code, pd.prd_code, pd.prd_nm, pd.prdctn_co, 1 + ps.badn / (ps.nrmlt + ps.badn) AS rate
		FROM prdctn_drct pd LEFT JOIN product_state ps ON (pd.prdctn_code = ps.prdctn_code)
						  		  LEFT JOIN thng_req tr ON (pd.prdctn_code = tr.prdctn_code)
		WHERE ps.prdctn_code IS NULL
		AND tr.req_code IS NULL
		AND pd.pre_begin_time BETWEEN DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 9 HOUR), INTERVAL 1 DAY) AND DATE_ADD(DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 9 HOUR), INTERVAL 1 DAY), INTERVAL 1 DAY);
	
	-- 공정별 재료 커서	
	DECLARE cursor_mtril CURSOR FOR
		SELECT pm.mtril_code, pm.mtril_nm, pm.usgqty
		FROM procs_matrl pm
		WHERE pm.procs_code = v_procs_code;
	
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
	
	START TRANSACTION;
	-- 생산지시 커서 오픈
	OPEN cursor_drct;
	loop_drct: LOOP
		FETCH cursor_drct INTO v_prdctn_code, v_mnfct_no, v_procs_code, v_prd_code, v_prd_nm, v_prdctn_co, v_rate;
		IF done THEN
			leave loop_drct;
		END IF;
		
		-- 공정별 재료 커서 오픈
		OPEN cursor_mtril;
		loop_mtril: LOOP
			FETCH cursor_mtril INTO v_mtril_code, v_mtril_nm, v_usgqty;
			IF done THEN
				leave loop_mtril;
			END IF;
			
			-- 자재 인지 검색
			SELECT COUNT(mt.mtril_code)
			INTO v_matrl
			FROM mtril mt
			WHERE mt.mtril_code = v_mtril_code;
			
			-- 반제품 인지 검색
			SELECT COUNT(pn.prdlst_code)
			INTO v_prdn
			FROM prduct_n pn
			WHERE pn.prdlst_code = v_mtril_code;
			
			-- 자재일때
			IF v_matrl > 0 AND v_prdn = 0 THEN
				SET v_se = 'PI01';
					
			-- 반제품일때			
			ELSEIF v_matrl = 0 AND v_prdn > 0 THEN
				SET v_se = 'PI02';
				
			END IF;
			
			-- 불량률이 1이거나 null일때 1.1로 설정
			IF v_rate = 1.0 OR v_rate IS NULL THEN
				SET v_rate = 1.1;
				
			END IF;
			
			-- 실제로 출고 요청할 수량 = 소모수량 * 생산수량 * 불량률
			SET v_real_qy = CEIL(v_usgqty * v_prdctn_co * v_rate);
			
			-- 물품 요청 삽입
			INSERT INTO thng_req(req_code, req_name, mnfct_no, prdctn_code, prd_code, prd_nm, req_qy, prd_se, procs_at, req_de)
			VALUES (CONCAT('req-', NEXTVAL(req_seq)), CONCAT(v_mtril_code, '-출고요청'), v_mnfct_no, v_prdctn_code, v_mtril_code, v_mtril_nm, v_real_qy, v_se, 'RD02', NOW());
			
			SELECT ROW_COUNT()
			INTO v_row;
			
			SET v_real = v_real + v_row;
			SET v_total = v_total + 1;
				
		-- 공정별 재료 커서 클로즈		
		END LOOP loop_mtril;
		CLOSE cursor_mtril;
		
		SET done = FALSE;	
		
	-- 생산지시 커서 클로즈
	END LOOP loop_drct;
	CLOSE cursor_drct;
	
	IF v_real = v_total THEN
		COMMIT;
	ELSE 
		ROLLBACK;
	END IF;
		
END //
DELIMITER ;


-- 실행문 -------------------------------------------------------------------------------------
DELETE FROM thng_req WHERE req_code = 'req-577077';
-- 생산 계획 ----------------------------------------
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


-- 생산 지시 ----------------------------------------
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


-- 단순 실행문 -------------------------------------------

SELECT * FROM prdctn_drct;

SELECT * FROM thng_req;
INSERT INTO thng_req(req_code, req_name, mnfct_no, prdctn_code, prd_code, prd_nm, req_qy, prd_se, procs_at, req_de)
VALUES ('testbyshun-6', '자재 출고 요청 테스트', 1, 'testbyshun-11', 'M-LEATER', '가죽', 900, 'PI01','RD02', NOW());
COMMIT;      

SELECT ps.prdctn_code, pd.procs_code, ps.procs_nm, ps.eqp_code, ps.begin_time, ps.end_time, ps.empl_no, ps.empl_nm, ps.nrmlt, ps.badn
FROM product_state ps LEFT JOIN prdctn_drct pd ON (ps.prdctn_code = pd.prdctn_code)
WHERE ps.end_time IS NOT NULL
AND pd.procs_code LIKE CONCAT('%', ?, '%')
AND ps.empl_no LIKE CONCAT('%', ?, '%')
AND ps.end_time LIKE CONCAT('%', ?, '%');


SELECT ps.procs_nm, ps.prdctn_co, ps.empl_nm, ps.end_time
FROM product_state ps JOIN prdctn_drct pd ON (ps.prdctn_code = pd.prdctn_code)
							 LEFT JOIN prdctn_plan pp ON (pd.mnfct_no = pp.mnfct_no)
WHERE ps.prd_code = 'aaa-1'
AND   pp.order_no = 'test';

SELECT * FROM prdctn_plan;
SELECT * FROM prdctn_drct;
SELECT * FROM product_state;

SELECT pd.prdctn_code, pd.mnfct_no, pd.procs_code, pd.procs_nm, pd.eqp_code, pd.model_nm, pd.prd_code, pd.prd_nm, pd.prdctn_co, pd.pre_begin_time, pd.pre_end_time, pp.order_no
FROM prdctn_drct pd JOIN prdctn_plan pp ON (pd.mnfct_no = pp.mnfct_no)
WHERE pd.prdctn_code = ?;

DELETE FROM product_state
WHERE prdctn_code = 'testbyshun-11';
COMMIT;

SELECT prdlst_code, prdlst_name
FROM repduct
WHERE prdlst_name LIKE CONCAT('%', '케이스', '%');

SELECT ps.prdctn_code, pd.procs_code, ps.procs_nm, ps.prd_code, pd.prd_nm, ps.prdctn_co, ps.eqp_code, ps.begin_time, ps.end_time, ps.empl_no, ps.empl_nm, ps.nrmlt, ps.badn, tr.prd_code AS matril_code, tr.prd_nm AS matril_nm, tr.req_qy
FROM product_state ps JOIN prdctn_drct pd ON (ps.prdctn_code = pd.prdctn_code)
							 JOIN thng_req tr ON (ps.prdctn_code = tr.prdctn_code)
WHERE ps.prd_code LIKE CONCAT('%', ?, '%')
AND (pd.pre_begin_time BETWEEN ? AND DATE_ADD( ?, INTERVAL 1 DAY)
     OR pd.pre_end_time BETWEEN ? AND DATE_ADD( ?, INTERVAL 1 DAY) )
GROUP BY pd.eqp_code, pd.model_nm, pd.prdctn_code
ORDER BY pd.model_nm, pd.pre_begin_time;

SELECT procs_code, procs_nm
FROM procs_flowchart
WHERE procs_nm LIKE CONCAT('%', ?, '%')
OR procs_code LIKE CONCAT('%', ?, '%') ;

DELETE FROM prdctn_drct WHERE MNFCT_NO IN (26, 27);
COMMIT;

DELETE FROM thng_req WHERE mnfct_no = 26;

SELECT * FROM mtril_wrhousing;

CALL insert_req();

SELECT * FROM procs_flowchart;

SELECT * FROM order_lists ORDER BY 1;

SELECT DATE_ADD('2025-03-05 00:00:00', INTERVAL (3354) HOUR);

CALL play_drct();

SELECT * FROM procs_flowchart WHERE procs_code = 'C-I13P-1001-1';

SELECT * FROM prdctn_drct;
COMMIT;

SELECT * from prdctn_drct;

SELECT DATE_ADD('2024-12-30', INTERVAL 7 DAY);

SELECT * FROM product_state;

DELETE FROM product_state WHERE prdctn_code = '26-mchn-1';

COMMIT;

SELECT * FROM prdctn_drct;

DELETE FROM prdctn_drct WHERE mnfct_no IN (26,27);

SELECT * FROM prdctn_plan;

DELETE FROM prdctn_plan WHERE mnfct_no IN (1001,1002, 1003, 1004);

SELECT * FROM repduct;

SELECT * FROM prduct_wrhousng WHERE prdlst_c_code = 'C-GS21P-1001';

SELECT * FROM order_lists;

SELECT * FROM cmmn WHERE cmmn_code = 'OD01';

CALL insert_plan();

CALL play_drct();

CALL insert_req();

SELECT * FROM product_state;

SELECT * FROM badn_info;

DELETE FROM badn_info WHERE badn_code = '1005-mchn-1-1';

DELETE FROM product_state WHERE prdctn_code = '1005-mchn-1';

SELECT * FROM thng_req WHERE req_name LIKE '%출고요청%';

DELETE FROM thng_req WHERE req_name LIKE '%출고요청%';

UPDATE product_state SET end_time = NULL, nrmlt = NULL, badn = NULL WHERE prdctn_code = '1005-mchn-1';

SELECT md.dlivy_no, md.mtril_lot, md.mtril_name, md.requst_qy, md.usgqty, md.nusgqty, md.usgstt
FROM mtril_dlivy md JOIN thng_req tr ON (md.req_code = tr.req_code)
								    LEFT JOIN mtril_wrhousing mw ON (md.mtril_lot = mw.mtril_lot)
WHERE tr.prdctn_code = '1005-mchn-1'
AND tr.prd_code = 'M-LEATHER'
ORDER BY mw.wrhousng_date;

SELECT * FROM use_mtril;

DELETE FROM use_mtril;
SELECT * FROM prdctn_drct;


CALL insert_plan();
SELECT * FROM prdctn_plan;
CALL play_drct();
SELECT * FROM prdctn_drct;
SELECT * FROM thng_req;
SELECT * FROM procs_flowchart pf JOIN procs_matrl pl ON (pf.procs_code = pl.procs_code)
                              JOIN procs_mchn  pm ON (pf.procs_code = pm.procs_code);

SELECT * FROM procs_flowchart;
SELECT * FROM procs_matrl;
SELECT * FROM procs_mchn;

SELECT pm.eqp_code, eqp.model_nm
		FROM procs_mchn pm JOIN eqp ON (pm.eqp_code = eqp.eqp_code)
								 LEFT JOIN not_opr nopr ON (eqp.eqp_code = nopr.eqp_code)
		WHERE (process_step = 'FS02'
		OR not_opr_code IS NULL);

SELECT * FROM order_lists WHERE process_status = 'OD02' ORDER BY 1;

INSERT INTO order_lists();

가용 가능한거 숫자 => 재고수량 + 생산 처리중 숫자 합 - 안전재고 - 나가야할 처리중인 주문량 합;

COMMIT;
SELECT SUM(a.total)
FROM (SELECT SUM(DISTINCT(totqy)) AS total
      FROM order_lists
      WHERE process_status = 'OD02'
      AND prd_code = 'C-I13P-1001'
      GROUP BY prd_code, order_no) a;

SELECT * FROM cmmn WHERE cmmn_code = 'OD02';
