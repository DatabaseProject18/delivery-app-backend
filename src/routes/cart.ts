import express from "express";
import handleRequest from "../utils/req/requestHandler";
const router = express.Router();

router.get('/', handleRequest("cart", "getCart"));
router.patch('/cartQuantity/:product_id', handleRequest("cart", "setCartQuntity"));
router.patch('/orderDeleteFromCart/:order_id', handleRequest("cart", "orderDeleteFromCart"));

export default router;
