-- Database Init
-- Delete database if same name exist
CREATE DATABASE ticket_app;

-- Create Table User
CREATE TYPE title_enum AS ENUM ('mr', 'ms', 'mrs');
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password CHAR(60) NOT NULL,
    phone VARCHAR(100),
    city VARCHAR(100),
    address TEXT,
    title title_enum,
    post_code INT,
    photo VARCHAR(255),
    role VARCHAR(20) DEFAULT 'customer'
);

-- Create Table Super Admin 
CREATE TABLE super_admin (
    id CHAR(36) PRIMARY KEY,
    username VARCHAR(100),
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password CHAR(60) NOT NULL,
    phone VARCHAR(100),
    role VARCHAR(20) DEFAULT 'super admin'
);

-- Create Table Admin 
CREATE TABLE admin (
    id CHAR(36) PRIMARY KEY,
    username VARCHAR(100),
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password CHAR(60) NOT NULL,
    phone VARCHAR(100),
    role VARCHAR(20) DEFAULT 'admin',
    is_actived BOOLEAN DEFAULT true
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

-- Create Table Flights
CREATE TYPE trip_type AS ENUM ('one way', 'rounded trip');
CREATE TYPE class_type AS ENUM ('economy', 'business', 'first class');
CREATE TYPE transit_type AS ENUM ('direct', 'transit');
CREATE TABLE flights (
    id CHAR(36) PRIMARY KEY,
    id_airline CHAR(36) REFERENCES airlines(id),
    departure_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    arrived_date DATE NOT NULL,
    arrived_time TIME NOT NULL,
    starting_place VARCHAR(100) NOT NULL,
    destination_place VARCHAR(100) NOT NULL,
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
    insurance BOOLEAN NOT NULL DEFAULT false, 
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

-- Delete table if same name exist
DROP TABLE IF EXISTS notifications;

-- Creating table
CREATE TABLE notifications (
    id CHAR(36) PRIMARY KEY,
    id_user CHAR(36) NOT NULL, 
    title VARCHAR(100) NOT NULL, 
    content VARCHAR(100) NOT NULL, 
    filled BOOLEAN NOT NULL DEFAULT False,
    CONSTRAINT fk_users_id
        FOREIGN KEY (id_user)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- Creating table
CREATE TYPE seat_type AS ENUM ('economy', 'business', 'first class');
CREATE TABLE seats (
    id CHAR(36) PRIMARY KEY,
    id_flight CHAR(36) REFERENCES flights(id) ON DELETE CASCADE,
    no_seat VARCHAR(10),
    type_seat seat_type NOT NULL,
    filled BOOLEAN DEFAULT FALSE
);

-- Create Enum
CREATE TYPE PASSENGER_TYPE AS ENUM ('child', 'adult');
-- Creating table
CREATE TABLE passengers (
    id CHAR(36) PRIMARY KEY,
    id_booking CHAR(36) NOT NULL, 
    id_seat CHAR(36) NOT NULL, 
    name VARCHAR(100) NOT NULL, 
    category_passenger PASSENGER_TYPE NOT NULL,
    CONSTRAINT fk_bookings_id
        FOREIGN KEY (id_booking)
        REFERENCES bookings(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_seats_id
        FOREIGN KEY (id_seat)
        REFERENCES seats(id)
);

-- Creating table
CREATE TABLE tickets (
    id CHAR(36) PRIMARY KEY,
    id_passenger CHAR(36) UNIQUE NOT NULL, 
    code VARCHAR(20),
    CONSTRAINT fk_passengers_id
        FOREIGN KEY (id_passenger)
        REFERENCES passengers(id)
        ON DELETE CASCADE
);

-- Creating table
CREATE TABLE destinations (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE, 
    popularity INT DEFAULT 0
);
