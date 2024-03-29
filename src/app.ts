const express = require("express");
const app = express();
import cors from "cors";
import authRouter from "./routes/auth";
import CustomerRouter from "./routes/customer";
import deliveryManagerRouter from "./routes/deliveryManager";
import driverAssistantRouter from "./routes/driverAssistant";
import orderRouter from "./routes/order";
import productRouter from "./routes/product";
import truckRouteRouter from './routes/truckRoute';
import driverRouter from './routes/driver';
import userRouter from './routes/user';
import cartRouter from './routes/cart';
import truckTripRouter from './routes/truckTrip';
import reportRouter from './routes/report';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );
  res.header("Access-Control-Allow-Headers", "content-type");
  next();
});

app.use("/api", authRouter);
app.use("/api/order", orderRouter);
app.use("/api/truck", truckRouteRouter);
app.use("/api/driver", driverRouter);
app.use("/api/driverAssistant", driverAssistantRouter);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/deliveryManager", deliveryManagerRouter);
app.use("/api/customer", CustomerRouter);
app.use("/api/cart", cartRouter);
app.use("/api/truckTrip",truckTripRouter);
app.use("/api/report",reportRouter);

const port = process.env.PORT || 3005;

app.listen(port, () => {
  console.log(`Server is listening in ${port}`);
});
