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
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);
-- INSERT INTO categories(name) VALUES('Food');
-- INSERT INTO categories(name) VALUES('Clothes');
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id bigint;
-- ALTER TABLE products ADD CONSTRAINT fk_categories foreign key (category_id) REFERENCES categories (id);
