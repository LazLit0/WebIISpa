var express = require("express");
const User = require("./UserModel");
var router = express.Router();

var userService = require("./UserService");


router.get("/", function (req, res, next) {
  console.log("Bin in users route");
  userService.findUserBy("admin", function(err) {
    if(err){
      res.status(400).json({error: err});
      return;
    }
  });
  userService.getUsers(function (err, result) {
    console.log("Result: " + result);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(400).json({"Error": "Es gab probleme"});
    }
  });
});

router.get("/:userID", function (req, res, next) {
  console.log("Bin in GET admin");
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

router.put("/:userID", function (req, response, next) {
  console.log("bin in PUT");
  userService.updateUser(req.params.userID, req.body, function (err, result) {
    if (result) {
      response.json(result);
    } else {
      response.json({"Error":"Es gab Probleme"});
    }
  });
});

router.delete("/:userID", function (req, res, next) {
  console.log("bin in DELETE");
  userService.deleteUser(req.params.userID, function (err, result) {
    if (result) {
      res.json(result);
    } else {
      res.json({"Error":"Es gab Probleme"});
    }
  })
})
module.exports = router;
