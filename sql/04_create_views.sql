-- ============================================================
-- Smart Event Planner & Ticketing Platform
-- Views Creation Script
-- ============================================================

USE event_planner;

-- View: Event Details with organizer and category
CREATE OR REPLACE VIEW vw_event_details AS
SELECT 
    e.id AS event_id, e.name AS event_name, e.description, e.venue,
    e.date_time, e.capacity, e.tickets_booked,
    (e.capacity - e.tickets_booked) AS available_tickets,
    e.ticket_price, e.status, e.is_featured,
    u.id AS organizer_id, u.name AS organizer_name,
    c.name AS category_name
FROM events e
INNER JOIN users u ON e.organizer_id = u.id
LEFT JOIN categories c ON e.category_id = c.id;

-- View: Upcoming Published Events
CREATE OR REPLACE VIEW vw_upcoming_events AS
SELECT * FROM vw_event_details
WHERE status = 'PUBLISHED' AND date_time > NOW()
ORDER BY date_time ASC;

-- View: Booking Details
CREATE OR REPLACE VIEW vw_booking_details AS
SELECT 
    b.id AS booking_id, b.confirmation_code, b.tickets_booked,
    b.total_price, b.status AS booking_status, b.booking_time,
    e.id AS event_id, e.name AS event_name, e.venue, e.date_time,
    u.id AS attendee_id, u.name AS attendee_name, u.email AS attendee_email
FROM bookings b
INNER JOIN events e ON b.event_id = e.id
INNER JOIN users u ON b.attendee_id = u.id;

-- View: Organizer Dashboard
CREATE OR REPLACE VIEW vw_organizer_dashboard AS
SELECT 
    u.id AS organizer_id, u.name AS organizer_name,
    COUNT(DISTINCT e.id) AS total_events,
    COALESCE(SUM(e.tickets_booked), 0) AS total_tickets_sold,
    COALESCE(SUM(b.total_price), 0) AS total_revenue
FROM users u
LEFT JOIN events e ON u.id = e.organizer_id
LEFT JOIN bookings b ON e.id = b.event_id AND b.status = 'CONFIRMED'
WHERE u.role = 'ORGANIZER'
GROUP BY u.id, u.name;

-- View: Event Attendees
CREATE OR REPLACE VIEW vw_event_attendees AS
SELECT 
    e.id AS event_id, e.name AS event_name, e.organizer_id,
    b.confirmation_code, b.tickets_booked, b.booking_time,
    u.id AS attendee_id, u.name AS attendee_name, u.email, u.phone
FROM events e
INNER JOIN bookings b ON e.id = b.event_id
INNER JOIN users u ON b.attendee_id = u.id
WHERE b.status IN ('CONFIRMED', 'PENDING');

-- View: Admin Dashboard Stats
CREATE OR REPLACE VIEW vw_admin_dashboard AS
SELECT 
    (SELECT COUNT(*) FROM users) AS total_users,
    (SELECT COUNT(*) FROM events) AS total_events,
    (SELECT COUNT(*) FROM bookings WHERE status = 'CONFIRMED') AS confirmed_bookings,
    (SELECT COALESCE(SUM(total_price), 0) FROM bookings WHERE status = 'CONFIRMED') AS total_revenue;

SELECT 'Views created successfully!' AS Status;
