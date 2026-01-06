-- ============================================================
-- Smart Event Planner & Ticketing Platform
-- Stored Procedures Script
-- ============================================================

USE event_planner;

DELIMITER //

-- Procedure: Create a new booking
CREATE PROCEDURE sp_create_booking(
    IN p_event_id INT,
    IN p_attendee_id INT,
    IN p_tickets INT,
    OUT p_booking_id INT,
    OUT p_confirmation_code VARCHAR(20),
    OUT p_status VARCHAR(50)
)
BEGIN
    DECLARE v_capacity INT;
    DECLARE v_booked INT;
    DECLARE v_price DECIMAL(10,2);
    DECLARE v_event_status VARCHAR(20);
    
    -- Get event details
    SELECT capacity, tickets_booked, ticket_price, status 
    INTO v_capacity, v_booked, v_price, v_event_status
    FROM events WHERE id = p_event_id;
    
    -- Validate event exists and is published
    IF v_event_status IS NULL THEN
        SET p_status = 'ERROR: Event not found';
        SET p_booking_id = NULL;
    ELSEIF v_event_status != 'PUBLISHED' THEN
        SET p_status = 'ERROR: Event not available';
        SET p_booking_id = NULL;
    ELSEIF (v_booked + p_tickets) > v_capacity THEN
        SET p_status = 'ERROR: Not enough seats';
        SET p_booking_id = NULL;
    ELSE
        -- Generate confirmation code
        SET p_confirmation_code = CONCAT('EVT-', p_event_id, '-', FLOOR(RAND() * 100000));
        
        -- Create booking
        INSERT INTO bookings (event_id, attendee_id, tickets_booked, total_price, status, confirmation_code)
        VALUES (p_event_id, p_attendee_id, p_tickets, v_price * p_tickets, 'CONFIRMED', p_confirmation_code);
        
        SET p_booking_id = LAST_INSERT_ID();
        
        -- Update event tickets
        UPDATE events SET tickets_booked = tickets_booked + p_tickets WHERE id = p_event_id;
        
        SET p_status = 'SUCCESS';
    END IF;
END //

-- Procedure: Cancel a booking
CREATE PROCEDURE sp_cancel_booking(
    IN p_booking_id INT,
    OUT p_status VARCHAR(50)
)
BEGIN
    DECLARE v_event_id INT;
    DECLARE v_tickets INT;
    DECLARE v_booking_status VARCHAR(20);
    
    SELECT event_id, tickets_booked, status 
    INTO v_event_id, v_tickets, v_booking_status
    FROM bookings WHERE id = p_booking_id;
    
    IF v_booking_status IS NULL THEN
        SET p_status = 'ERROR: Booking not found';
    ELSEIF v_booking_status = 'CANCELLED' THEN
        SET p_status = 'ERROR: Already cancelled';
    ELSE
        UPDATE bookings SET status = 'CANCELLED', cancelled_at = NOW() WHERE id = p_booking_id;
        UPDATE events SET tickets_booked = tickets_booked - v_tickets WHERE id = v_event_id;
        SET p_status = 'SUCCESS';
    END IF;
END //

-- Procedure: Get events by category
CREATE PROCEDURE sp_get_events_by_category(IN p_category_id INT)
BEGIN
    SELECT * FROM vw_upcoming_events WHERE category_id = p_category_id;
END //

-- Procedure: Get user bookings
CREATE PROCEDURE sp_get_user_bookings(IN p_user_id INT)
BEGIN
    SELECT * FROM vw_booking_details WHERE attendee_id = p_user_id ORDER BY booking_time DESC;
END //

-- Procedure: Get organizer stats
CREATE PROCEDURE sp_get_organizer_stats(IN p_organizer_id INT)
BEGIN
    SELECT * FROM vw_organizer_dashboard WHERE organizer_id = p_organizer_id;
END //

DELIMITER ;

SELECT 'Stored procedures created successfully!' AS Status;
