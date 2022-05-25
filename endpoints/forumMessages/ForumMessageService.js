const req = require("../../node_modules/express/lib/request");
const ForumMessage = require("./ForumMessageModel");

// function getForumMessages(callback) {
//     ForumMessage.find(function (err, forumMessage) {
//       if (err) {
//         console.log("Fehler bei Suche: " + err);
//         return callback(err, null);
//       } else {
//         console.log("Alles super");
//         return callback(null, forumMessage);
//       }
//     });
//   }

  function getOneForumMessage(forumMessageID, callback){
    findForumMessageBy(forumMessageID, function(err, forumMessage) {
      if(err){
        console.log("Fehler bei Suche: " + err);
        return callback(err, null); 
      } else {
        console.log("Alles super");
        return callback(null, forumMessage);
      }
    })
  }

  function getForumThreadMessages(ownerID, callback){
    console.log("Get MY Forum Threads: !!");
    ForumMessage.find(function (err, myForumThreadMessages) {
      if(err) {
        console.log("Fehler bei Suche: " + err);
        return callback(err, null);
      } else {
        console.log("Alles super");
        return callback(null, myForumThreadMessages.filter(myForumThreadMessages => myForumThreadMessages.ownerID == ownerID));
      }
    })
  }

  function createForumMessage(userID, body, callback) {
    console.log("bin in CREATE THREAD");
   
      var thread = new ForumMessage({
        name: body.name,
        description: body.description,
        ownerID: userID
      });
  
      console.log("Das ist der thread: " + thread);
      thread.save(function (err) {
        if (err) {
          console.log("Fehler beim erstellen: " + err);
          return callback(err, null);
        } else {
          console.log("Top, alles super");
          return callback(null, thread);
        }
      });
  
  }

  function updateForumMessage(forumMessageID, body, callback){
    console.log(req.body);
    ForumMessage.updateOne({ forumMessageID: forumMessageID }, body, function (err, result){
      if(err){
        callback(err, null);
      } else {
        console.log(result);
        callback(null, result);
      }
    })
  }

  function deleteForumMessage(forumMessageID, callback) {
    console.log("###### Das ist forumMessageID: " + forumMessageID);
    var query = findForumMessageBy(forumMessageID, function(err, result) {
      if(err){
      console.log("Gab ein Fehler beim Suchen des Threads" + err);
      callback(err, null);
      } else {
        if(result){
          ForumMessage.deleteOne({ _id: forumMessageID }, function(err, result){
            if(err){
              callback(err, null);
            } else {
              if (result){
                console.log(`Thread mit forumMessageID: ${forumMessageID} deleted`);
                callback(null, result);
              }
            }
          })
        } else {
          callback(null, null);
        }
      }
    });
}

  function findForumMessageBy(forumMessageID, callback) {
    console.log("ForumThreadService: find THread by ID: " + forumMessageID);
  
    if (!forumMessageID) {
      callback("ThreadID is missing");
      return;
    } else {
      var query = ForumMessage.findOne({ _id: forumMessageID });
      query.exec(function (err, forumMessage) {
        if (err) {
          console.log("Did not find THreadID: " + forumMessage);
          return callback("Did not find forumThread for ThreadID: " + forumMessageID, null);
        } else {
          if (forumMessage) {
            console.log(`Found ThreadID: ${forumMessageID}`);
            callback(null, forumMessage);
          } else {
              console.log("Could not find forumThread for forumThread ID: " + forumMessageID);
              callback(null, forumMessage);

          }
        }
      });
    }
  }

  module.exports = {
    //   getForumMessages,
      getOneForumMessage,
      createForumMessage,
      updateForumMessage,
      deleteForumMessage,
      getForumThreadMessages
  }