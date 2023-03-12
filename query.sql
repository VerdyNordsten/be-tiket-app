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

-- Delete table if same name exist
DROP TABLE IF EXISTS bookings;

-- Creating table
CREATE TABLE bookings (
    id CHAR(36) PRIMARY KEY,
    id_user CHAR(36) NOT NULL,
    id_flight CHAR(36) NOT NULL,
    name_contact VARCHAR(100) NOT NULL, 
    email_contact VARCHAR(100) NOT NULL,
    phone_contact VARCHAR(100) NOT NULL,
    insurance BOOLEAN NOT NULL DEFAULT True, 
    capacity INT DEFAULT 1,
    status INT DEFAULT 0, 
    total_price INT NOT NULL,
    CONSTRAINT fk_users_id
        FOREIGN KEY (id_user)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_flights_id
        FOREIGN KEY (id_flight)
        REFERENCES flights(id)
);

-- Dummy data
INSERT INTO bookings(id, id_user, id_flight, name_contact, email_contact, phone_contact, insurance, capacity, status, total_price) 
    VALUES
        (1, 1, 1, 'Ikkair', 'ikkair@gmail.com', 'Saudara Ikkair', True, '4', 2, 40000),
        (2, 1, 1, 'Ilham', 'ilham@gmail.com', 'Saudara Ilham', False, '5', 1, 300000),
        (3, 1, 1, 'Verdy', 'verdy@gmail.com', 'Saudara Verdy', False, '5', 1, 399999),
        (4, 1, 1, 'Dhimas', 'dhimas@gmail.com', 'Saudara DhimAs', False, '5', 1, 399999);

