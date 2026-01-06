-- ============================================================
-- Smart Event Planner & Ticketing Platform
-- Sample Data Insertion Script
-- ============================================================
-- Purpose: Inserts sample data for testing and development
-- Author: Auto-generated
-- Date: January 2026
-- ============================================================

USE event_planner;

-- ============================================================
-- Insert Categories
-- ============================================================
INSERT INTO categories (name, description, icon, color) VALUES
('Music', 'Concerts, festivals, and live music performances', 'music_note', '#E91E63'),
('Sports', 'Sports events, matches, and tournaments', 'sports_soccer', '#4CAF50'),
('Technology', 'Tech conferences, hackathons, and workshops', 'computer', '#2196F3'),
('Business', 'Business conferences, networking, and seminars', 'business', '#9C27B0'),
('Arts & Culture', 'Art exhibitions, theater, and cultural events', 'palette', '#FF9800'),
('Food & Drink', 'Food festivals, wine tastings, and culinary events', 'restaurant', '#795548'),
('Education', 'Workshops, courses, and educational seminars', 'school', '#607D8B'),
('Health & Wellness', 'Fitness events, yoga sessions, and wellness retreats', 'fitness_center', '#00BCD4'),
('Entertainment', 'Comedy shows, magic shows, and entertainment events', 'theaters', '#F44336'),
('Community', 'Community gatherings, charity events, and meetups', 'groups', '#8BC34A');

-- ============================================================
-- Insert Sample Users
-- Note: Password hash is for 'password123' - In production, use proper hashing
-- ============================================================
INSERT INTO users (name, email, password_hash, role, phone) VALUES
-- Admins
('System Admin', 'admin@eventplanner.com', '$2b$10$examplehashforadmin123456789', 'ADMIN', '+1-555-0100'),
('Platform Manager', 'manager@eventplanner.com', '$2b$10$examplehashformanager123456', 'ADMIN', '+1-555-0101'),

-- Organizers
('TechEvents Inc', 'tech@eventplanner.com', '$2b$10$examplehashfororganizer12345', 'ORGANIZER', '+1-555-0200'),
('Music Productions', 'music@eventplanner.com', '$2b$10$examplehashformusicprod12345', 'ORGANIZER', '+1-555-0201'),
('Sports Arena Ltd', 'sports@eventplanner.com', '$2b$10$examplehashforsportsarena123', 'ORGANIZER', '+1-555-0202'),
('Culinary Masters', 'food@eventplanner.com', '$2b$10$examplehashforculinary12345', 'ORGANIZER', '+1-555-0203'),
('Arts Council', 'arts@eventplanner.com', '$2b$10$examplehashforartscouncil123', 'ORGANIZER', '+1-555-0204'),

-- Attendees
('John Smith', 'john.smith@email.com', '$2b$10$examplehashforjohnsmith12345', 'ATTENDEE', '+1-555-0300'),
('Jane Doe', 'jane.doe@email.com', '$2b$10$examplehashforjanedoe1234567', 'ATTENDEE', '+1-555-0301'),
('Robert Johnson', 'robert.j@email.com', '$2b$10$examplehashforrobertj123456', 'ATTENDEE', '+1-555-0302'),
('Emily Williams', 'emily.w@email.com', '$2b$10$examplehashforemilyw12345678', 'ATTENDEE', '+1-555-0303'),
('Michael Brown', 'michael.b@email.com', '$2b$10$examplehashformichaelb12345', 'ATTENDEE', '+1-555-0304'),
('Sarah Davis', 'sarah.d@email.com', '$2b$10$examplehashforsarahd12345678', 'ATTENDEE', '+1-555-0305'),
('David Wilson', 'david.w@email.com', '$2b$10$examplehashfordavidw12345678', 'ATTENDEE', '+1-555-0306'),
('Lisa Anderson', 'lisa.a@email.com', '$2b$10$examplehashforlisaa123456789', 'ATTENDEE', '+1-555-0307');

