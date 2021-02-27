import express from "express";
import handleRequest from "../utils/req/requestHandler";
const router = express.Router();

//get only the income of each year
router.get("/years-income", handleRequest("report", "yearsIncome"));

//get quarterly income of a particular year
router.get(
  "/year-quarterly-income",
  handleRequest("report", "quarterlyIncome")
);

//get basic order details of a given quarter in a given year
router.get(
  "/year-quarter-orders-basic",
  handleRequest("report", "basicOrderDetailsOfQuarter")
);

//get most ordred items by yearly or all
router.get(
  "/product-ordered-count",
  handleRequest("report", "orderCountOfProduct")
);

//get income according to the cities
router.get("/city-route-income", handleRequest("report", "cityRouteIncome"));

//get working hours of drivers
router.get("/working-hours/drivers", handleRequest("report", "driverWorkingHours"));

//get working hours of driver assistants
router.get("/working-hours/driver-assistants", handleRequest("report", "driverAssistantWorkingHours"));

//get used hours of trucks
router.get("/used-hours/trucks", handleRequest("report", "truckUsedHours"));

//get number of orders per each customer
router.get("/customer-order", handleRequest("report", "customerOrder"));

//get basic order details of a customer
router.get("/customer-order-basic-details", handleRequest("report", "customerBasicOrderDetails"));

export default router;
