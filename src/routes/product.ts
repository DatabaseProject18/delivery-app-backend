import express from "express";
import handleRequest from "../utils/req/requestHandler";
const router = express.Router();

router.get('/SearchProducts', handleRequest("product", "searchProducts"));
router.get('/SearchProducts/:category_id', handleRequest("product", "searchFilterProduct"));

export default router;