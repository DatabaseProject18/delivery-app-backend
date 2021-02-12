const express = require("express");
const app = express();

import authRouter from "./routes/auth";
import orderRouter from "./routes/order";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRouter);
app.use("/api/order", orderRouter);

const port = process.env.PORT || 3005;

app.listen(port, () => {
  console.log(`Server is listening in ${port}`);
});
