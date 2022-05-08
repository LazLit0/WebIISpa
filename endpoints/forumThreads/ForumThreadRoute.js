var express = require("express");
var router = express.Router();
var authenticationService = require("../../authentication/AuthenticationService")
var threadService = require("./ForumThreadsService");

router.get("/", function (req, res, next) {
    console.log("Bin in users route");
    threadService.getForumThreads(function (err, result) {
      console.log("Result: " + result);
      if (result) {
        return res.json(result);
      } else {
        res.json({ "Error": "Es gab probleme: " + err});
      }
    });
  });

  router.get("/:forumThreadID", function (req, res, next) {
      console.log("Das ist die ID: " + req.params.forumThreadID);
    threadService.getOneForumThread(req.params.forumThreadID, function (err, result) {
      console.log("Result: " + result);
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ "Error": "Es gab Probleme " + err });
      }
    });
  });

  router.put("/:forumThreadID", authenticationService.isAuthenticated, authenticationService.isAdmin, function (req, res, next) {
    threadService.updateThread(req.params.forumThreadID, req.body, function (err, result) {
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
    threadService.createUser(req.body, function (err, result) {
      if (result) {
        console.log(result);
        res.status(201).json(result);
      } else {
        res.status(400).json({ "Error": "Konnte den User nicht anlegen: " + err });
      }
    });
  });

  router.delete("/:forumThreadID", authenticationService.isAuthenticated, authenticationService.isAdmin, function (req, res, next) {
    console.log("bin in DELETE");
    threadService.deleteThread(req, function (err, result) {
      if (result) {
        res.status(201).json(result);
      } else {
        res.status(400).json({ "Error": "Es gab Probleme: " + err });
      }
    })
  })

  module.exports = router;