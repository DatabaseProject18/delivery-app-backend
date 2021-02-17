import express from "express";
import handleRequest from "../utils/req/requestHandler";
const router = express.Router();

router.get('/my', handleRequest("truckTrip", "getSheduledTruckTrips"));
router.get('/truckTripDetails/:truckTrip_id', handleRequest("truckTrip", "getTruckTripDetails"));

export default router;