import express from "express";
import handleRequest from "../utils/req/requestHandler";
const router = express.Router();

router.get('/SearchProducts', handleRequest("product", "searchProducts"));
router.get('/SearchProducts/:category_id', handleRequest("product", "searchFilterProducts"));
router.get('/search-by-product-name', handleRequest("product", "searchByProductName"));
router.get('/all-categories', handleRequest("product", "allCategories"));

export default router;
