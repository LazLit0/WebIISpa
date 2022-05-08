// alles rein was mit http zu tun hat und den request und response objekten zu tun hat
var express = require("express");
const { JsonWebTokenError } = require("../../node_modules/jsonwebtoken/index");
var router = express.Router();
var jwt = require("jsonwebtoken");
var config = require("config");
var authenticationService = require("../../authentication/AuthenticationService")

var userService = require("./UserService");

router.get("/", authenticationService.isAuthenticated, authenticationService.isAdmin, function (req, res, next) {
  console.log("Bin in users route");
  userService.getUsers(function (err, result) {
    console.log("Result: " + result);
    if (result) {
      return res.json(result);
    } else {
      res.json({ "Error": "Es gab probleme: " + err});
    }
  });
});

router.get("/:userID",authenticationService.isAuthenticated,authenticationService.isAdmin, function (req, res, next) {
  console.log("Bin in GET admin");
  userService.getOneUser(req.params.userID, function (err, result) {
    console.log("Result: " + result);
    if (result) {
      res.json(result);
    } else {
      res.json({ "Error": "Es gab Probleme" });
    }
  });
});

router.put("/:userID", authenticationService.isAuthenticated, authenticationService.isAdmin, function (req, res, next) {
  userService.updateUser(req.params.userID, req.body, function (err, result) {
    console.log("Result: " + result);
    if (result) {
      res.json(result);
    } else {
      res.json({ "Error": "Es gab Probleme: " + err});
    }
  });
});


router.post("/",authenticationService.isAuthenticated, authenticationService.isAdmin, function (req, res, next) {
  if (!req.headers.authorization) {
    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
    return res.json({ message: 'Missing Authorization Header' });
  }
  console.log("bin in POST");
  userService.createUser(req.body, function (err, result) {
    if (result) {
      console.log(result);
      res.status(201).json(result);
    } else {
      res.status(400).json({ "Error": "Konnte den User nicht anlegen: " + err });
    }
  });
});

router.delete("/:userID", authenticationService.isAuthenticated, authenticationService.isAdmin, function (req, res, next) {
  console.log("bin in DELETE");
  userService.deleteUser(req, function (err, result) {
    if (result) {
      res.status(201).json(result);
    } else {
      res.status(400).json({ "Error": "Es gab Probleme: " + err });
    }
  })
})

module.exports = router;
