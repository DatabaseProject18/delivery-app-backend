import express from "express";
import handleRequest from "../utils/req/requestHandler";
const router = express.Router();

router.get('/NewOrders', handleRequest("deliveryManager","getNewOrders"));
router.get('/NewOrder/:order_id', handleRequest("deliveryManager","getNewOrder"));
router.delete('/RejectOrder/:order_id', handleRequest("deliveryManager","rejectOrder"));
router.patch('/ShipOrder/:order_id', handleRequest("deliveryManager","shipOrder"));
router.get('/TotalVolume/:order_id', handleRequest("deliveryManager","getTotalVolume"));
router.get('/TrainsForTrip/:order_id', handleRequest("deliveryManager","getAllTrainsForOrder"));
router.get('/TrainTimeSlots/:train_id', handleRequest("deliveryManager","getTrainTimeTableForTrainId"));
router.post('/scheduleTrain/:order_id/:train_time_table_id/:delivery_manager_id', handleRequest("deliveryManager","scheduleTrainTrip"));

export default router;
