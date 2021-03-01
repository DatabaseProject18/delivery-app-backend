/*
 *Update stock of product after inserting to the ordered_product table
 */
 DELIMITER $$
 CREATE TRIGGER ordered_product_after_insert_quantity
 	AFTER INSERT ON ordered_product
 	FOR EACH ROW
 BEGIN
 	UPDATE product
 	SET stock = stock - NEW.quantity
 	WHERE product_id = NEW.product_id;
 END $$
 DELIMITER ;

 /*
  *Update cost of the order after inserting to the ordered_product table
  */
  DELIMITER $$
  CREATE TRIGGER ordered_product_after_insert_cost
  	AFTER INSERT ON ordered_product
  	FOR EACH ROW
  BEGIN
  	UPDATE order_table
  	SET cost = cost + (NEW.quantity*NEW.item_price)
  	WHERE order_id = NEW.order_id;
  END $$
  DELIMITER ;
