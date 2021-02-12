const express = require("express");
const app = express();
import homeRouter from "./routes/home";
import orderRouter from "./routes/order";
import productRouter from "./routes/product";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", homeRouter);

app.use("/api/order", orderRouter);

app.use("/api/product", productRouter);

const port = process.env.PORT || 3005;

app.listen(port, () => {
  console.log(`Server is listening in ${port}`);
});
