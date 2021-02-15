const express = require("express");
const app = express();
//import homeRouter from "./routes/home";
import orderRouter from "./routes/order";
import truckRouteRouter from './routes/truckRoute';
import driverRouter from './routes/driver';
import driverAssistantRouter from './routes/driverAssistant';
import userRouter from './routes/user';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//app.use("/", homeRouter);

app.use("/api/order", orderRouter);
app.use("/api/truck", truckRouteRouter);
app.use("/api/driver",driverRouter);
app.use("/api/driverAssistant",driverAssistantRouter);
app.use("/api/user",userRouter);

const port = process.env.PORT || 3005;

app.listen(port, () => {
  console.log(`Server is listening in ${port}`);
});
