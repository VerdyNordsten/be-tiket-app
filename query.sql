-- Database Init
-- Delete database if same name exist
CREATE DATABASE ticket_app;

-- Create Enum
CREATE TYPE title_enum AS ENUM ('mr', 'ms', 'mrs');
-- Create Table (unused)
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(255),
    city VARCHAR(100),
    address TEXT,
    title title_enum,
    post_code INT,
    photo VARCHAR(255),
    role VARCHAR(20) DEFAULT 'customer'
);

-- Delete table if same name exist
DROP TABLE IF EXISTS airlines;

-- Creating table
CREATE TABLE airlines (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE, -- note not null
    photo VARCHAR(100) NOT NULL, -- note not null
    active BOOLEAN NOT NULL -- note not null
);

-- Dummy data
INSERT INTO airlines(id, name, photo, active) 
    VALUES
        (1, 'Adam Air', 'photo.jpg', True),
        (2, 'Aviastar', 'photo.jpg', True),
        (3, 'Batavia Air', 'photo.jpg', True),
        (4, 'Batik Air', 'photo.jpg', True),
        (5, 'Citilink', 'photo.jpg', True);