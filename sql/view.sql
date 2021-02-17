DROP VIEW IF EXISTS truck_schedule_details;
CREATE VIEW  truck_schedule_details AS
SELECT 
	truck_schedule_id,
    driver_id,
    driver_assistant_id,
    date_time,
    concat(u_dr.first_name, ' ', u_dr.last_name) driver_name,
    concat(u_ds.first_name, ' ' , u_ds.last_name) driver_assistant_name,
    registration_no truck_number,
    distance,
    average_time,
    truck_route_id,
    (SELECT town 
		FROM covered_area ca
        WHERE tr.truck_route_id = ca.truck_route_id 
			AND ca.meet_position = 
				(SELECT COUNT(*) 
                FROM covered_area caa 
                WHERE ca.truck_route_id = caa.truck_route_id)) destination
FROM truck_schedule
JOIN driver dr
	USING(driver_id)
JOIN driver_assistant ds
	USING(driver_assistant_id)
JOIN staff s
	ON dr.staff_id = s.staff_id
JOIN staff ss
	ON ds.staff_id = ss.staff_id
JOIN user_data u_dr
	ON u_dr.user_id = s.user_id
JOIN user_data u_ds
	ON u_ds.user_id = ss.user_id
JOIN truck
	USING(truck_id)
JOIN truck_route tr
	USING(truck_route_id);


-- order_delivery_details

DROP VIEW IF EXISTS order_delivery_details;
CREATE VIEW order_delivery_details AS
SELECT 
	truck_schedule_id,
	o.order_id,
    CONCAT(first_name , " " , last_name) AS customer_name,
    address,
    (SELECT GROUP_CONCAT(contact_no SEPARATOR ', ') FROM user_contact_number ucn WHERE ucn.user_id = u.user_id) AS contact_no,
    meet_position,
    order_status
FROM order_table o
JOIN scheduled_order
	USING(order_id)
JOIN customer
	USING(customer_id)
JOIN user_data u
	USING(user_id)
WHERE order_status NOT IN ('Preparing', 'Canceled');