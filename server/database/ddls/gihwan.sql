CALL p_insert_order_info ("ORDER-11","2024-12-18","2025-07-04","BCNC-01",NULL,"ORDER-11-1","PRD-01",300,100);

DELIMITER //
CREATE PROCEDURE p_insert_order_info 
(IN p_order_no VARCHAR(100), IN p_order_date DATE, 
 IN p_dete DATE, IN p_p_code VARCHAR(100), IN p_wrter VARCHAR(20), 
 IN p_order_list_no VARCHAR(100), IN p_prd_code VARCHAR(100), 
 IN p_untpc INT, IN p_order_qy INT 
)
BEGIN
    DECLARE v_process_status CHAR(20); -- 처리중/처리완료
    DECLARE v_prdctn_at CHAR(20); -- 생산/미생산
    DECLARE v_prd_name VARCHAR(20); -- 거래처명
    
    DECLARE v_order_no_check INT; -- 주문번호 중복체크
    
    DECLARE v_current_inventory INT; -- 현재 재고수량
    DECLARE v_safe_inventory INT; -- 안전재고수량
    DECLARE v_delivery_qy INT; -- 제품 출고수량

    DECLARE v_processing_qy INT; -- 현재 처리중인 제품수량
    DECLARE v_total_qy INT; -- 현재 사용가능한 재고 수량
    
    DECLARE v_prd_qy INT; -- 생산수량
    
    -- 입력시에는 처리중 상태로 입력
    SET v_process_status = 'OD01';
    
    -- 주문번호가 중복되는지 확인하기 위해 등록된 주문번호 수량 체크
	 SELECT COUNT(order_no)
    INTO v_order_no_check
    FROM order_requst
    WHERE order_no = p_order_no;
    
    -- 주문번호 수량이 0으로 중복되지 않으면 주문요청 등록
    IF v_order_no_check = 0 THEN
        INSERT INTO order_requst(order_no, order_date, dete, p_code, wrter)
        VALUES(p_order_no, p_order_date, p_dete, p_p_code, p_wrter);
    END IF;
    
    
    -- 제품명, 안전재고 수량 변수에 담기
    SELECT prdlst_name, sfinvc
    INTO v_prd_name, v_safe_inventory
    FROM repduct
    WHERE prdlst_code = p_prd_code;
    
    -- 현재 제품 재고량 변수에 담기
    SELECT IFNULL( SUM( prduct_invntry_qy ), 0)
    INTO v_current_inventory
    FROM prduct_wrhousng
    WHERE prduct_name = v_prd_name;
    
    -- 현재까지 등록되고 처리중인 제품 수량 변수에 담기
    SELECT IFNULL( SUM( order_qy ), 0 )
    INTO v_processing_qy
    FROM order_lists
    WHERE prd_code = p_prd_code
      AND process_status = 'OD01';
    
    -- 현재 사용가능한 제품수량 변수에 담기
    SET v_total_qy = IFNULL(v_current_inventory,0) - IFNULL(v_safe_inventory,0) - IFNULL(v_processing_qy,0);
    
    -- 생산해야 되는 수량과 미생산 수량 구분하여 등록
    -- 현재 사용가능한 재고가 생산수량보다 많더라도, 생산중인 수량에 0이라고 넣을것. 미생산 수량이 0이면 넣지말것
    
    -- 현재 재고수량이 주문수량 보다 많으면 생산수량 0으로 변경, 아니면 수량 차이나는만큼 생산
    IF v_total_qy >=  p_order_qy THEN
        SET v_prd_qy = 0;
    ELSE 
        SET v_prd_qy = p_order_qy - v_total_qy;
    END IF;
    
    -- 생산 수량 입력
    SET v_prdctn_at = 'OP01';
    INSERT INTO order_lists(order_list_no, prd_code, order_no, prd_name, untpc, order_qy, splpc, taxamt, smprice, process_status, prdctn_at)
    VALUES(p_order_list_no, p_prd_code, p_order_no, v_prd_name, p_untpc, v_prd_qy, p_untpc + p_order_qy, ( p_untpc + p_order_qy ) * 0.1, ( p_untpc + p_order_qy ) * 1.1, v_process_status, v_prdctn_at );
    
    -- 현재 재고 수량이 0이면 입력 안하도록 작성, 현재 재고수량이 주문수량보다 많으면 주문수량만큼 미생산으로 입력
	 IF v_total_qy > 0 THEN
        IF v_total_qy >=  p_order_qy THEN
            SET v_prd_qy = p_order_qy;
        ELSE
            SET v_prd_qy = v_total_qy;
        END IF;
        
        -- 미생산 수량 입력
        SET v_prdctn_at = 'OP02';
        INSERT INTO order_lists(order_list_no, prd_code, order_no, prd_name, untpc, order_qy, splpc, taxamt, smprice, process_status, prdctn_at)
        VALUES(p_order_list_no, p_prd_code, p_order_no, v_prd_name, p_untpc, v_prd_qy, p_untpc + p_order_qy, ( p_untpc + p_order_qy ) * 0.1, ( p_untpc + p_order_qy ) * 1.1, v_process_status, v_prdctn_at );
    END IF;
	 
	 COMMIT;
