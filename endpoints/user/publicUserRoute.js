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

router.get("/admin", function (req, res, next) {
  console.log("Bin in GET admin");
  userService.getUsers(function (err, result){
    console.log("Result: " + result);
    if (result) {
      res.send(Object.values(result));
    } else {
      res.send("Es gab Probleme");
    }
  });
});

router.post("/", function (request, response, next) {
  console.log("bin in POST");
  userService.createUser(request, function (err, result) {
    if (result) {
      console.log(result);
      response.status(201).json(result);
    } else {
      response.status(400).json({"Error": "Konnte den User nicht anlegen"});
    }
  });
});

router.put("/:userID", function (request, response, next) {
  console.log("bin in PUT");
  userService.updateUser(request, function (err, result) {
    if (result) {
      response.send(result);
    } else {
      response.send("Es gab Probleme");
    }
  });
});

router.delete("/:userID", function (req, res, next) {
  console.log("bin in DELETE");
  userService.deleteUser(req, function (err, result) {
    if (result) {
      res.send(result);
    } else {
      res.send("Es gab Probleme");
    }
  })
})
module.exports = router;
