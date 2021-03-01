import express from "express";
import handleRequest from "../utils/req/requestHandler";
const router = express.Router();

router.get('/', handleRequest("cart", "getCart"));
router.patch('/cartQuantity', handleRequest("cart", "setCartQuntity"));
router.patch('/productDeleteFromCart', handleRequest("cart", "productDeleteFromCart"));
router.post('/new-product', handleRequest("cart", "newProduct"));

export default router;