END //
DELIMITER ;

drop procedure p_insert_order_info;
CALL p_insert_order_info ();

DELIMITER //
CREATE TRIGGER t_order_list_process
AFTER INSERT ON prduct_dlivy FOR EACH ROW
BEGIN 
    DECLARE v_delivery_qy INT;  -- 출고량
    
    DECLARE v_order_qy_prd INT; -- 주문량 (생산 수량)
    DECLARE v_order_qy_prdnot INT; -- 주문량 (미생산 수량)
    
    -- 주문량 (생산 수량)
    SELECT order_qy
    INTO v_order_qy_prd
    FROM order_lists
    WHERE order_list_no = NEW.order_list_no
      AND prdctn_at = 'OP01';
    
    -- 주문량 (미생산 수량)
    SELECT order_qy
    INTO v_order_qy_prdnot
    FROM order_lists
    WHERE order_list_no = NEW.order_list_no
      AND prdctn_at = 'OP02';
    
    -- 출고량 (같은 주문목록번호의 출고된 수량 합계)
    SELECT IFNULL( SUM( dlivy_sttus), 0 )
    INTO v_delivery_qy
    FROM prduct_dlivy
    WHERE order_list_no = NEW.order_list_no;
    
    -- 출고량이 총생산수량( 생산수량 + 미생산수량 ) 보다 많으면 전부 처리 완료, 출고량이 미생산수량보다 많으면 미생산 수량부터 출고완료, 아니면 처리중
    IF v_delivery_qy >= v_order_qy_prd + v_order_qy_prdnot THEN 
        UPDATE order_lists
        SET process_status = 'OD02'
        WHERE order_list_no = NEW.order_list_no;
    ELSEIF v_delivery_qy >= v_order_qy_prdnot THEN
        UPDATE order_lists
        SET process_status = 'OD02'
        WHERE order_list_no = NEW.order_list_no
          AND prdctn_at = 'OP02';
    END IF;
END //
DELIMITER ;

drop procedure p_insert_order_info;



