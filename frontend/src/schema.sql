
CREATE TYPE user_role AS ENUM ('staff', 'admin', 'superadmin');

CREATE TABLE organisations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    profile VARCHAR(255),
    email VARCHAR(100) NOT NULL UNIQUE,
    role user_role DEFAULT 'staff',
    designation VARCHAR(20),
    password VARCHAR(255),
    org_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (org_id) REFERENCES organisations(id) ON DELETE CASCADE
);

CREATE TABLE expense_categories (
    id SERIAL PRIMARY KEY,
    org_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    monthly_limit NUMERIC(10,2) DEFAULT 0,

    FOREIGN KEY (org_id) REFERENCES organisations(id) ON DELETE CASCADE
);

CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    org_id INT NOT NULL,
    category_id INT,
    amount NUMERIC(10,2) NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (org_id) REFERENCES organisations(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES expense_categories(id) ON DELETE CASCADE
);

CREATE TABLE incomes_categories (
    id SERIAL PRIMARY KEY,
    org_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,

    FOREIGN KEY (org_id) REFERENCES organisations(id) ON DELETE CASCADE
);

CREATE TABLE incomes (
    id SERIAL PRIMARY KEY,
    org_id INT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    date DATE NOT NULL,
    category_id INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (org_id) REFERENCES organisations(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES incomes_categories(id) ON DELETE CASCADE
);

CREATE TABLE product_categories (
    id SERIAL PRIMARY KEY,
    org_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,

    FOREIGN KEY (org_id) REFERENCES organisations(id) ON DELETE CASCADE
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    org_id INT NOT NULL,
    category_id INT,
    name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    threshold INT DEFAULT 0,
    price NUMERIC(10,2) NOT NULL,
    supplier VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (org_id) REFERENCES organisations(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE SET NULL
);
