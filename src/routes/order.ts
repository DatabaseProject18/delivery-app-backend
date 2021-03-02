import express from "express";
import handleRequest from "../utils/req/requestHandler";
const router = express.Router();

router.get('/PastOrders', handleRequest("order", "getPastOrders"));
router.get('/PastOrders/:order_id', handleRequest("order", "getPastOrder"));


router.patch('/CancelOrder', handleRequest("order", "cancelOrder"));
router.patch('/ConfirmOrder/:order_id', handleRequest("order", "confirmOrder"));
router.get('/OrderStatus/:order_id', handleRequest("order", "getOrderStatus"));
router.get('/OrdersByRoutId', handleRequest("order", "ordersByRouteId"));
router.get('/CreateOrder', handleRequest("order", "createOrder"));
router.get("/order-count-by-status", handleRequest("order", "orderCountByStatus"))

export default router;
