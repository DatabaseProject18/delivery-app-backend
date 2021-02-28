import express from "express";
import handleRequest from "../utils/req/requestHandler";
const router = express.Router();

router.get('/truckRoutes',handleRequest("truckRoute","truckRoutes"));
router.get('/scheduledOrders', handleRequest("order","ordersByRouteId"));
router.get('/', handleRequest('truckRoute','truckId'));
router.get('/freeDrivers', handleRequest('driver','driverName'));
router.get('/freeDriverAssistants', handleRequest('driverAssistant','driverAssistantName'));
router.post('/newTruckTrip', handleRequest("truckRoute", "truckTrip"));
router.post('/newScheduledOrder', handleRequest("truckRoute","scheduledOrder"))
router.get('/truckRouteByID/:truck_route_id',handleRequest("truckRoute","getTruckRouteByID"));

export default router;