const express = require("express");
const app = express();


import authRouter from "./routes/auth";
import orderRouter from "./routes/order";
import productRouter from "./routes/product";
import truckRouteRouter from './routes/truckRoute';
import driverRouter from './routes/driver';
import driverAssistantRouter from './routes/driverAssistant';
import userRouter from './routes/user';
import deliveryManagerRouter from './routes/deliveryManager';
import cart from './routes/cart';
import truckTrip from './routes/truckTrip';

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" 
  );
  res.header("Access-Control-Allow-Headers", "content-type");
  next();
});

app.use("/api", authRouter);
app.use("/api/order", orderRouter);
app.use("/api/truck", truckRouteRouter);
app.use("/api/driver",driverRouter);
app.use("/api/driverAssistant",driverAssistantRouter);
app.use("/api/user",userRouter);
app.use("/api/product", productRouter);
app.use("/api/deliveryManager", deliveryManagerRouter);
app.use("/api/cart", cart);
app.use("/api/truckTrip",truckTrip);


const port = process.env.PORT || 3005;

app.listen(port, () => {
  console.log(`Server is listening in ${port}`);
});
