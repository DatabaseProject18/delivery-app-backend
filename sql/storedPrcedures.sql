/*
 *Add new Customer to the database
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

/*
 * Get all income for each years
 */
 DROP PROCEDURE IF EXISTS get_years_income;
 DELIMITER $$
 CREATE PROCEDURE get_years_income()
 BEGIN
		SELECT YEAR(order_date) AS order_year,SUM(cost) AS income FROM order_table WHERE order_status != "Canceled" GROUP BY(order_year);
 END $$
 DELIMITER ;

 /*
  * Get all quarterly income for given year
  */
  DROP PROCEDURE IF EXISTS get_quarterly_income_of_year;
  DELIMITER $$
  CREATE PROCEDURE get_quarterly_income_of_year(
		year CHAR(4)
	)
  BEGIN
		SELECT 1 AS quarter,SUM(cost) AS income,COUNT(*) AS num_of_orders
		FROM order_table
		WHERE (order_date BETWEEN CONCAT(year,'-01-01') AND CONCAT(year,'-03-31')) AND order_status != 'Canceled'
		UNION
		SELECT 2 AS quarter,SUM(cost) AS income,COUNT(*) AS num_of_orders
		FROM order_table
		WHERE (order_date BETWEEN CONCAT(year,'-04-01') AND CONCAT(year,'-06-30')) AND order_status != 'Canceled'
		UNION
		SELECT 3 AS quarter,SUM(cost) AS income,COUNT(*) AS num_of_orders
		FROM order_table
		WHERE (order_date BETWEEN CONCAT(year,'-07-01') AND CONCAT(year,'-09-30')) AND order_status != 'Canceled'
		UNION
		SELECT 4 AS quarter,SUM(cost) AS income,COUNT(*) AS num_of_orders
		FROM order_table
		WHERE (order_date BETWEEN CONCAT(year,'-10-01') AND CONCAT(year,'-12-31')) AND order_status != 'Canceled';
  END $$
  DELIMITER ;

	/*
	 * Get all basic order details of quarterly placed order
	 */
	 DROP PROCEDURE IF EXISTS get_quarterly_basic_order_details;
	 DELIMITER $$
	 CREATE PROCEDURE get_quarterly_basic_order_details(
		 start_date DATE,
		 end_date DATE
	 )
	 BEGIN
				SELECT o.order_date,o.cost,s.destination,o.order_status
				FROM order_table o
				JOIN truck_route t ON o.route_id = t.truck_route_id
				JOIN train_route tr USING(train_route_id) JOIN store s USING(store_id)
				WHERE (order_date BETWEEN start_date AND end_date) AND order_status != 'Canceled';
	 END $$
	 DELIMITER ;

	 /*
 	 * Get all order counts for a products
 	 */
 	 DROP PROCEDURE IF EXISTS get_order_count_of_product;
 	 DELIMITER $$
 	 CREATE PROCEDURE get_order_count_of_product()
 	 BEGIN
 				SELECT p.product_id,p.product_name,p.product_volume,c.category_name,p.unit_price,p.discount,COUNT(cost) AS num_of_orders, SUM(op.quantity) AS quantity
				FROM order_table o
				JOIN ordered_product op USING(order_id)
				RIGHT JOIN product p USING(product_id)
				JOIN product_category c USING(category_id)
				WHERE o.order_status != "Canceled" OR o.order_status IS NULL
				GROUP BY p.product_id
				ORDER BY num_of_orders DESC,quantity DESC;
 	 END $$
 	 DELIMITER ;

	 /*
 	 * Get all order counts for a products in given year
 	 */
 	 DROP PROCEDURE IF EXISTS get_order_count_of_product_in_year;
 	 DELIMITER $$
 	 CREATE PROCEDURE get_order_count_of_product_in_year(
		 year CHAR(4)
	 )
 	 BEGIN
 				SELECT p.product_id,p.product_name,p.product_volume,c.category_name,p.unit_price,p.discount,COUNT(cost) AS num_of_orders, SUM(op.quantity) AS quantity
				FROM (SELECT * FROM order_table WHERE YEAR(order_date) = year) o
				JOIN ordered_product op USING(order_id)
				RIGHT JOIN product p USING(product_id)
				JOIN product_category c USING(category_id)
				WHERE o.order_status != "Canceled" OR o.order_status IS NULL
				GROUP BY p.product_id
				ORDER BY num_of_orders DESC,quantity DESC;
 	 END $$
 	 DELIMITER ;


	 /*
 	 * Get all sales according to the main cities and routes
 	 */
 	 DROP PROCEDURE IF EXISTS get_income_according_to_routes_cities;
 	 DELIMITER $$
 	 CREATE PROCEDURE get_income_according_to_routes_cities()
 	 BEGIN
 				SELECT CONCAT(get_first_meet_town_of_route(tr.truck_route_id),"-",get_last_meet_town_of_route(tr.truck_route_id)) AS route_name, ca.town AS delivery_town,s.store_name,s.destination AS train_destination,COUNT(cost) AS number_of_orders,SUM(o.cost) AS income
				FROM covered_area ca
				JOIN truck_route tr USING(truck_route_id)
				JOIN train_route tar USING(train_route_id)
				JOIN store s USING(store_id)
				LEFT JOIN order_table o ON ca.truck_route_id = o.route_id AND ca.meet_position = o.meet_position
				WHERE o.order_status != "Canceled" OR o.order_status IS NULL
				GROUP BY route_name,delivery_town,store_name,train_destination
				ORDER BY income DESC;
 	 END $$
 	 DELIMITER ;

	 /*
 	 * Get all sales according to the main cities and routes in a year
 	 */
 	 DROP PROCEDURE IF EXISTS get_income_according_to_routes_cities_year;
 	 DELIMITER $$
 	 CREATE PROCEDURE get_income_according_to_routes_cities_year(
		 year CHAR(4)
	 )
 	 BEGIN
 				SELECT CONCAT(get_first_meet_town_of_route(tr.truck_route_id),"-",get_last_meet_town_of_route(tr.truck_route_id)) AS route_name, ca.town AS delivery_town,s.store_name,s.destination AS train_destination,COUNT(cost) AS number_of_orders,SUM(o.cost) AS income
				FROM covered_area ca
				JOIN truck_route tr USING(truck_route_id)
				JOIN train_route tar USING(train_route_id)
				JOIN store s USING(store_id)
				LEFT JOIN (SELECT * FROM order_table WHERE YEAR(order_date) = 2020) o ON ca.truck_route_id = o.route_id AND ca.meet_position = o.meet_position
				WHERE o.order_status != "Canceled" OR order_status IS NULL
				GROUP BY route_name,delivery_town,store_name,train_destination
				ORDER BY income DESC,number_of_orders DESC;
 	 END $$
 	 DELIMITER ;

	 /*
 	 * Get working hours of drivers
 	 */
 	 DROP PROCEDURE IF EXISTS get_working_hours_of_drivers;
 	 DELIMITER $$
 	 CREATE PROCEDURE get_working_hours_of_drivers()
 	 BEGIN
 				SELECT u.user_id,CONCAT(u.first_name," ",u.last_name) AS name, u.email, u.address,sr.store_name AS working_place,COUNT(average_time) AS num_of_turns,SUM(tr.average_time) AS total_working_hours
				FROM user_data u
				JOIN staff s USING(user_id)
				JOIN driver d USING(staff_id)
				JOIN store sr USING(store_id)
				LEFT JOIN truck_schedule ts USING(driver_id)
				LEFT JOIN truck_route tr USING(truck_route_id)
				GROUP BY u.user_id,name,u.email,u.address,working_place
				ORDER BY total_working_hours DESC,num_of_turns DESC;
 	 END $$
 	 DELIMITER ;

	 /*
 	 * Get working hours of drivers in given year
 	 */
 	 DROP PROCEDURE IF EXISTS get_working_hours_of_drivers_in_year;
 	 DELIMITER $$
 	 CREATE PROCEDURE get_working_hours_of_drivers_in_year(
		 year CHAR(4)
	 )
 	 BEGIN
 				SELECT u.user_id,CONCAT(u.first_name," ",u.last_name) AS name, u.email, u.address,sr.store_name AS working_place,COUNT(average_time) AS num_of_turns,SUM(tr.average_time) AS total_working_hours
				FROM user_data u
				JOIN staff s USING(user_id)
				JOIN driver d USING(staff_id)
				JOIN store sr USING(store_id)
				LEFT JOIN (SELECT * FROM truck_schedule WHERE YEAR(date_time) = year) ts USING(driver_id)
				LEFT JOIN truck_route tr USING(truck_route_id)
				GROUP BY u.user_id,name,u.email,u.address,working_place
				ORDER BY total_working_hours DESC,num_of_turns DESC;
 	 END $$
 	 DELIMITER ;

	 /*
 	 * Get working hours of drivers in given year and month
 	 */
 	 DROP PROCEDURE IF EXISTS get_working_hours_of_drivers_in_year_in_month;
 	 DELIMITER $$
 	 CREATE PROCEDURE get_working_hours_of_drivers_in_year_in_month(
		 year CHAR(4),
		 month CHAR(2)
	 )
 	 BEGIN
 				SELECT u.user_id,CONCAT(u.first_name," ",u.last_name) AS name, u.email, u.address,sr.store_name AS working_place,COUNT(average_time) AS num_of_turns,SUM(tr.average_time) AS total_working_hours
				FROM user_data u
				JOIN staff s USING(user_id)
				JOIN driver d USING(staff_id)
				JOIN store sr USING(store_id)
				LEFT JOIN (SELECT * FROM truck_schedule WHERE YEAR(date_time) = year AND MONTH(date_time) = month) ts USING(driver_id)
				LEFT JOIN truck_route tr USING(truck_route_id)
				GROUP BY u.user_id,name,u.email,u.address,working_place
				ORDER BY total_working_hours DESC,num_of_turns DESC;
 	 END $$
 	 DELIMITER ;

	 /*
 	 * Get working hours of driver assistants
 	 */
 	 DROP PROCEDURE IF EXISTS get_working_hours_of_driver_assistants;
 	 DELIMITER $$
 	 CREATE PROCEDURE get_working_hours_of_driver_assistants()
 	 BEGIN
 				SELECT u.user_id,CONCAT(u.first_name," ",u.last_name) AS name, u.email, u.address,sr.store_name AS working_place,COUNT(average_time) AS num_of_turns,SUM(tr.average_time) AS total_working_hours
				FROM user_data u
				JOIN staff s USING(user_id)
				JOIN driver_assistant d USING(staff_id)
				JOIN store sr USING(store_id)
				LEFT JOIN truck_schedule ts USING(driver_assistant_id)
				LEFT JOIN truck_route tr USING(truck_route_id)
				GROUP BY u.user_id,name,u.email,u.address,working_place
				ORDER BY total_working_hours DESC,num_of_turns DESC;
 	 END $$
 	 DELIMITER ;

	 /*
 	 * Get working hours of driver assistants in given year
 	 */
 	 DROP PROCEDURE IF EXISTS get_working_hours_of_driver_assistants_in_year;
 	 DELIMITER $$
 	 CREATE PROCEDURE get_working_hours_of_driver_assistants_in_year(
		 year CHAR(4)
	 )
 	 BEGIN
 				SELECT u.user_id,CONCAT(u.first_name," ",u.last_name) AS name, u.email, u.address,sr.store_name AS working_place,COUNT(average_time) AS num_of_turns,SUM(tr.average_time) AS total_working_hours
				FROM user_data u
				JOIN staff s USING(user_id)
				JOIN driver_assistant d USING(staff_id)
				JOIN store sr USING(store_id)
				LEFT JOIN (SELECT * FROM truck_schedule WHERE YEAR(date_time) = year) ts USING(driver_assistant_id)
				LEFT JOIN truck_route tr USING(truck_route_id)
				GROUP BY u.user_id,name,u.email,u.address,working_place
				ORDER BY total_working_hours DESC,num_of_turns DESC;
 	 END $$
 	 DELIMITER ;

	 /*
 	 * Get working hours of driver assistants in given year and month
 	 */
 	 DROP PROCEDURE IF EXISTS get_working_hours_of_driver_assistants_in_year_in_month;
 	 DELIMITER $$
 	 CREATE PROCEDURE get_working_hours_of_driver_assistants_in_year_in_month(
		 year CHAR(4),
		 month CHAR(2)
	 )
 	 BEGIN
 				SELECT u.user_id,CONCAT(u.first_name," ",u.last_name) AS name, u.email, u.address,sr.store_name AS working_place,COUNT(average_time) AS num_of_turns,SUM(tr.average_time) AS total_working_hours
				FROM user_data u
				JOIN staff s USING(user_id)
				JOIN driver_assistant d USING(staff_id)
				JOIN store sr USING(store_id)
				LEFT JOIN (SELECT * FROM truck_schedule WHERE YEAR(date_time) = year AND MONTH(date_time) = month) ts USING(driver_assistant_id)
				LEFT JOIN truck_route tr USING(truck_route_id)
				GROUP BY u.user_id,name,u.email,u.address,working_place
				ORDER BY total_working_hours DESC,num_of_turns DESC;
 	 END $$
 	 DELIMITER ;

	 /*
	 * Get used hours of trucks
	 */
	 DROP PROCEDURE IF EXISTS get_used_hours_of_trucks;
	 DELIMITER $$
	 CREATE PROCEDURE get_used_hours_of_trucks()
	 BEGIN
	 		 SELECT t.truck_id,t.registration_no,t.truck_capacity, sr.store_name AS store,COUNT(tr.average_time) AS num_of_turns,SUM(tr.average_time) AS total_working_hours
	 		 FROM truck t
	 		 JOIN store sr USING(store_id)
	 		 LEFT JOIN truck_schedule ts USING(truck_id)
	 		 LEFT JOIN truck_route tr USING(truck_route_id)
	 		 GROUP BY t.truck_id,t.registration_no,t.truck_capacity,store
	 		 ORDER BY total_working_hours DESC,num_of_turns DESC;
	 END $$
	 DELIMITER ;

	 /*
	 * Get used hours of trucks in given year
	 */
	 DROP PROCEDURE IF EXISTS get_used_hours_of_trucks_in_year;
	 DELIMITER $$
	 CREATE PROCEDURE get_used_hours_of_trucks_in_year(
	 	year CHAR(4)
	 )
	 BEGIN
			SELECT t.truck_id,t.registration_no,t.truck_capacity, sr.store_name AS store,COUNT(tr.average_time) AS num_of_turns,SUM(tr.average_time) AS total_working_hours
			FROM truck t
			JOIN store sr USING(store_id)
			LEFT JOIN (SELECT * FROM truck_schedule WHERE YEAR(date_time) = year) ts USING(truck_id)
			LEFT JOIN truck_route tr USING(truck_route_id)
			GROUP BY t.truck_id,t.registration_no,t.truck_capacity,store
			ORDER BY total_working_hours DESC,num_of_turns DESC;
	 END $$
	 DELIMITER ;

	 /*
	 * Get used hours of trucks in given year and month
	 */
	 DROP PROCEDURE IF EXISTS get_used_hours_of_trucks_in_year_in_month;
	 DELIMITER $$
	 CREATE PROCEDURE get_used_hours_of_trucks_in_year_in_month(
	 	year CHAR(4),
	 	month CHAR(2)
	 )
	 BEGIN
			 SELECT t.truck_id,t.registration_no,t.truck_capacity, sr.store_name AS store,COUNT(tr.average_time) AS num_of_turns,SUM(tr.average_time) AS total_working_hours
			 FROM truck t
			 JOIN store sr USING(store_id)
			 LEFT JOIN (SELECT * FROM truck_schedule WHERE YEAR(date_time) = year AND MONTH(date_time) = month) ts USING(truck_id)
			 LEFT JOIN truck_route tr USING(truck_route_id)
			 GROUP BY t.truck_id,t.registration_no,t.truck_capacity,store
			 ORDER BY total_working_hours DESC,num_of_turns DESC;
	 END $$
	 DELIMITER ;

	 /*
	 * Get seles report of each customer
	 */
	 DROP PROCEDURE IF EXISTS get_seles_of_each_customer;
	 DELIMITER $$
	 CREATE PROCEDURE get_seles_of_each_customer()
	 BEGIN
				SELECT c.customer_id,CONCAT(u.first_name," ",u.last_name) AS name, u.email, u.address,c.type AS customer_type,COUNT(o.cost) AS num_of_orders,SUM(o.cost) AS income
				FROM user_data u
				JOIN customer c USING(user_id)
				LEFT JOIN order_table o USING(customer_id)
				WHERE order_status != 'Canceled' OR order_status IS NULL
				GROUP BY c.customer_id,name,u.email,u.address,customer_type
				ORDER BY income DESC,num_of_orders DESC;
	 END $$
	 DELIMITER ;

	 /*
	 *  Get seles report of each customer in given year
	 */
	 DROP PROCEDURE IF EXISTS get_seles_of_each_customer_in_year;
	 DELIMITER $$
	 CREATE PROCEDURE get_seles_of_each_customer_in_year(
		 year CHAR(4)
	 )
	 BEGIN
			 SELECT c.customer_id,CONCAT(u.first_name," ",u.last_name) AS name, u.email, u.address,c.type AS customer_type,COUNT(o.cost) AS num_of_orders,SUM(o.cost) AS income
			 FROM user_data u
			 JOIN customer c USING(user_id)
			 LEFT JOIN (SELECT * FROM order_table WHERE YEAR(order_date) = year) o USING(customer_id)
			 WHERE order_status != 'Canceled' OR order_status IS NULL
			 GROUP BY c.customer_id,name,u.email,u.address,customer_type
			 ORDER BY income DESC,num_of_orders DESC;
	 END $$
	 DELIMITER ;

	 /*
 	 * Get all basic order details of given customer
 	 */
 	 DROP PROCEDURE IF EXISTS get_customer_basic_order_details;
 	 DELIMITER $$
 	 CREATE PROCEDURE get_customer_basic_order_details(
		 customerId INT
	 )
 	 BEGIN
 				SELECT o.order_date,o.cost,s.destination,o.order_status
 				FROM order_table o
 				JOIN truck_route t ON o.route_id = t.truck_route_id
 				JOIN train_route tr USING(train_route_id)
				JOIN store s USING(store_id)
 				WHERE customer_id = customerId;
 	 END $$
 	 DELIMITER ;

	 /*
	 * Get order count by status
	 */
	 DROP PROCEDURE IF EXISTS get_order_count_by_status;
	 DELIMITER $$
	 CREATE PROCEDURE get_order_count_by_status()
	 BEGIN
	 		 SELECT order_status,COUNT(*) AS num_of_orders
	 		 FROM order_table
	 		 GROUP BY order_status;
	 END $$
	 DELIMITER ;


	 /*
	 * Get all years that have orders
	 */
	 DROP PROCEDURE IF EXISTS get_all_years;
	 DELIMITER $$
	 CREATE PROCEDURE get_all_years()
	 BEGIN
	 		SELECT DISTINCT YEAR(order_date) AS year
	 		FROM order_table;
	 END $$
	 DELIMITER ;

	 /*
	 * Get count of search result
	 */
	 DROP PROCEDURE IF EXISTS get_search_result_count;
	 DELIMITER $$
	 CREATE PROCEDURE get_search_result_count(
		 name VARCHAR(255)
	 )
	 BEGIN
			SELECT COUNT(*) AS count
			FROM product
			WHERE MATCH(product_name) AGAINST(name IN BOOLEAN MODE);
	 END $$
	 DELIMITER ;

	 /*
	 * Get count of category search result
	 */
	 DROP PROCEDURE IF EXISTS get_category_search_result_count;
	 DELIMITER $$
	 CREATE PROCEDURE get_category_search_result_count(
		 name VARCHAR(255),
		 category INT
	 )
	 BEGIN
			SELECT COUNT(*) AS count
			FROM product
			WHERE MATCH(product_name) AGAINST(name IN BOOLEAN MODE) AND category_id = category;
	 END $$
	 DELIMITER ;

	 /*
	 * Search by product name
	 */
	 DROP PROCEDURE IF EXISTS get_result_of_search_by_product_name;
	 DELIMITER $$
	 CREATE PROCEDURE get_result_of_search_by_product_name(
		 name VARCHAR(1000),
		 offsetNo INT,
		 numOfItem INT
	 )
	 BEGIN
			SELECT product_id,product_name, unit_price, product_description, discount
			FROM product
			WHERE MATCH(product_name) AGAINST(name IN BOOLEAN MODE)
			LIMIT offsetNo,numOfItem;
	 END $$
	 DELIMITER ;

	 /*
	 * Search by product name and filter by category
	 */
	 DROP PROCEDURE IF EXISTS get_result_of_search_by_product_name_filter_by_category;
	 DELIMITER $$
	 CREATE PROCEDURE get_result_of_search_by_product_name_filter_by_category(
		 name VARCHAR(1000),
		 offsetNo INT,
		 numOfItem INT,
		 category INT
	 )
	 BEGIN
			SELECT product_id,product_name, unit_price, product_description, discount
			FROM product
			WHERE MATCH(product_name) AGAINST(name IN BOOLEAN MODE) AND category_id = category
			LIMIT offsetNo,numOfItem;
	 END $$
	 DELIMITER ;


    /*
	 * Get total volume of an order
	 */
    DROP PROCEDURE IF EXISTS get_total_volume;
    DELIMITER $$
    CREATE PROCEDURE get_total_volume(
        order_id DECIMAL
    )
    BEGIN
            SELECT supply_chain_management_db.get_total_volume_of_order(order_id)
    END $$
    DELIMITER ;


 	/*
	 * update product stock after cancel order
	 */
	DROP PROCEDURE IF EXISTS update_product_stock;
	 DELIMITER $$
	 CREATE PROCEDURE update_product_stock(
		 productID INT,
		 quantity INT
	 )
	 BEGIN
			UPDATE product
			SET stock = stock + quantity
			WHERE product_id = productID;
	 END $$
	 DELIMITER ;


	/*
	 * get the driver ids who are exceeding total working hours
	 */

	DROP PROCEDURE IF EXISTS get_drivers_who_are_exceeding_total_hours;
	 DELIMITER $$
	 CREATE PROCEDURE get_drivers_who_are_exceeding_total_hours(
		 route_id INT,
		 create_date DATE
	 )
	 BEGIN
				SELECT driver_id FROM
				(SELECT driver_id,total_work_hours,(SUM(average_time)+(SELECT average_time FROM truck_route WHERE truck_route_id = route_id)) AS tot_avg_time
				FROM truck_schedule ts 
				JOIN truck_route tr USING(truck_route_id)
				JOIN driver d USING(driver_id)
				WHERE MONTH(create_date) = MONTH(ts.date_time)
				GROUP BY driver_id,total_work_hours
				HAVING tot_avg_time > total_work_hours) AS new_table;
	 END $$
	 DELIMITER ;



