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

module.exports = router;
