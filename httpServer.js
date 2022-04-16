const express = require("express");
const bodyParser = require("body-parser");
const database = require("./database/db");
const testRoutes = require("./endpoints/test/TestRoutes");
const userRoutes = require("./endpoints/user/UserRoute");
const authenticationRoutes = require("./authentication/AuthenticationRoute");
const app = express();
app.use(bodyParser.json());

// Adding the Routes

app.use("/", testRoutes);
app.use("/user", userRoutes);
app.use("/authenticate", authenticationRoutes);

database.initDB(function (err, db) {
  console.log(database);
  if (db) {
    console.log("Anbindung von Datenbank erfolgreich");
  } else {
    console.log("Anbindung von Datenbank gescheitert");
  }
});
const port = 4040;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
