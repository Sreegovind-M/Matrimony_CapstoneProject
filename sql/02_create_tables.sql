-- ============================================================
-- Smart Event Planner & Ticketing Platform
-- Table Creation Script
-- ============================================================
-- Purpose: Creates all tables with proper relationships and constraints
-- Author: Auto-generated
-- Date: January 2026
-- ============================================================

USE event_planner;

-- ============================================================
-- Table: users
-- Description: Stores all user information with role-based access
-- Roles: ATTENDEE, ORGANIZER, ADMIN
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ATTENDEE', 'ORGANIZER', 'ADMIN') NOT NULL DEFAULT 'ATTENDEE',
    phone VARCHAR(20),
    profile_image_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for performance
    INDEX idx_users_email (email),
    INDEX idx_users_role (role),
    INDEX idx_users_is_active (is_active)
) ENGINE=InnoDB;

-- ============================================================
-- Table: categories
-- Description: Stores event categories for better organization
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    icon VARCHAR(50),
    color VARCHAR(7),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_categories_name (name),
    INDEX idx_categories_is_active (is_active)
) ENGINE=InnoDB;

-- ============================================================
-- Table: events
-- Description: Stores event information created by organizers
-- ============================================================
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organizer_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    venue VARCHAR(300) NOT NULL,
    venue_address VARCHAR(500),
    date_time DATETIME NOT NULL,
    end_date_time DATETIME,
    category_id INT,
    capacity INT NOT NULL CHECK (capacity > 0),
    tickets_booked INT NOT NULL DEFAULT 0,
    ticket_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    image_url VARCHAR(500),
    status ENUM('DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'DRAFT',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    tags VARCHAR(500),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Key Constraints
    CONSTRAINT fk_events_organizer FOREIGN KEY (organizer_id) 
        REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_events_category FOREIGN KEY (category_id) 
        REFERENCES categories(id) ON DELETE SET NULL ON UPDATE CASCADE,
    
    -- Check constraint for date validation
    CONSTRAINT chk_events_dates CHECK (end_date_time IS NULL OR end_date_time > date_time),
    CONSTRAINT chk_events_tickets CHECK (tickets_booked <= capacity),
    
    -- Indexes for performance
    INDEX idx_events_organizer (organizer_id),
    INDEX idx_events_category (category_id),
    INDEX idx_events_date_time (date_time),
    INDEX idx_events_status (status),
    INDEX idx_events_is_featured (is_featured)
) ENGINE=InnoDB;

-- ============================================================
-- Table: bookings
-- Description: Stores ticket booking information
-- ============================================================
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    attendee_id INT NOT NULL,
    tickets_booked INT NOT NULL CHECK (tickets_booked > 0),
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    booking_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    confirmation_code VARCHAR(20) UNIQUE,
    notes TEXT,
    cancelled_at DATETIME,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Key Constraints
    CONSTRAINT fk_bookings_event FOREIGN KEY (event_id) 
        REFERENCES events(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_bookings_attendee FOREIGN KEY (attendee_id) 
        REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Indexes for performance
    INDEX idx_bookings_event (event_id),
    INDEX idx_bookings_attendee (attendee_id),
    INDEX idx_bookings_status (status),
    INDEX idx_bookings_booking_time (booking_time),
    INDEX idx_bookings_confirmation_code (confirmation_code)
) ENGINE=InnoDB;

-- ============================================================
-- Table: event_reviews
-- Description: Stores reviews and ratings for events
-- ============================================================
CREATE TABLE IF NOT EXISTS event_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Key Constraints
    CONSTRAINT fk_reviews_event FOREIGN KEY (event_id) 
        REFERENCES events(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Unique constraint: one review per user per event
    UNIQUE KEY uk_event_user_review (event_id, user_id),
    
    -- Indexes
    INDEX idx_reviews_event (event_id),
    INDEX idx_reviews_user (user_id),
    INDEX idx_reviews_rating (rating)
) ENGINE=InnoDB;

-- ============================================================
-- Table: event_favorites
-- Description: Stores user's favorite/wishlisted events
-- ============================================================
CREATE TABLE IF NOT EXISTS event_favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key Constraints
    CONSTRAINT fk_favorites_event FOREIGN KEY (event_id) 
        REFERENCES events(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Unique constraint: one favorite per user per event
    UNIQUE KEY uk_event_user_favorite (event_id, user_id),
    
    -- Indexes
    INDEX idx_favorites_user (user_id)
) ENGINE=InnoDB;

-- ============================================================
-- Table: analytics
-- Description: Stores platform analytics data for admin dashboard
-- ============================================================
CREATE TABLE IF NOT EXISTS analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15, 2) NOT NULL,
    metric_type ENUM('COUNT', 'SUM', 'AVERAGE', 'PERCENTAGE') NOT NULL DEFAULT 'COUNT',
    dimension VARCHAR(100),
    dimension_value VARCHAR(255),
    recorded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_analytics_metric (metric_name),
    INDEX idx_analytics_recorded_at (recorded_at),
    INDEX idx_analytics_dimension (dimension)
) ENGINE=InnoDB;

-- ============================================================
-- Table: notifications
-- Description: Stores user notifications
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    notification_type ENUM('BOOKING', 'EVENT_UPDATE', 'REMINDER', 'SYSTEM') NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    related_event_id INT,
    related_booking_id INT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key Constraints
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_notifications_event FOREIGN KEY (related_event_id) 
        REFERENCES events(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_notifications_booking FOREIGN KEY (related_booking_id) 
        REFERENCES bookings(id) ON DELETE SET NULL ON UPDATE CASCADE,
    
    -- Indexes
    INDEX idx_notifications_user (user_id),
    INDEX idx_notifications_is_read (is_read),
    INDEX idx_notifications_created_at (created_at)
) ENGINE=InnoDB;

-- ============================================================
-- Table: audit_log
-- Description: Stores audit trail for important actions
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key Constraints
    CONSTRAINT fk_audit_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    
    -- Indexes
    INDEX idx_audit_user (user_id),
    INDEX idx_audit_action (action),
    INDEX idx_audit_entity (entity_type, entity_id),
    INDEX idx_audit_created_at (created_at)
) ENGINE=InnoDB;

-- Display success message
SELECT 'All tables created successfully!' AS Status;
