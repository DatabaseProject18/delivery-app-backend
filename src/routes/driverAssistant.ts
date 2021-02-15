import express from "express";
import handleRequest from "../utils/req/requestHandler";
const router = express.Router();

router.get('/driverAssistantDetails', handleRequest("driverAssistant","driverAssistantDetails"));
router.get('/driverAssistantDetails/:driver_assistant_id', handleRequest("driverAssistant","driverAssistantFullDetails"));

export default router;