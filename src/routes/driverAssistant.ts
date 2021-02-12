import express from "express";
import handleRequest from "../utils/req/requestHandler";
const router = express.Router();

router.get('/driverAssistant', handleRequest("driverAssistant","driverAssistantDetails"));
router.get('/driverAssistant/:driver_assistant_id', handleRequest("driverAssistant","driverAssistantFullDetails"));

export default router;