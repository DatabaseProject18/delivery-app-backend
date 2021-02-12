import express from "express";
import handleRequest from "../utils/req/requestHandler";
const router = express.Router();

router.get('/driver', handleRequest("driver","driverDetails"));
router.get('/driver/:driver_id', handleRequest("driver","driverFullDetails"));

export default router;