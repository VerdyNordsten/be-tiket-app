-- Database Init
-- Delete database if same name exist
CREATE DATABASE ticket_app;

-- Create Table User
CREATE TYPE title_enum AS ENUM ('mr', 'ms', 'mrs');
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

-- Create Table Admin 
CREATE TABLE admin (
    id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(255),
    role VARCHAR(20) DEFAULT 'admin'
);

-- Delete table if same name exist
DROP TABLE IF EXISTS airlines;

-- Creating table Airlines
CREATE TABLE airlines (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE, 
    photo VARCHAR(100) NOT NULL, 
    active BOOLEAN NOT NULL
);

-- Dummy data
INSERT INTO airlines(id, name, photo, active) 
    VALUES
        (1, 'Adam Air', 'photo.jpg', True),
        (2, 'Aviastar', 'photo.jpg', True),
        (3, 'Batavia Air', 'photo.jpg', True),
        (4, 'Batik Air', 'photo.jpg', True),
        (5, 'Citilink', 'photo.jpg', True);

-- Create Table Flights
CREATE TYPE trip_type AS ENUM ('one way', 'rounded trip');
CREATE TYPE class_type AS ENUM ('economy', 'business', 'first class');
CREATE TYPE transit_type AS ENUM ('direct', 'transit');
CREATE TABLE flights (
    id VARCHAR(255) PRIMARY KEY,
    id_airline VARCHAR(255) REFERENCES airlines(id),
    departure_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    arrived_date DATE NOT NULL,
    arrived_time TIME NOT NULL,
    starting_place VARCHAR(255) NOT NULL,
    destination_place VARCHAR(255) NOT NULL,
    transit transit_type NOT NULL,
    luggage BOOLEAN DEFAULT FALSE,
    meal BOOLEAN DEFAULT FALSE,
    wifi BOOLEAN DEFAULT FALSE,
    class_flight class_type NOT NULL,
    type_trip trip_type NOT NULL,
    capacity INT NOT NULL,
    terminal VARCHAR(35) NOT NULL,
    gate VARCHAR(50) NOT NULL,
    price INT NOT NULL
);

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


-- Delete table if same name exist
DROP TABLE IF EXISTS notifications;

-- Creating table
CREATE TABLE notifications (
    id CHAR(36) PRIMARY KEY,
    id_user CHAR(36) NOT NULL, 
    title VARCHAR(100) NOT NULL, 
    content VARCHAR(100) NOT NULL, 
    filled BOOLEAN NOT NULL DEFAULT False
    -- CONSTRAINT fk_users_id
    --     FOREIGN KEY (id_user)
    --     REFERENCES users(id)
    --     ON DELETE CASCADE
);

-- Dummy data
INSERT INTO notifications(id, id_user, title, content, filled) 
    VALUES
        (1, 1, 'Penting', 'Harus di tambah relasi', false),
        (2, 1, 'Tidak Penting', 'Efisiensi', false),
        (3, 1, 'Sangat Penting', 'Makan', false),
        (4, 3, 'Kurang Penting', 'Buang air', false);