-- ============================================================
-- Insert Sample Events
-- ============================================================
INSERT INTO events (organizer_id, name, description, venue, venue_address, date_time, end_date_time, category_id, capacity, ticket_price, status, is_featured) VALUES
-- Technology Events (organizer_id = 3)
(3, 'TechCon 2026', 'Annual technology conference featuring the latest innovations in AI, cloud computing, and software development. Join industry leaders for keynotes, workshops, and networking opportunities.', 'Convention Center Hall A', '123 Tech Boulevard, Silicon Valley, CA 94025', '2026-03-15 09:00:00', '2026-03-17 18:00:00', 3, 500, 299.99, 'PUBLISHED', TRUE),
(3, 'Web Development Workshop', 'Hands-on workshop covering modern web development technologies including React, Angular, and Node.js. Perfect for beginners and intermediate developers.', 'Tech Hub Building', '456 Innovation Drive, San Francisco, CA 94102', '2026-02-20 10:00:00', '2026-02-20 17:00:00', 3, 50, 49.99, 'PUBLISHED', FALSE),
(3, 'AI & Machine Learning Summit', 'Deep dive into artificial intelligence and machine learning applications in modern business. Featuring hands-on demos and expert panels.', 'AI Research Center', '789 Data Science Way, Palo Alto, CA 94301', '2026-04-10 08:30:00', '2026-04-11 17:00:00', 3, 200, 199.99, 'PUBLISHED', TRUE),

-- Music Events (organizer_id = 4)
(4, 'Summer Music Festival 2026', 'Three-day music festival featuring top artists from around the world. Multiple stages, food vendors, and camping available.', 'Greenfield Park', '100 Festival Road, Austin, TX 78701', '2026-06-20 12:00:00', '2026-06-22 23:00:00', 1, 10000, 149.99, 'PUBLISHED', TRUE),
(4, 'Jazz Night Under the Stars', 'Intimate evening of smooth jazz featuring local and international jazz artists. Wine and appetizers included.', 'Riverside Amphitheater', '250 River Walk, New Orleans, LA 70130', '2026-04-05 19:00:00', '2026-04-05 23:00:00', 1, 300, 79.99, 'PUBLISHED', FALSE),
(4, 'Classical Orchestra Performance', 'Experience the timeless beauty of classical music with our city symphony orchestra performing Beethoven and Mozart.', 'Grand Concert Hall', '500 Symphony Square, Boston, MA 02108', '2026-03-28 19:30:00', '2026-03-28 22:00:00', 1, 800, 59.99, 'PUBLISHED', FALSE),

-- Sports Events (organizer_id = 5)
(5, 'City Marathon 2026', 'Annual city marathon with 5K, 10K, half marathon, and full marathon categories. Scenic route through downtown and waterfront.', 'City Center Start Line', '1 Marathon Plaza, Chicago, IL 60601', '2026-05-10 06:00:00', '2026-05-10 14:00:00', 2, 5000, 75.00, 'PUBLISHED', TRUE),
(5, 'Basketball Championship Finals', 'Watch the finals of the regional basketball championship. Top teams compete for the trophy.', 'Sports Arena', '200 Stadium Drive, Los Angeles, CA 90015', '2026-04-25 18:00:00', '2026-04-25 21:00:00', 2, 15000, 45.00, 'PUBLISHED', FALSE),
(5, 'Tennis Open Tournament', 'Premier tennis tournament featuring top-ranked players. Week-long event with exciting matches.', 'Grand Tennis Complex', '300 Court Lane, Miami, FL 33101', '2026-07-01 10:00:00', '2026-07-07 19:00:00', 2, 2000, 89.99, 'DRAFT', FALSE),

-- Food Events (organizer_id = 6)
(6, 'International Food Festival', 'Celebrate cuisines from around the world! Over 50 food vendors, cooking demonstrations, and cultural performances.', 'Waterfront Plaza', '150 Harbor Boulevard, San Diego, CA 92101', '2026-05-25 11:00:00', '2026-05-26 21:00:00', 6, 8000, 25.00, 'PUBLISHED', TRUE),
(6, 'Wine Tasting Experience', 'Exclusive wine tasting event featuring premium wines from Napa Valley vineyards. Includes cheese pairings and sommelier-led sessions.', 'The Wine Gallery', '400 Vineyard Avenue, Napa, CA 94558', '2026-03-08 17:00:00', '2026-03-08 21:00:00', 6, 100, 125.00, 'PUBLISHED', FALSE),
(6, 'Cooking Masterclass: Italian Cuisine', 'Learn authentic Italian cooking techniques from renowned chef Marco Rossi. Hands-on class with take-home recipes.', 'Culinary Arts Center', '75 Chef Street, New York, NY 10001', '2026-02-28 14:00:00', '2026-02-28 18:00:00', 6, 20, 150.00, 'PUBLISHED', FALSE),

