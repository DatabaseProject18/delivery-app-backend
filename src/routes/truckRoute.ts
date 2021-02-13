import express from "express";
import handleRequest from "../utils/req/requestHandler";
const router = express.Router();

router.get('/truckRoutes',handleRequest("truckRoute","truckRoutes"));
router.get('/scheduledOrders', handleRequest("order","ordersByTown"));
router.get('/', handleRequest('truckRoute','truckId'));
router.get('/driver/:truck_id', handleRequest('driver','driverName'));
router.get('/driverAssistant/:truck_id', handleRequest('driverAssistant','driverAssistantName'));
router.post('/newTruckTrip', handleRequest("truckRoute","truckTrip"));

export default router;