DELIMITER //
CREATE PROCEDURE p_insert_order_info 
(IN p_order_no VARCHAR(100), IN p_order_date DATE, 
 IN p_dete DATE, IN p_p_code VARCHAR(100), IN p_wrter VARCHAR(20), 
 IN p_order_list_no VARCHAR(100), IN p_prd_code VARCHAR(100), 
 IN p_untpc INT, IN p_order_qy INT 
)
BEGIN
    DECLARE v_process_status CHAR(20); -- 처리중/처리완료
    DECLARE v_prdctn_at CHAR(20); -- 생산/미생산
    DECLARE v_prd_name VARCHAR(20); -- 거래처명
    
    DECLARE v_order_no_check INT; -- 주문번호 중복체크
    
    DECLARE v_current_inventory INT; -- 현재 재고수량
    DECLARE v_safe_inventory INT; -- 안전재고수량
    DECLARE v_delivery_qy INT; -- 제품 출고수량
    
    DECLARE v_processing_qy INT; -- 현재 처리중인 제품수량
    DECLARE v_total_qy INT; -- 현재 사용가능한 재고 수량
    
    DECLARE v_prd_qy INT; -- 생산수량
    
    -- 입력시에는 처리중 상태로 입력
    SET v_process_status = 'OD01';
    
    -- 주문번호가 중복되는지 확인하기 위해 등록된 주문번호 수량 체크
	 SELECT COUNT(order_no)
    INTO v_order_no_check
    FROM order_requst
    WHERE order_no = p_order_no;
    
    -- 주문번호 수량이 0으로 중복되지 않으면 주문요청 등록
    IF v_order_no_check = 0 THEN
        INSERT INTO order_requst(order_no, order_date, dete, p_code, wrter)
        VALUES(p_order_no, p_order_date, p_dete, p_p_code, p_wrter);
    END IF;
    
    -- 제품명, 안전재고 수량 변수에 담기
    SELECT prdlst_name, sfinvc
    INTO v_prd_name, v_safe_inventory
    FROM repduct
    WHERE prdlst_code = p_prd_code;
    
    -- 현재 제품 재고량 변수에 담기
    SELECT IFNULL( SUM( prduct_invntry_qy ), 0)
    INTO v_current_inventory
    FROM prduct_wrhousng
    WHERE prduct_name = v_prd_name;
    
    -- 현재까지 등록되고 처리중인 제품 수량 변수에 담기
    SELECT IFNULL( SUM( order_qy ), 0 )
    INTO v_processing_qy
    FROM order_lists
    WHERE prd_code = p_prd_code
      AND process_status = 'OD01';
    
    -- 현재 사용가능한 제품수량 변수에 담기
    SET v_total_qy = IFNULL(v_current_inventory,0) - v_safe_inventory - v_processing_qy ;
    
    -- 생산해야 되는 수량과 미생산 수량 구분하여 등록
    -- 현재 사용가능한 재고가 생산수량보다 많더라도, 생산중인 수량에 0이라고 넣을것. 미생산 수량이 0이면 넣지말것
    
    -- 현재 재고수량이 주문수량 보다 많으면 생산수량 0으로 변경, 아니면 수량 차이나는만큼 생산
    SET v_prd_qy = p_order_qy;
    
    IF v_total_qy >=  p_order_qy THEN
        SET v_prd_qy = 0;
	ELSEIF v_total_qy < 0 THEN
        SET v_prd_qy = p_order_qy;
    ELSE
        SET v_prd_qy = p_order_qy - v_total_qy;
    END IF;
    
    -- 생산 수량 입력
    SET v_prdctn_at = 'OP01';
    INSERT INTO order_lists(order_list_no, prd_code, order_no, prd_name, untpc, order_qy, splpc, taxamt, smprice, process_status, prdctn_at,totqy)
    VALUES(p_order_list_no, p_prd_code, p_order_no, v_prd_name, p_untpc, v_prd_qy, p_untpc * p_order_qy, ( p_untpc * p_order_qy ) * 0.1, ( p_untpc * p_order_qy ) * 1.1, v_process_status, v_prdctn_at,p_order_qy );
    
    -- 현재 재고 수량이 0이면 입력 안하도록 작성, 현재 재고수량이 주문수량보다 많으면 주문수량만큼 미생산으로 입력
	 IF v_total_qy > 0 THEN
        IF v_total_qy >=  p_order_qy THEN
            SET v_prd_qy = p_order_qy;
        ELSE
            SET v_prd_qy = v_total_qy;
        END IF;
        
        -- 미생산 수량 입력
        SET v_prdctn_at = 'OP02';
        INSERT INTO order_lists(order_list_no, prd_code, order_no, prd_name, untpc, order_qy, splpc, taxamt, smprice, process_status, prdctn_at,totqy)
        VALUES(p_order_list_no, p_prd_code, p_order_no, v_prd_name, p_untpc, v_prd_qy, p_untpc * p_order_qy, ( p_untpc * p_order_qy ) * 0.1, ( p_untpc * p_order_qy ) * 1.1, v_process_status, v_prdctn_at,p_order_qy );
    END IF;
	 
	 COMMIT;
END //
DELIMITER ;

CALL p_insert_order_info ("ORDER-15","2024-12-18","2025-07-04","BCNC-01",NULL,"ORDER-15-1","PRD-01",300,100);


