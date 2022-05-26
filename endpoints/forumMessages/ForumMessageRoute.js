var express = require("express");
var router = express.Router();
var authenticationService = require("../../authentication/AuthenticationService")
var forumMessageService = require("./ForumMessageService");

router.get("/", function (req, res, next) {
    console.log("Bin in Forum-Thread-Message Route");
    var bool = req.query.forumThreadID;
    console.log("WERT VON REQ>QUERY:   " + bool);
    if (req.query.forumThreadID != undefined) {
        console.log("GIBT EINE QUERy");
        forumMessageService.getForumThreadMessages(req.query.forumThreadID, function (err, result) {
            if (result) {
                return res.status(200).json(result);
            } else {
                return res.status(404).json({ error: "Es gab Probleme: " + err })
            }
        })
    } else {
        forumMessageService.getForumMessages(function (err, result) {
            console.log("Result: " + result);
            if (result) {
                return res.status(200).json(result);
            } else {
                return res.status(400).json({ "Error": "Es gab probleme: " + err });
            }
        });
    }
});
  
  router.get("/:_id", function (req, res, next) {
      console.log("Das ist die ID: " + req.params._id);
    forumMessageService.getOneForumMessage(req.params._id, function (err, result) {
      console.log("Result: " + result);
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ "Error": "Es gab Probleme " + err });
      }
    });
  });


  router.put("/:_id", authenticationService.isAuthenticated, authenticationService.checkExpirationDate, authenticationService.isAdmin, function (req, res, next) {
    forumMessageService.updateForumMessage(req.params._id, req.body, function (err, result) {
      console.log("Result: " + result);
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(400).json({ "Error": "Es gab Probleme: " + err});
      }
    });
  });

  router.post("/",authenticationService.isAuthenticated, authenticationService.checkExpirationDate, function (req, res, next) {
    if (!req.headers.authorization) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
      return res.status(401).json({ message: 'Missing Authorization Header' });
    }
    console.log("bin in POST");
    const credentials = JSON.parse(Buffer.from(req.token.split(".")[1], 'base64').toString('ascii'));
    forumMessageService.createForumMessage(credentials.user, req.body, function (err, result) {
      if (result) {
        console.log(result);
        res.status(201).json(result);
      } else {
        res.status(400).json({ error: "Konnte die Message nicht anlegen: " + err });
      }
    });
  });

  router.delete("/:_id", authenticationService.isAuthenticated, authenticationService.checkExpirationDate, authenticationService.isAdmin, function (req, res, next) {
    console.log("bin in DELETE");
    forumMessageService.deleteForumMessage(req.params._id, function (err, result) {
      if (result) {
        res.status(201).json(result);
      } else {
        res.status(400).json({ "Error": "Es gab Probleme: " + err });
      }
    })
  })

  module.exports = router;