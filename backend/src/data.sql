

-- USE smart_inventory;


-- Seed data for organisation table
INSERT INTO organisations (name, address) VALUES
('Tech Solutions Inc.', '123 Business Park, New York, NY 10001'),
('Global Retailers LLC', '456 Commerce Ave, Chicago, IL 60601'),
('Green Foods Co.', '789 Organic Lane, San Francisco, CA 94103');

-- Seed data for users table
INSERT INTO users (name, profile, email, role, designation, password, org_id) VALUES
('John Smith', 'https://example.com/profiles/john.jpg', 'john.smith@techsolutions.com', 'superadmin', 'Owner', '$$2y$10$0JjpWD9sBFsBQFXifsTwNer.2EDb1CjOO9NHV6.LDMijTnHMbHmjG', 1),
('Sarah Johnson', 'https://example.com/profiles/sarah.jpg', 'sarah.j@techsolutions.com', 'staff', 'Sales Associate', '$$2y$10$0JjpWD9sBFsBQFXifsTwNer.2EDb1CjOO9NHV6.LDMijTnHMbHmjG', 1),
('Michael Chen', 'https://example.com/profiles/michael.jpg', 'michael.c@globalretailers.com', 'superadmin', 'Director', '$$2y$10$0JjpWD9sBFsBQFXifsTwNer.2EDb1CjOO9NHV6.LDMijTnHMbHmjG', 2),
('Emily Wilson', 'https://example.com/profiles/emily.jpg', 'emily.w@globalretailers.com', 'staff', 'Inventory Clerk', '$$2y$10$0JjpWD9sBFsBQFXifsTwNer.2EDb1CjOO9NHV6.LDMijTnHMbHmjG', 2),
('David Brown', 'https://example.com/profiles/david.jpg', 'david.b@greenfoods.com', 'superadmin', 'Owner', '$$2y$10$0JjpWD9sBFsBQFXifsTwNer.2EDb1CjOO9NHV6.LDMijTnHMbHmjG', 3);

-- Seed data for expense_categories table
INSERT INTO expense_categories (org_id, name, monthly_limit) VALUES
(1, 'Office Supplies', 500.00),
(1, 'Utilities', 1200.00),
(1, 'Marketing', 3000.00),
(2, 'Warehouse Maintenance', 2500.00),
(2, 'Shipping', 5000.00),
(3, 'Organic Certification', 800.00),
(3, 'Farm Equipment', 1500.00);

-- Seed data for expenses table
INSERT INTO expenses (org_id, category_id, amount, date, notes) VALUES
(1, 1, 125.50, '2023-06-05', 'Printer paper, pens, notebooks'),
(1, 2, 1150.75, '2023-06-15', 'Electricity and internet bill'),
(1, 3, 2750.00, '2023-06-20', 'Google Ads campaign'),
(2, 4, 1875.25, '2023-06-10', 'HVAC maintenance'),
(2, 5, 4320.00, '2023-06-18', 'FedEx bulk shipping'),
(3, 6, 750.00, '2023-06-01', 'Annual organic certification renewal'),
(3, 7, 1325.50, '2023-06-25', 'New irrigation system parts');

-- Seed data for incomes_categories table
INSERT INTO incomes_categories (org_id, name) VALUES
(1, 'Software Sales'),
(1, 'Consulting Services'),
(2, 'Retail Sales'),
(2, 'Online Sales'),
(3, 'Farmers Market'),
(3, 'Wholesale Orders');

-- Seed data for incomes table
INSERT INTO incomes (org_id, amount, date, category_id, notes) VALUES
(1, 12500.00, '2023-06-10', 1, 'Enterprise license sales'),
(1, 7500.00, '2023-06-20', 2, 'Client implementation project'),
(2, 32450.25, '2023-06-15', 3, 'In-store sales'),
(2, 28750.75, '2023-06-25', 4, 'E-commerce platform sales'),
(3, 8750.00, '2023-06-05', 5, 'Weekly farmers market'),
(3, 15000.00, '2023-06-18', 6, 'Restaurant wholesale order');

-- Seed data for product_categories table
INSERT INTO product_categories (org_id, name) VALUES
(1, 'Software Licenses'),
(1, 'Hardware'),
(2, 'Electronics'),
(2, 'Home Goods'),
(3, 'Produce'),
(3, 'Dairy');

-- Seed data for products table
INSERT INTO products (org_id, category_id, name, quantity, threshold, price, supplier, notes) VALUES
(1, 1, 'Business Pro Suite', 50, 10, 499.99, 'Internal', 'Annual subscription license'),
(1, 1, 'Security Add-on', 75, 15, 149.99, 'Internal', 'Monthly subscription'),
(1, 2, 'Office Router', 12, 3, 199.95, 'NetGear Inc.', 'WiFi 6 compatible'),
(2, 3, 'Smart TV 55"', 25, 5, 799.00, 'Samsung Electronics', '2023 QLED model'),
(2, 3, 'Wireless Earbuds', 48, 10, 129.99, 'SoundTech', 'Noise cancelling'),
(2, 4, 'Ceramic Dinner Set', 36, 8, 89.95, 'HomeStyle', '12-piece set'),
(3, 5, 'Organic Apples', 150, 30, 1.99, 'Local Farms', 'Honeycrisp variety'),
(3, 5, 'Heirloom Tomatoes', 120, 25, 2.49, 'Local Farms', 'Assorted colors'),
(3, 6, 'Organic Milk', 80, 20, 5.99, 'Happy Cows Dairy', 'Half gallon');