// alles rein was mit http zu tun hat und den request und response objekten zu tun hat
var express = require("express");
var router = express.Router();

var userService = require("./UserService");

router.get("/", function (req, res, next) {
  console.log("Bin in users route");
  userService.getUsers(function (err, result) {
    console.log("Result: " + result);
    if (result) {
      res.send(Object.values(result));
    } else {
      res.send("Es gab probleme");
    }
  });
});

router.post("/", function (request, response, next) {
  console.log("bin in POST");
  userService.createUser(request, function (err, result) {
    if (result) {
      response.send(result);
    } else {
      response.send("Es gab Probleme");
    }
  });
});
module.exports = router;
