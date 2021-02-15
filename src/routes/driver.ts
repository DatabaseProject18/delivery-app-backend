import express from "express";
import handleRequest from "../utils/req/requestHandler";
const router = express.Router();

router.get('/driverDetails', handleRequest("driver","driverDetails"));
router.get('/driverDriver/:driver_id', handleRequest("driver","driverFullDetails"));

export default router;