import express from "express";
import handleRequest from "../utils/req/requestHandler";
const router = express.Router();

router.get('/PastOrders', handleRequest("order", "getPastOrders"));

export default router;