-- Arts & Culture Events (organizer_id = 7)
(7, 'Modern Art Exhibition', 'Contemporary art showcase featuring works by emerging and established artists. Interactive installations and artist meet-and-greets.', 'City Art Museum', '600 Museum Mile, New York, NY 10028', '2026-04-01 10:00:00', '2026-04-30 18:00:00', 5, 500, 20.00, 'PUBLISHED', FALSE),
(7, 'Shakespeare in the Park', 'Open-air performance of "A Midsummer Night''s Dream" by the City Theater Company. Bring your blankets and picnic baskets!', 'Central Park Amphitheater', 'Central Park West, New York, NY 10023', '2026-06-15 19:00:00', '2026-06-15 22:00:00', 5, 1000, 35.00, 'DRAFT', FALSE),
(7, 'Photography Workshop', 'Learn photography basics and advanced techniques from professional photographers. Camera equipment provided.', 'Arts Academy', '225 Creative Lane, Portland, OR 97201', '2026-03-22 09:00:00', '2026-03-22 16:00:00', 5, 25, 89.00, 'PUBLISHED', FALSE);

-- ============================================================
-- Insert Sample Bookings
-- ============================================================
INSERT INTO bookings (event_id, attendee_id, tickets_booked, total_price, status, payment_method, confirmation_code, booking_time) VALUES
-- Bookings for TechCon 2026 (event_id = 1)
(1, 8, 2, 599.98, 'CONFIRMED', 'CREDIT_CARD', 'TC2026-001-8A2B', '2026-01-15 10:30:00'),
(1, 9, 1, 299.99, 'CONFIRMED', 'PAYPAL', 'TC2026-002-9C3D', '2026-01-16 14:20:00'),
(1, 10, 3, 899.97, 'CONFIRMED', 'CREDIT_CARD', 'TC2026-003-10E4', '2026-01-17 09:15:00'),
(1, 11, 1, 299.99, 'PENDING', 'BANK_TRANSFER', 'TC2026-004-11F5', '2026-01-18 16:45:00'),

-- Bookings for Summer Music Festival (event_id = 4)
(4, 8, 4, 599.96, 'CONFIRMED', 'CREDIT_CARD', 'SMF2026-001-8G6H', '2026-01-20 11:00:00'),
(4, 12, 2, 299.98, 'CONFIRMED', 'PAYPAL', 'SMF2026-002-12I7', '2026-01-21 13:30:00'),
(4, 13, 6, 899.94, 'CONFIRMED', 'CREDIT_CARD', 'SMF2026-003-13J8', '2026-01-22 15:20:00'),

-- Bookings for City Marathon (event_id = 7)
(7, 9, 1, 75.00, 'CONFIRMED', 'CREDIT_CARD', 'CM2026-001-9K9L', '2026-02-01 08:00:00'),
(7, 10, 1, 75.00, 'CONFIRMED', 'PAYPAL', 'CM2026-002-10M1', '2026-02-02 09:30:00'),
(7, 14, 1, 75.00, 'CONFIRMED', 'CREDIT_CARD', 'CM2026-003-14N2', '2026-02-03 10:45:00'),

-- Bookings for International Food Festival (event_id = 10)
(10, 11, 4, 100.00, 'CONFIRMED', 'CREDIT_CARD', 'IFF2026-001-11O3', '2026-03-01 12:00:00'),
(10, 15, 2, 50.00, 'CONFIRMED', 'PAYPAL', 'IFF2026-002-15P4', '2026-03-02 14:15:00'),

-- Cancelled booking example
(1, 14, 2, 599.98, 'CANCELLED', 'CREDIT_CARD', 'TC2026-005-14Q5', '2026-01-19 11:30:00'),

-- Refunded booking example
(4, 15, 2, 299.98, 'REFUNDED', 'PAYPAL', 'SMF2026-004-15R6', '2026-01-23 10:00:00');

