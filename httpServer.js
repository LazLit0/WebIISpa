const express = require("express");
const bodyParser = require("body-parser");
const database = require("./database/db");
const testRoutes = require("./endpoints/test/TestRoutes");
const userRoutes = require("./endpoints/user/UserRoute");
const publicUsers = require("./endpoints/user/publicUserRoute");
const userService = require("./endpoints/user/UserService");
const authenticationRoutes = require("./authentication/AuthenticationRoute");
const threadRoutes = require("./endpoints/forumThreads/ForumThreadRoute")
const app = express();
app.use(bodyParser.json());

// Adding the Routes

app.use("/", testRoutes);
app.use("/users", userRoutes);
app.use("/publicUsers", publicUsers);
app.use("/authenticate", authenticationRoutes);
app.use("/forumThreads", threadRoutes);

database.initDB(function (err, db) {
  console.log(database);
  if (db) {
    console.log("Anbindung von Datenbank erfolgreich");
    userService.findUserBy("admin", function(){});
  } else {
    console.log("Anbindung von Datenbank gescheitert");
  }
});
const port = 8080;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
