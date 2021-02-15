import express from "express";
import handleRequest from "../utils/req/requestHandler";
const router = express.Router();

router.patch('/NewOrders', handleRequest("deliveryManager","getNewOrders"));
router.patch('/NewOrders/:order_id', handleRequest("deliveryManager","getNewOrder"));
router.patch('/RejectOrder/:order_id', handleRequest("deliveryManager","rejectOrder"));
router.patch('/ShipOrder/:order_id', handleRequest("deliveryManager","shipOrder"));

export default router;