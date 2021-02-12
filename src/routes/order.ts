import express from "express";
import handleRequest from "../utils/req/requestHandler";
const router = express.Router();

router.get('/PastOrders', handleRequest("order", "getPastOrders"));
router.get('/PastOrders/:order_id', handleRequest("order", "getPastOrder"));
router.patch('/OrderDeleteFromCart/:order_id', handleRequest("order", "orderDeleteFromCart"));
router.patch('/CancelOrder/:order_id', handleRequest("order", "cancelOrder"));
router.get('/OrderStatus/:order_id', handleRequest("order", "getOrderStatus"));
router.get('/OrdersByTown', handleRequest("order", "ordersByTown"));
router.get('/CreateOrder', handleRequest("order", "createOrder"));

export default router;