DROP PROCEDURE IF EXISTS insert_new_order;
	 DELIMITER $$
	 CREATE PROCEDURE insert_new_order(
		 order_data JSON
	 )
	 BEGIN
		 DECLARE count INT;
	     DECLARE EXIT HANDLER FOR SQLEXCEPTION
	     BEGIN
	         ROLLBACK;
	         RESIGNAL;
	     END;
         SET count = 0;
	 	START TRANSACTION;
	 		INSERT INTO order_table(customer_id,order_date,delivery_date,route_id,meet_position) 
            VALUES (order_data->"$.customerId",order_data->"$.orderDate",order_data->"$.deliveryDate",order_data->"$.routeId",order_data->"$.meetPosition");
            
            UPDATE cart 
			SET is_delete = 1 
			WHERE customer_id = order_data->"$.customerId"  AND is_delete = 0;
				
            WHILE count < order_data->"$.numOfProducts" DO
				
                INSERT INTO ordered_product(order_id,product_id,quantity,item_price) 
                VALUES (LAST_INSERT_ID(),JSON_EXTRACT(order_data,CONCAT("$.product[",count,"].productId")),JSON_EXTRACT(order_data,CONCAT("$.product[",count,"].quantity")),JSON_EXTRACT(order_data,CONCAT("$.product[",count,"].itemPrice")));
				SET count = count + 1;
            END WHILE;
            
			INSERT INTO payment(order_id,amount,payment_method,payment_date) VALUES (LAST_INSERT_ID(),order_data->"$.cost",order_data->>"$.paymentMethod",order_data->"$.orderDate");
	     COMMIT;
	 END $$
	 DELIMITER ;

	/*
	 * get the driver assistant ids who are exceeding total working hours
	 */

	DROP PROCEDURE IF EXISTS get_driver_assistants_who_are_exceeding_total_hours;
	 DELIMITER $$
	 CREATE PROCEDURE get_driver_assistants_who_are_exceeding_total_hours(
		 route_id INT,
		 create_date DATE
	 )
	 BEGIN
				SELECT driver_assistant_id FROM
				(SELECT driver_assistant_id,total_work_hours,(SUM(average_time)+(SELECT average_time FROM truck_route WHERE truck_route_id = route_id)) AS tot_avg_time
				FROM truck_schedule ts 
				JOIN truck_route tr USING(truck_route_id)
				JOIN driver_assistant d USING(driver_assistant_id)
				WHERE MONTH(create_date) = MONTH(ts.date_time)
				GROUP BY driver_assistant_id,total_work_hours
				HAVING tot_avg_time > total_work_hours) AS new_table1;
	 END $$
	 DELIMITER ;

	/*
	 * add truck shedule 
	 */

	DROP PROCEDURE IF EXISTS insert_truck_trip;
DELIMITER $$
CREATE PROCEDURE insert_truck_trip(
	truckScheduleId int(11),
    truckId int(11)
    dateTime Date,
    storeManagerId int(11),
    driverId int(11),
    driverAssistantId int(11),
	orderIds int(11)
    
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
	START TRANSACTION;
		INSERT INTO truck_schedule(truck_route_id,truck_id,date_time,store_manager_id,driver_id,driver_assistant_id) VALUES (truckScheduleId,truckId,dateTime,storeManagerId,driverId,driverAssistantId);
		INSERT INTO user_account(truck_schedule_id,order_id) VALUES (LAST_INSERT_ID(),orderIds);
    COMMIT;
END $$
DELIMITER ;

