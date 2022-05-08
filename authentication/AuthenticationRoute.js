var express = require("express");
var router = express.Router();
var authenticationService = require("../authentication/AuthenticationService");

//vorher header base64 auslesen und dann pw und userID übergeben
router.get("/", function (req, res, next) {
  console.log(" Das ist der base64 encoded" + req.headers.authorization.split(' ')[1]);
  const credentials = Buffer.from(req.headers.authorization.split(" ")[1], 'base64').toString('ascii');
  console.log("Das ist der bse64 string, der übergeben wird: " + req.headers.authorization.split(" ")[1]);
  console.log("Das sind die credentials: " + credentials);
  console.log("Das ist der username: " + credentials.split(':')[0]);
  console.log("Das ist der PW: " + credentials.split(':')[1]);
  authenticationService.createSessionToken(
    credentials.split(':')[0], credentials.split(':')[1],
    function (err, token, user) {
      if (token) {
        res.header("Authorization", "Bearer " + token);

        if (user) {
          const { id, userID, userName, ...partialObject } = user;
          const subset = { id, userID, userName };
          console.log(JSON.stringify(subset));
          res.json(subset);
        } else {
          res.json({"Error":"User is null, even though a token has been created. Error: " + err});
          res.json({ "Message": "Could create token" });
        }
      } else {
        console.log("Token has not been created, Error: " + err);
        res.status(400).json({ "Error": "Could not create token" });
      }
    }
  );
});

module.exports = router;
