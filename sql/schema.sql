DROP DATABASE IF EXISTS supply_chain_management_db;
CREATE DATABASE supply_chain_management_db;

USE supply_chain_management_db;

-- Customer Type
CREATE TABLE customer_type (
    type VARCHAR(50) PRIMARY KEY
);

-- User Type
CREATE TABLE user_type(
    type VARCHAR(50) PRIMARY KEYb
);

-- Store
CREATE TABLE store(
    store_id INT AUTO_INCREMENT PRIMARY KEY,
    store_name VARCHAR(50) NOT NULL,
    destination VARCHAR(50) NOT NULL
);

-- User Data
CREATE TABLE user_data(
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    address VARCHAR(255) NOT NULL,
    registered_date DATE NOT NULL,
    user_type VARCHAR(50),
    FOREIGN KEY (user_type)
        REFERENCES user_type(type)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
);

-- Customer Table
CREATE TABLE customer(
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    type VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id)
        REFERENCES user_data(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (type)
        REFERENCES customer_type(type)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- Train Route
CREATE TABLE train_route(
    train_route_id INT AUTO_INCREMENT PRIMARY KEY,
    distance DECIMAL(5,2) NOT NULL,
    average_time DECIMAL(3,2) NOT NULL,
    store_id INT,
    FOREIGN KEY (store_id)
        REFERENCES store(store_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- Truck route
CREATE TABLE truck_route(
    truck_route_id INT AUTO_INCREMENT PRIMARY KEY,
    distance DECIMAL(5,2) NOT NULL,
    average_time DECIMAL(3,2) NOT NULL,
    train_route_id INT,
    FOREIGN KEY (train_route_id)
        REFERENCES train_route(train_route_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    
);

CREATE TABLE order_status(
    order_status VARCHAR(10) PRIMARY KEY
);

-- Order Table
CREATE TABLE order_table(
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    order_date DATE NOT NULL,
    delivery_date DATE NOT NULL,
    customer_id INT,
    route_id INT,
    cost DECIMAL(12, 2) NOT NULL, 
    order_status VARCHAR(10) DEFAULT "cart",
    FOREIGN KEY (customer_id) 
        REFERENCES customer(customer_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (route_id) 
        REFERENCES truck_route(truck_route_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (order_status) 
        REFERENCES order_status(order_status)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
);

-- Payment Method Table
CREATE TABLE payment_method(
    name VARCHAR(50) PRIMARY KEY
);


-- Payment Table
CREATE TABLE payment(
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    payment_method VARCHAR(50),
    amount DECIMAL(12,2),
    payment_date DATE,
    FOREIGN KEY (order_id) 
        REFERENCES order_table(order_id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
    FOREIGN KEY (payment_method) 
        REFERENCES payment_method(name)
        ON UPDATE CASCADE
        ON DELETE CASCADE   
);

-- Product category table
CREATE TABLE product_category(
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50)
);

-- Product Table
CREATE TABLE product
(
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    category_id INT,
    product_volume DECIMAL(7,2) NOT NULL,
    unit_price DECIMAL(7,2) NOT NULL,
    product_description VARCHAR(255),
    discount DECIMAL(4,2),
    stock INT CHECK (stock >= 0),
    FOREIGN KEY (category_id)
        REFERENCES product_category(category_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

--  Ordered product 
CREATE TABLE ordered_product(
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity DECIMAL(7,2) NOT NULL,
    item_price DECIMAL(7,2) NOT NULL,
    FOREIGN KEY (order_id)
        REFERENCES order_table(order_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (product_id)
        REFERENCES product(product_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    PRIMARY KEY (order_id,product_id)
);

-- Truck table
CREATE TABLE truck(
    truck_id INT AUTO_INCREMENT PRIMARY KEY,
    registration_no VARCHAR(20) NOT NULL,
    truck_capacity DECIMAL(5, 2) NOT NULL
);

-- Train table
CREATE TABLE train(
    train_id INT AUTO_INCREMENT PRIMARY KEY,
    train_name VARCHAR(50) NOT NULL,
    train_capacity DECIMAL(5, 2) NOT NULL,
    train_route_id INT NOT NULL,
    FOREIGN KEY (train_route_id)
        REFERENCES train_route(train_route_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- Train time table
CREATE TABLE train_time_table(
    train_time_table_id INT AUTO_INCREMENT PRIMARY KEY,
    train_id INT NOT NULL,
    day VARCHAR(10),
    start_time TIME,
    finish_time TIME,
    FOREIGN KEY (train_id)
        REFERENCES train(train_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- Staff
CREATE TABLE staff(
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    salary DECIMAL(7,2) NOT NULL,
    FOREIGN KEY (user_id)
        REFERENCES user_data(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- Delivery Manager
CREATE TABLE delivery_manager(
    delivery_manager_id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT,
    FOREIGN KEY (staff_id)
        REFERENCES staff(staff_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- Train schedule
CREATE TABLE train_schedule(
    order_id INT PRIMARY KEY,
    train_time_table_id INT,
    delivery_manager_id INT,
    FOREIGN KEY (order_id)
        REFERENCES order_table(order_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (train_time_table_id)
        REFERENCES train_time_table(train_time_table_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (delivery_manager_id)
        REFERENCES delivery_manager(delivery_manager_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- Covered Area
CREATE TABLE covered_area(
    truck_route_id INT,
    town VARCHAR(20) NOT NULL,
    meet_position INT NOT NULL,
    FOREIGN KEY (truck_route_id)
        REFERENCES truck_route(truck_route_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    PRIMARY KEY (truck_route_id,town)
);

-- Store Manager
CREATE TABLE store_manager(
    store_manager_id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT,
    store_id INT,
    FOREIGN KEY (staff_id)
        REFERENCES staff(staff_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE ,
    FOREIGN KEY (store_id)
        REFERENCES store(store_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE 
);

-- Driver Assistant
CREATE TABLE driver_assistant(
    driver_assistant_id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT,
    store_id INT,
    total_work_hours DECIMAL(5,2) NOT NULL,
    FOREIGN KEY (staff_id)
        REFERENCES staff(staff_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE ,
    FOREIGN KEY (store_id)
        REFERENCES store(store_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE 
);

-- Driver
CREATE TABLE driver(
    driver_id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT,
    store_id INT,
    total_work_hours DECIMAL(5,2) NOT NULL,
    FOREIGN KEY (staff_id)
        REFERENCES staff(staff_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE ,
    FOREIGN KEY (store_id)
        REFERENCES store(store_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE 
);

-- Truck Schedule
CREATE TABLE truck_schedule(
    truck_schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    truck_route_id INT,
    truck_id INT ,
    date_time DATETIME  NOT NULL,
    store_manager_id INT,
    driver_id INT ,
    driver_assistant_id INT,
    FOREIGN KEY (truck_route_id)
        REFERENCES truck_route(truck_route_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (truck_id)
        REFERENCES truck(truck_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (store_manager_id)
        REFERENCES store_manager(store_manager_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (driver_id)
        REFERENCES driver(driver_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (driver_assistant_id)
        REFERENCES driver_assistant(driver_assistant_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- Scheduled Order
CREATE TABLE scheduled_order (
    order_id INT, 
    truck_schedule_id INT , 
    FOREIGN KEY (order_id)
        REFERENCES order_table(order_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (truck_schedule_id)
        REFERENCES truck_schedule(truck_schedule_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    PRIMARY KEY (order_id,truck_schedule_id)
);

-- User Account
CREATE TABLE user_account(
    user_id INT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    status BOOLEAN DEFAULT true,
    FOREIGN KEY (user_id)
        REFERENCES user_data(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- User Contact Number
CREATE TABLE user_contact_number(
    user_id INT,
    contact_no VARCHAR(20) PRIMARY KEY,
    FOREIGN KEY (user_id)
        REFERENCES user_data(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


-- Company Manaager 
CREATE TABLE company_manager(
    company_manager_id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT,
    FOREIGN KEY (staff_id)
        REFERENCES staff(staff_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


-- Admin
CREATE TABLE admin(
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    FOREIGN KEY (user_id)
        REFERENCES user_data(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE 
);

-- Rferesh token store
CREATE TABLE refresh_token(
    token VARCHAR(255) PRIMARY KEY
);

-- Order cart
CREATE TABLE cart(
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    product_id INT,
    quantity INT CHECK (quantity > 0),
    is_delete BOOLEAN DEFAULT fales,
    FOREIGN KEY (customer_id)
        REFERENCES customer(customer_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE, 
    FOREIGN KEY (product_id)
        REFERENCES product(product_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
);
