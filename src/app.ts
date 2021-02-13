const express = require("express");
const app = express();


import authRouter from "./routes/auth";
import orderRouter from "./routes/order";
import productRouter from "./routes/product";
import truckRouteRouter from './routes/truckRoute';
import driverRouter from './routes/driver';
import driverAssistantRouter from './routes/driverAssistant';
import userRouter from './routes/user';
import deliveryManagerRouter from './routes/deliveryManager'

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRouter);
app.use("/api/order", orderRouter);
app.use("/api/truck", truckRouteRouter);
app.use("/api/",driverRouter);
app.use("/api/",driverAssistantRouter);
app.use("/api/",userRouter);
app.use("/api/product", productRouter);
app.use("/api/deliveryManager",deliveryManagerRouter);

const port = process.env.PORT || 3005;

app.listen(port, () => {
  console.log(`Server is listening in ${port}`);
});
