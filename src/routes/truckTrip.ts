import express from "express";
import handleRequest from "../utils/req/requestHandler";
const router = express.Router();

router.get('/myTrip', handleRequest("truckTrip", "getSheduledTruckTrips"));
router.get('/truckTripDetails/:truckTrip_id', handleRequest("truckTrip", "getTruckTripDetails"));
router.get('/truckTripOrderDetails/:truckTrip_id', handleRequest("truckTrip", "getTruckTripOrderDetails"));
router.get('/getSheduledTruckTrip', handleRequest("truckTrip", "getNewSheduledTruckTrips"));

export default router;