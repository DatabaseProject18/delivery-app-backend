const express = require("express");
const app = express();
import homeRouter from "./routes/home";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", homeRouter);

const port = process.env.PORT || 3005;

app.listen(port, () => {
  console.log(`Server is listening in ${port}`);
});
