import express from "express";
import handleRequest from "../utils/req/requestHandler";
const router = express.Router();

router.get('/NewOrders', handleRequest("deliveryManager","getNewOrders"));
router.get('/NewOrder/:order_id', handleRequest("deliveryManager","getNewOrder"));
router.delete('/RejectOrder/:order_id', handleRequest("deliveryManager","rejectOrder"));
router.patch('/ShipOrder/:order_id', handleRequest("deliveryManager","shipOrder"));
router.get('/TotalVolume/:order_id', handleRequest("deliveryManager","getTotalVolume"));


export default router;
