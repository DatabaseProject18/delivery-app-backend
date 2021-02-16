/**
* * Add new Customer to the database
*/
DROP PROCEDURE IF EXISTS insert_customer;
DELIMITER $$
CREATE PROCEDURE insert_customer(
	firstName varchar(50),
    lastName varchar(50),
    emailAdd VARCHAR(255),
    lAddress VARCHAR(255),
    customerType varchar(255),
    userPassword VARCHAR(255),
    contactNo VARCHAR(20),
    registeredDate DATE
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
	START TRANSACTION;
		INSERT INTO user_data(first_name,last_name,email,address,registered_date,user_type) VALUES (firstName,lastName,emailAdd,lAddress,registeredDate,"customer");
		INSERT INTO user_account(user_id,email,password) VALUES (LAST_INSERT_ID(),emailAdd,userPassword);
        INSERT INTO user_contact_number(user_id,contact_no) VALUES (LAST_INSERT_ID(),contactNo);
        INSERT INTO customer(user_id,type) VALUES (LAST_INSERT_ID(),customerType);
    COMMIT;
END $$
DELIMITER ;