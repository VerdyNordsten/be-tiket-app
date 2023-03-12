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
    id CHAR(40) PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- note not null
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
