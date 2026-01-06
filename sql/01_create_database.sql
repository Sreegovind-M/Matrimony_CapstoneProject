-- ============================================================
-- Smart Event Planner & Ticketing Platform
-- Database Creation Script
-- ============================================================
-- Purpose: Creates the main database for the event ticketing platform
-- Author: Auto-generated
-- Date: January 2026
-- ============================================================

-- Drop database if exists (for fresh installation)
DROP DATABASE IF EXISTS event_planner;

-- Create the database with UTF-8 support
CREATE DATABASE event_planner
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- Use the database
USE event_planner;

-- Display success message
SELECT 'Database event_planner created successfully!' AS Status;
