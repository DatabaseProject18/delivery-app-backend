/*
* Get the route first meet town name by route id
*/
DROP FUNCTION IF EXISTS get_first_meet_town_of_route;
DELIMITER $$
CREATE FUNCTION get_first_meet_town_of_route(
  route_id INT
)
RETURNS VARCHAR(100)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE first_meet VARCHAR(100);

    SELECT town INTO first_meet
    FROM covered_area
    WHERE truck_route_id = route_id
    ORDER BY meet_position ASC LIMIT 1;

    RETURN first_meet;
END $$
DELIMITER ;

/*
* Get the route last meet town name by route id
*/
DROP FUNCTION IF EXISTS get_last_meet_town_of_route;
DELIMITER $$
CREATE FUNCTION get_last_meet_town_of_route(
  route_id INT
)
RETURNS VARCHAR(100)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE last_meet VARCHAR(100);

    SELECT town INTO last_meet
    FROM covered_area
    WHERE truck_route_id = route_id
    ORDER BY meet_position DESC LIMIT 1;

    RETURN last_meet;
END $$
DELIMITER ;
