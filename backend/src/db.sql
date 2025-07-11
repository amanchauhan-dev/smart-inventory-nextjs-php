-- Drop and create the database
-- DROP DATABASE IF EXISTS smart_inventory;
-- CREATE DATABASE smart_inventory;
-- USE smart_inventory;


CREATE TABLE organisations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    profile VARCHAR(255),
    email VARCHAR(100) NOT NULL UNIQUE,
    role ENUM('staff', 'admin', 'superadmin') DEFAULT 'staff',
    designation VARCHAR(20),
    password VARCHAR(255),
    org_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (org_id) REFERENCES organisations(id) ON DELETE CASCADE
);


-- Expense categories (with monthly limit)
CREATE TABLE expense_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    org_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    monthly_limit DECIMAL(10,2) DEFAULT 0,

    FOREIGN KEY (org_id) REFERENCES organisations(id) ON DELETE CASCADE
);

-- Expenses table
CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    org_id INT NOT NULL,
    category_id INT,
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (org_id) REFERENCES organisations(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES expense_categories(id) ON DELETE CASCADE ON UPDATE SET NULL
);


-- Expense categories (with monthly limit)
CREATE TABLE incomes_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    org_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,

    FOREIGN KEY (org_id) REFERENCES organisations(id) ON DELETE CASCADE
);

-- Incomes table (simple category string)
CREATE TABLE incomes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    org_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    category_id INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (org_id) REFERENCES organisations(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES incomes_categories(id) ON DELETE CASCADE ON UPDATE SET NULL
);


-- Product categories
CREATE TABLE product_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    org_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,

    FOREIGN KEY (org_id) REFERENCES organisations(id) ON DELETE CASCADE
);

-- Products / Inventory table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    org_id INT NOT NULL,
    category_id INT,     -- require
    name VARCHAR(100) NOT NULL,  -- require
    quantity INT NOT NULL,    -- require
    threshold INT DEFAULT 0,
    price DECIMAL(10,2) NOT NULL,   -- require
    supplier VARCHAR(100),   
    notes TEXT,                 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (org_id) REFERENCES organisations(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE SET NULL
);

