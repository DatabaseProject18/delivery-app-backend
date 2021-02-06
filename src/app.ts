const express = require("express");
const app = express();
import mysql, { Connection } from "mysql";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var con: Connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "7019$DIL$c@t",
  database: "university",
});

// con.connect(function (err) {
//   console.log("Connection Error--", err);
// });

// console.log(con.query("SELECT * FROM student"));

con.connect(function (err) {
  if (err) console.log(err);
  con.query("SELECT * FROM student", function (err, result, fields) {
    if (err) console.log(err);
    console.log(result);
  });
});

app.get("/", function name(req, res) {
  res.status(200).send("Hello World!");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is listening in ${port}`);
});
