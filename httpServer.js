const express = require("express");
const bodyParser = require("body-parser");
const database = require("./database/db");
const testRoutes = require("./endpoints/test/TestRoutes");
const userRoutes = require("./endpoints/user/UserRoute");
const publicUsers = require("./endpoints/user/publicUserRoute");
const userService = require("./endpoints/user/UserService");
const authenticationRoutes = require("./authentication/AuthenticationRoute");
const threadRoutes = require("./endpoints/forumThreads/ForumThreadRoute")
const forumMessages = require("./endpoints/forumMessages/forumMessageRoute")
const https = require('https');
const fs = require('fs');
const key = fs.readFileSync('./key.pem');
const cert = fs.readFileSync('./cert.pem');
const app = express();
const server = https.createServer({key: key, cert: cert }, app);
app.use(bodyParser.json());

// Adding the Routes

app.use("/", testRoutes);
app.use("/users", userRoutes);
app.use("/publicUsers", publicUsers);
app.use("/authenticate", authenticationRoutes);
app.use("/forumThreads", threadRoutes);
app.use("/forumMessages", forumMessages)

database.initDB(function (err, db) {
  console.log(database);
  if (db) {
    console.log("Anbindung von Datenbank erfolgreich");
    userService.findUserBy("admin", function(){});
  } else {
    console.log("Anbindung von Datenbank gescheitert");
  }
});
const port = 443;
server.listen(port, () => {
  console.log(`Example server listening on port ${port}`);
});
