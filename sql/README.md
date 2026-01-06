# SQL Database Setup for Smart Event Planner & Ticketing Platform

This folder contains SQL scripts for setting up the MySQL database for the Smart Event Planner & Ticketing Platform.

## Database Overview

The database consists of the following main tables:
- **users**: Stores user information with role-based access (ATTENDEE, ORGANIZER, ADMIN)
- **events**: Stores event information created by organizers
- **bookings**: Stores ticket booking information
- **categories**: Stores event categories for better organization
- **analytics**: Stores platform analytics data for admin dashboard

## Files

| File | Description |
|------|-------------|
| `01_create_database.sql` | Creates the database and sets configuration |
| `02_create_tables.sql` | Creates all tables with proper relationships |
| `03_insert_sample_data.sql` | Inserts sample data for testing |
| `04_create_views.sql` | Creates useful views for reporting |
| `05_stored_procedures.sql` | Creates stored procedures for common operations |

## Setup Instructions

### Prerequisites
- MySQL 8.0 or higher
- MySQL Workbench or any MySQL client

### Running the Scripts

1. **Create Database**
   ```bash
   mysql -u root -p < 01_create_database.sql
   ```

2. **Create Tables**
   ```bash
   mysql -u root -p event_planner < 02_create_tables.sql
   ```

3. **Insert Sample Data** (Optional - for testing)
   ```bash
   mysql -u root -p event_planner < 03_insert_sample_data.sql
   ```

4. **Create Views** (Optional - for reporting)
   ```bash
   mysql -u root -p event_planner < 04_create_views.sql
   ```

5. **Create Stored Procedures** (Optional)
   ```bash
   mysql -u root -p event_planner < 05_stored_procedures.sql
   ```

### Or Run All at Once

```bash
mysql -u root -p < 01_create_database.sql
mysql -u root -p event_planner < 02_create_tables.sql
mysql -u root -p event_planner < 03_insert_sample_data.sql
mysql -u root -p event_planner < 04_create_views.sql
mysql -u root -p event_planner < 05_stored_procedures.sql
```

## Entity Relationship Diagram

```
┌──────────────────┐         ┌──────────────────┐
│      users       │         │    categories    │
├──────────────────┤         ├──────────────────┤
│ id (PK)          │         │ id (PK)          │
│ name             │         │ name             │
│ email            │         │ description      │
│ password_hash    │         │ created_at       │
│ role             │         └───────┬──────────┘
│ phone            │                 │
│ created_at       │                 │
│ updated_at       │                 │
└─────────┬────────┘                 │
          │                          │
          │ organizer_id             │ category_id
          │ attendee_id              │
          ▼                          ▼
┌──────────────────┐         ┌──────────────────┐
│     events       │◄────────┤                  │
├──────────────────┤         │                  │
│ id (PK)          │         │                  │
│ organizer_id (FK)│         │                  │
│ name             │         │                  │
│ description      │         │                  │
│ venue            │         │                  │
│ date_time        │         │                  │
│ category_id (FK) │         │                  │
│ capacity         │         │                  │
│ ticket_price     │         │                  │
│ image_url        │         │                  │
│ status           │         │                  │
│ created_at       │         │                  │
│ updated_at       │         │                  │
└─────────┬────────┘         │                  │
          │                  │                  │
          │ event_id         │                  │
          ▼                  │                  │
┌──────────────────┐         │                  │
│    bookings      │─────────┘                  │
├──────────────────┤                            │
│ id (PK)          │                            │
│ event_id (FK)    │                            │
│ attendee_id (FK) │                            │
│ tickets_booked   │                            │
│ total_price      │                            │
│ status           │                            │
│ booking_time     │                            │
└──────────────────┘                            │
                                                │
┌──────────────────┐                            │
│    analytics     │                            │
├──────────────────┤                            │
│ id (PK)          │                            │
│ metric_name      │                            │
│ metric_value     │                            │
│ recorded_at      │                            │
└──────────────────┘
```

## Roles and Permissions

| Role | Permissions |
|------|-------------|
| ATTENDEE | Browse events, view details, book tickets, view booking history |
| ORGANIZER | All attendee permissions + Create/Edit/Delete own events, view attendee lists |
| ADMIN | All permissions + View platform analytics, manage all users and events |

## Connection Configuration

Update your backend configuration with these database settings:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=event_planner
DB_USER=your_username
DB_PASSWORD=your_password
```
