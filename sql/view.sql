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
    t.store_id,
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
JOIN user_data u_dr
	ON u_dr.user_id = dr.user_id
JOIN user_data u_ds
	ON u_ds.user_id = ds.user_id
JOIN truck t
	USING(truck_id)
JOIN truck_route tr
	USING(truck_route_id);


DROP VIEW IF EXISTS new_order_details;
CREATE VIEW  new_order_details AS
SELECT
        ot.order_id,
        ot.order_date,
        ot.delivery_date,
        p.product_name,
        p.product_volume,
        s.destination,
        t.train_name
FROM order_table ot,
train t,
store s,
truck_route tr,
train_route tar,
ordered_product op,
product p
WHERE ot.order_status = 'cart' AND
ot.route_id = tr.truck_route_id AND
tr.train_route_id = tar.train_route_id AND
tar.store_id = s.store_id AND
ot.order_id = op.order_id AND
op.product_id = p.product_id;

-- order_delivery_details

DROP VIEW IF EXISTS order_delivery_details;
CREATE VIEW order_delivery_details AS
SELECT 
	truck_schedule_id,
	o.order_id,
    CONCAT(first_name , " " , last_name) AS customer_name,
    address,
    (SELECT GROUP_CONCAT(contact_no SEPARATOR ', ') FROM user_contact_number ucn WHERE ucn.user_id = u.user_id) AS contact_no,
    ca.town,
	ca.meet_position,
    order_status
FROM order_table o
JOIN scheduled_order 
	USING(order_id)
JOIN customer
	USING(customer_id)
JOIN user_data u
	USING(user_id)
JOIN covered_area ca
	ON ca.truck_route_id = o.route_id AND ca.meet_position = o.meet_position
WHERE order_status NOT IN ('Preparing', 'Canceled');

