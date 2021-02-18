import express from "express";
import handleRequest from "../utils/req/requestHandler";
const router = express.Router();

router.get("/types", handleRequest("customer", "getCustomerTypes"));

export default router;
