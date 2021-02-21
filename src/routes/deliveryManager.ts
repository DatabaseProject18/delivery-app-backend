import express from "express";
import handleRequest from "../utils/req/requestHandler";
const router = express.Router();

router.get('/NewOrders', handleRequest("deliveryManager","getNewOrders"));
router.get('/NewOrders/:order_id', handleRequest("deliveryManager","getNewOrder"));
router.delete('/RejectOrder/:order_id', handleRequest("deliveryManager","rejectOrder"));
router.patch('/ShipOrder/:order_id', handleRequest("deliveryManager","shipOrder"));

export default router;
