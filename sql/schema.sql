DROP DATABASE IF EXISTS supply_chain_management_db;
CREATE DATABASE supply_chain_management_db;

USE supply_chain_management_db;

-- Customer Type
CREATE TABLE customer_type (
    type_id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50)
);

-- Customer Table
CREATE TABLE customer
(
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(255) UNIQUE,
    address VARCHAR(255),
    birth_date DATE,
    registered_date DATE,
    type_id INT,
    FOREIGN KEY (type_id)
        REFERENCES customer_type(type_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- Customer Contact No
CREATE TABLE customer_contact_no (
    customer_id INT, 
    contact_no VARCHAR(15), 
    FOREIGN KEY (customer_id)
        REFERENCES customer(customer_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    PRIMARY KEY (customer_id,contact_no)
);

-- Train Route
CREATE TABLE train_route(
    train_route_id INT AUTO_INCREMENT PRIMARY KEY,
    distance DECIMAL(5,2),
    average_time TIME,
    destination VARCHAR(100)
);

-- Truck Route
CREATE TABLE truck_route(
    truck_route_id INT AUTO_INCREMENT PRIMARY KEY,
    distance DECIMAL(5,2),
    average_time TIME,
    train_route_id INT,
    FOREIGN KEY (train_route_id)
        REFERENCES train_route(train_route_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- Order Table
CREATE TABLE order_table(
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    order_date DATE,
    delivery_date DATE,
    customer_id INT,
    route_id INT,
    cost DECIMAL(12, 2), 
    FOREIGN KEY (customer_id) 
        REFERENCES customer(customer_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (route_id) 
        REFERENCES truck_route(truck_route_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE    
);

-- Payment Method Table
CREATE TABLE payment_method(
    payment_method_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50)
);


-- Payment Table
CREATE TABLE payment(
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    payment_method INT,
    amount DECIMAL(12,2),
    payment_date DATE,
    FOREIGN KEY (order_id) 
        REFERENCES order_table(order_id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
    FOREIGN KEY (payment_method) 
        REFERENCES payment_method(payment_method_id)
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
    product_name VARCHAR(100),
    category_id INT,
    product_volume DECIMAL(7,2),
    unit_price DECIMAL(7,2),
    product_description VARCHAR(255),
    discount DECIMAL(4,2),
    FOREIGN KEY (category_id)
        REFERENCES product_category(category_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

--  Ordered product 
CREATE TABLE ordered_product(
    order_id INT,
    product_id INT,
    quantity DECIMAL(7,2),
    item_price DECIMAL(7,2),
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
    registration_no VARCHAR(20),
    truck_capacity DECIMAL(5, 2)
);

-- Train table
CREATE TABLE train(
    train_id INT AUTO_INCREMENT PRIMARY KEY,
    train_name VARCHAR(50),
    train_capacity DECIMAL(5, 2),
    train_route_id INT,
    FOREIGN KEY (train_route_id)
        REFERENCES train_route(train_route_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- Train time table
CREATE TABLE train_time_table(
    train_time_table_id INT AUTO_INCREMENT PRIMARY KEY,
    train_id INT,
    day VARCHAR(10),
    start_time TIME,
    finish_time TIME,
    FOREIGN KEY (train_id)
        REFERENCES train(train_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- Train schedule
CREATE TABLE train_schedule(
    order_id INT PRIMARY KEY,
    train_time_table_id INT,
    FOREIGN KEY (order_id)
        REFERENCES order_table(order_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (train_time_table_id)
        REFERENCES train_time_table(train_time_table_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- Covered Area
CREATE TABLE covered_area(
    truck_route_id INT,
    town VARCHAR(20),
    meet_position INT,
    FOREIGN KEY (truck_route_id)
        REFERENCES truck_route(truck_route_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    PRIMARY KEY (truck_route_id,town)
);


-- Driver
CREATE TABLE driver(
    driver_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    address VARCHAR(255),
    birth_date DATE,
    total_work_hours DECIMAL(5,2)
);

-- Driver Assistant
CREATE TABLE driver_assistant(
    driver_assistant_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    address VARCHAR(255),
    birth_date DATE,
    total_work_hours DECIMAL(5,2)
);


-- Driver Contact No
CREATE TABLE driver_contact_no (
    driver_id INT, 
    contact_no VARCHAR(10), 
    FOREIGN KEY (driver_id)
        REFERENCES driver(driver_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    PRIMARY KEY (driver_id,contact_no)
);

-- Driver Assistant Contact No
CREATE TABLE driver_assistant_contact_no (
    driver_assistant_id INT, 
    contact_no VARCHAR(10), 
    FOREIGN KEY (driver_assistant_id)
        REFERENCES driver_assistant(driver_assistant_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    PRIMARY KEY(driver_assistant_id,contact_no)
);

-- Truck Schedule
CREATE TABLE truck_schedule(
    truck_schedule_id INT PRIMARY KEY,
    truck_route_id INT,
    truck_id INT,
    date_time DATETIME,
    driver_id INT,
    driver_assistant_id INT,
    FOREIGN KEY (truck_route_id)
        REFERENCES truck_route(truck_route_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (truck_id)
        REFERENCES truck(truck_id)
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
    truck_schedule_id INT, 
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