drop procedure p_insert_order_info;  
DELIMITER //
CREATE PROCEDURE p_insert_order_info 
(IN p_order_no VARCHAR(100), IN p_order_date DATE, 
 IN p_dete DATE, IN p_p_code VARCHAR(100), IN p_wrter VARCHAR(20), 
 IN p_order_list_no VARCHAR(100), IN p_prd_code VARCHAR(100), 
 IN p_untpc INT, IN p_order_qy INT 
)
PROC_BODY : BEGIN
    DECLARE v_process_status CHAR(20); -- 처리중/처리완료
    DECLARE v_prdctn_at CHAR(20); -- 생산/미생산
    DECLARE v_prd_name VARCHAR(20); -- 거래처명
    
    DECLARE v_order_no_check INT; -- 주문번호 중복체크
    
    DECLARE v_current_inventory INT; -- 현재 재고수량
    DECLARE v_safe_inventory INT; -- 안전재고수량
    DECLARE v_total_order_qy INT; -- 제품 총주문수량
    
    DECLARE v_processing_qy INT; -- 현재 처리중인 제품수량
    DECLARE v_total_qy INT; -- 현재 사용가능한 재고 수량
    
    DECLARE v_prd_qy INT; -- 생산수량
    
    -- 입력시에는 처리중 상태로 입력
    SET v_process_status = 'OD01';
    
    -- 주문번호가 중복되는지 확인하기 위해 등록된 주문번호 수량 체크
	 SELECT COUNT(order_no)
    INTO v_order_no_check
    FROM order_requst
    WHERE UPPER(order_no) = UPPER(p_order_no);
    
    -- 주문번호 수량이 0으로 중복되지 않으면 주문요청 등록
    IF v_order_no_check = 0 THEN
        INSERT INTO order_requst(order_no, order_date, dete, p_code, wrter)
        VALUES(p_order_no, p_order_date, p_dete, p_p_code, p_wrter);
    END IF;
    
    -- 제품명, 안전재고 수량 변수에 담기
    SELECT prdlst_name, sfinvc
    INTO v_prd_name, v_safe_inventory
    FROM repduct
    WHERE UPPER(prdlst_code) = UPPER(p_prd_code);
    
    -- 현재 제품 재고량 변수에 담기
    SELECT IFNULL( SUM( prduct_invntry_qy ), 0)
    INTO v_current_inventory
    FROM prduct_wrhousng
    WHERE UPPER(prduct_name) = UPPER(v_prd_name);
    
    -- 현재 제품 총 주문량 변수에 담기
    SELECT IFNULL( SUM( totqy ) , 0)
    INTO v_total_order_qy
    FROM order_lists
    WHERE UPPER(prd_code)= UPPER(p_prd_code)
     AND UPPER(process_status) = 'OD01';
    
    -- 현재까지 등록되고 처리중인 제품 수량 변수에 담기
    SELECT IFNULL( SUM( order_qy ), 0 )
    INTO v_processing_qy
    FROM order_lists
    WHERE UPPER(prd_code) = UPPER(p_prd_code)
      AND UPPER(process_status) = 'OD01';
    
    -- 현재 사용가능한 제품수량 변수에 담기
    SET v_total_qy = IFNULL(v_current_inventory,0) - v_safe_inventory - v_processing_qy ;
    
    -- 생산해야 되는 수량과 미생산 수량 구분하여 등록
    -- 현재 사용가능한 재고가 생산수량보다 많더라도, 생산중인 수량에 0이라고 넣을것. 미생산 수량이 0이면 넣지말것
    
    -- 현재 재고수량이 주문수량 보다 많으면 생산수량 0으로 변경, 아니면 수량 차이나는만큼 생산
    IF v_total_qy >=  p_order_qy THEN
        SET v_prd_qy = 0;
		SELECT CONCAT(v_prd_qy, ' & CASE 1 & ',v_processing_qy) AS result;
        LEAVE PROC_BODY; 
    ELSEIF 0 <= v_total_qy < p_order_qy THEN
        SET v_prd_qy = p_order_qy - v_total_qy;
	    SELECT CONCAT(v_prd_qy, ' & CASE 2 & ',v_processing_qy) AS result;
        LEAVE PROC_BODY; 
	ELSE 
        SET v_prd_qy = p_order_qy;
		SELECT CONCAT(v_prd_qy, ' & CASE 3 & ',v_processing_qy) AS result;
        LEAVE PROC_BODY; 
    END IF;
    
    -- 생산 수량 입력
    SET v_prdctn_at = 'OP01';
    INSERT INTO order_lists(order_list_no, prd_code, order_no, prd_name, untpc, order_qy, splpc, taxamt, smprice, process_status, prdctn_at,totqy)
    VALUES(p_order_list_no, p_prd_code, p_order_no, v_prd_name, p_untpc, v_prd_qy, p_untpc * p_order_qy, ( p_untpc * p_order_qy ) * 0.1, ( p_untpc * p_order_qy ) * 1.1, v_process_status, v_prdctn_at,p_order_qy );
    
    -- 현재 재고 수량이 0이면 입력 안하도록 작성, 현재 재고수량이 주문수량보다 많으면 주문수량만큼 미생산으로 입력
	 IF v_total_qy > 0 THEN
        IF v_total_qy >=  p_order_qy THEN
            SET v_prd_qy = p_order_qy;
        ELSE
            SET v_prd_qy = v_total_qy;
        END IF;
        
        -- 미생산 수량 입력
        SET v_prdctn_at = 'OP02';
        INSERT INTO order_lists(order_list_no, prd_code, order_no, prd_name, untpc, order_qy, splpc, taxamt, smprice, process_status, prdctn_at,totqy)
        VALUES(p_order_list_no, p_prd_code, p_order_no, v_prd_name, p_untpc, v_prd_qy, p_untpc * p_order_qy, ( p_untpc * p_order_qy ) * 0.1, ( p_untpc * p_order_qy ) * 1.1, v_process_status, v_prdctn_at,p_order_qy );
    END IF;
	 
	 COMMIT;
END //
DELIMITER ;
        
        