-- ============================================================
-- Update events with booked tickets count
-- ============================================================
UPDATE events SET tickets_booked = 7 WHERE id = 1;  -- TechCon 2026
UPDATE events SET tickets_booked = 12 WHERE id = 4; -- Summer Music Festival
UPDATE events SET tickets_booked = 3 WHERE id = 7;  -- City Marathon
UPDATE events SET tickets_booked = 6 WHERE id = 10; -- International Food Festival

-- ============================================================
-- Insert Sample Reviews
-- ============================================================
INSERT INTO event_reviews (event_id, user_id, rating, review_text) VALUES
(1, 8, 5, 'Amazing conference! Learned so much about new technologies. The speakers were top-notch.'),
(1, 9, 4, 'Great event overall. Would have liked more networking opportunities.'),
(4, 8, 5, 'Best music festival I''ve ever attended! Can''t wait for next year.'),
(4, 12, 4, 'Great lineup and atmosphere. Just wish there were more food options.');

-- ============================================================
-- Insert Sample Favorites
-- ============================================================
INSERT INTO event_favorites (event_id, user_id) VALUES
(1, 8), (1, 10), (1, 11),           -- TechCon favorites
(4, 8), (4, 9), (4, 12), (4, 13),   -- Summer Music Festival favorites
(7, 9), (7, 10),                     -- City Marathon favorites
(10, 11), (10, 15);                  -- Food Festival favorites

-- ============================================================
-- Insert Sample Analytics Data
-- ============================================================
INSERT INTO analytics (metric_name, metric_value, metric_type, dimension, dimension_value, recorded_at) VALUES
-- Daily active users
('daily_active_users', 150, 'COUNT', 'date', '2026-01-15', '2026-01-15 23:59:59'),
('daily_active_users', 175, 'COUNT', 'date', '2026-01-16', '2026-01-16 23:59:59'),
('daily_active_users', 200, 'COUNT', 'date', '2026-01-17', '2026-01-17 23:59:59'),

-- Total bookings by category
('total_bookings', 45, 'COUNT', 'category', 'Technology', '2026-01-17 23:59:59'),
('total_bookings', 78, 'COUNT', 'category', 'Music', '2026-01-17 23:59:59'),
('total_bookings', 32, 'COUNT', 'category', 'Sports', '2026-01-17 23:59:59'),

-- Revenue
('total_revenue', 15000.50, 'SUM', 'date', '2026-01-15', '2026-01-15 23:59:59'),
('total_revenue', 22500.75, 'SUM', 'date', '2026-01-16', '2026-01-16 23:59:59'),
('total_revenue', 31200.00, 'SUM', 'date', '2026-01-17', '2026-01-17 23:59:59'),

-- Conversion rates
('booking_conversion_rate', 12.5, 'PERCENTAGE', 'category', 'Technology', '2026-01-17 23:59:59'),
('booking_conversion_rate', 8.3, 'PERCENTAGE', 'category', 'Music', '2026-01-17 23:59:59');

-- ============================================================
-- Insert Sample Notifications
-- ============================================================
INSERT INTO notifications (user_id, title, message, notification_type, is_read, related_event_id, related_booking_id) VALUES
(8, 'Booking Confirmed', 'Your booking for TechCon 2026 has been confirmed. Confirmation code: TC2026-001-8A2B', 'BOOKING', TRUE, 1, 1),
(8, 'Booking Confirmed', 'Your booking for Summer Music Festival 2026 has been confirmed.', 'BOOKING', TRUE, 4, 5),
(9, 'Event Reminder', 'TechCon 2026 is coming up in 2 weeks! Don''t forget to mark your calendar.', 'REMINDER', FALSE, 1, NULL),
(10, 'Event Update', 'The venue for TechCon 2026 has been updated. Please check the event details.', 'EVENT_UPDATE', FALSE, 1, NULL),
(11, 'System Notification', 'Welcome to Smart Event Planner! Explore events near you.', 'SYSTEM', TRUE, NULL, NULL);

-- Display success message
SELECT 'Sample data inserted successfully!' AS Status;
SELECT CONCAT('Total Users: ', COUNT(*)) AS Summary FROM users
UNION ALL
SELECT CONCAT('Total Events: ', COUNT(*)) FROM events
UNION ALL
SELECT CONCAT('Total Bookings: ', COUNT(*)) FROM bookings
UNION ALL
SELECT CONCAT('Total Categories: ', COUNT(*)) FROM categories;
