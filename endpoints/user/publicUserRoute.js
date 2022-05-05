var express = require("express");
const User = require("./UserModel");
var router = express.Router();

var userService = require("./UserService");


router.get("/", function (req, res, next) {
  console.log("Bin in users route");
  userService.getUsers(function (err, result) {
    console.log("Result: " + result);
    if (result) {
      res.json(result);
    } else {
      res.json({"Error": "Es gab probleme"});
    }
  });
});

router.get("/:userID", function (req, res, next) {
  console.log("Bin in GET admin");
  console.log("DAS IST DIE ID: " + req.params.userID);
  userService.getOneUser(req.params.userID, function (err, result){
    console.log("Result: " + result);
    if (result) {
      res.json(result);
    } else {
      res.json({"Error": "Couldn't find user!"});
    }
  });
});

router.post("/", function (req, res, next) {
  console.log("bin in POST");
  userService.createUser(req.body, function (err, result) {
    if (result) {
      console.log(result);
      res.status(201).json(result);
    } else {
      res.status(400).json({"Error": "Konnte den User nicht anlegen"});
    }
  });
});

router.put("/:userID", function (request, response, next) {
  console.log("bin in PUT");
  userService.updateUser(request, function (err, result) {
    if (result) {
      response.json(result);
    } else {
      response.json({"Error":"Es gab Probleme"});
    }
  });
});

router.delete("/:userID", function (req, res, next) {
  console.log("bin in DELETE");
  userService.deleteUser(req, function (err, result) {
    if (result) {
      res.json(result);
    } else {
      res.json({"Error":"Es gab Probleme"});
    }
  })
})
module.exports = router;
