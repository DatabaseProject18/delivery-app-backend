const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function name(req, res) {
  res.status(200).send("Hello world!");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is listening in ${port}`);
});
