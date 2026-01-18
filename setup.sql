CREATE SCHEMA IF NOT EXISTS shop;
SET search_path TO shop;
-- Create products sequence
CREATE SEQUENCE IF NOT EXISTS shop.product_seq;

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id BIGINT PRIMARY KEY DEFAULT nextval('shop.product_seq'),
    name TEXT NOT NULL,
    price BIGINT NOT NULL
    );

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    password TEXT NOT NULL
);
