-- Drop existing tables if they exist to avoid conflicts
DROP TABLE IF EXISTS records CASCADE;
DROP TABLE IF EXISTS logbook_entries CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS internships CASCADE;
DROP TABLE IF EXISTS college CASCADE;
DROP TABLE IF EXISTS state_admin CASCADE;
DROP TABLE IF EXISTS employer CASCADE;
DROP TABLE IF EXISTS admin CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS token CASCADE;
DROP TABLE IF EXISTS register CASCADE;

-- 1. Authentication & Base Users
CREATE TABLE register (
    id BIGINT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    role INTEGER NOT NULL, -- 1: Student, 3: Admin, 4: Employer, 5: State Admin
    auth_provider VARCHAR(50) DEFAULT 'local',
    provider_id VARCHAR(255) UNIQUE,
    profile_completed BOOLEAN DEFAULT true,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Role-specific Tables
CREATE TABLE students (
    id BIGINT PRIMARY KEY REFERENCES register(id) ON DELETE CASCADE,
    first_name VARCHAR(255) NOT NULL,
    mid_name VARCHAR(255),
    last_name VARCHAR(255) NOT NULL,
    college_name VARCHAR(255),
    college_id INTEGER,
    roll_no VARCHAR(100),
    profile_data JSONB,
    status VARCHAR(50) DEFAULT 'active'
);


CREATE TABLE admin (
    id BIGINT PRIMARY KEY REFERENCES register(id) ON DELETE CASCADE,
    first_name VARCHAR(255) NOT NULL,
    mid_name VARCHAR(255),
    last_name VARCHAR(255) NOT NULL,
    college_name VARCHAR(255),
    aishe_code VARCHAR(100),
    college_website VARCHAR(255),
    college_id INTEGER,
    status VARCHAR(50) DEFAULT 'active'
);

CREATE TABLE employer (
    id BIGINT PRIMARY KEY REFERENCES register(id) ON DELETE CASCADE,
    first_name VARCHAR(255),
    mid_name VARCHAR(255),
    last_name VARCHAR(255),
    company_name VARCHAR(255),
    company_website VARCHAR(255),
    gst_number VARCHAR(100),
    profile_data JSONB
);

CREATE TABLE state_admin (
    id BIGINT PRIMARY KEY REFERENCES register(id) ON DELETE CASCADE,
    first_name VARCHAR(255) NOT NULL,
    mid_name VARCHAR(255),
    last_name VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending'
);

-- 3. Core Entities
CREATE TABLE college (
    id SERIAL PRIMARY KEY,
    state_id INTEGER,
    college_name VARCHAR(255) NOT NULL,
    branch VARCHAR(255),
    location VARCHAR(255)
);

CREATE TABLE token (
    token_id BIGINT PRIMARY KEY REFERENCES register(id) ON DELETE CASCADE,
    accesstoken TEXT,
    refreshtoken TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE internships (
    id SERIAL PRIMARY KEY,
    employer_id BIGINT REFERENCES employer(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    work_mode VARCHAR(50),
    location VARCHAR(100),
    internship_type VARCHAR(50),
    duration VARCHAR(50),
    stipend_type VARCHAR(50),
    stipend_amount VARCHAR(50),
    skills TEXT,
    openings INTEGER DEFAULT 1,
    start_date DATE,
    application_deadline DATE,
    perks TEXT,
    eligibility TEXT,
    requirements TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
    internship_id INTEGER REFERENCES internships(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE logbook_entries (
    id SERIAL PRIMARY KEY,
    student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE records (
    id SERIAL PRIMARY KEY,
    student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
