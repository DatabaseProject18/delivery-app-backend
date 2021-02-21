DROP VIEW IF EXISTS truck_schedule_details;
CREATE VIEW  truck_schedule_details AS
SELECT 
	truck_schedule_id,
	s.user_id  driver_user_id,
    ss.user_id driver_assistant_user_id,
    driver_id,
    driver_assistant_id,
    date_time,
    concat(u_dr.first_name, ' ', u_dr.last_name) drver_name,
    concat(u_ds.first_name, ' ' , u_ds.last_name)drver_assistant_name,
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
WHERE ot.route_id = tr.truck_route_id AND
tr.train_route_id = tar.train_route_id AND
tar.store_id = s.store_id AND
ot.order_id = op.order_id AND
op.product_id = p.product_id;
