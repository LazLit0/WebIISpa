var express = require("express");
var router = express.Router();
var authenticationService = require("../authentication/AuthenticationService");

//vorher header base64 auslesen und dann pw und userID übergeben
router.get("/", function (req, res, next) {
  console.log("Want to create token");
  console.log("das sind die req.headers: " + req.headers);
  authenticationService.createSessionToken(
    req.headers,
    function (err, token, user) {
      if (token) {
        res.header("Authorization", "Bearer");

        if (user) {
          const { id, userID, userName, ...partialObject } = user;
          const subset = { id, userID, userName };
          console.log(JSON.stringify(subset));
          res.send(subset);
        } else {
          console.log(
            "User is null, even though a token has been created. Error: " + err
          );
          res.send("Could create token");
        }
      } else {
        console.log("Token has not been created, Error: " + err);
        res.send("Could not create token");
      }
    }
  );
});

module.exports = router;
