const req = require("../../node_modules/express/lib/request");
const ForumThread = require("./ForumThreadsModel");

function getForumThreads(callback) {
    ForumThread.find(function (err, forumThreads) {
      if (err) {
        console.log("Fehler bei Suche: " + err);
        return callback(err, null);
      } else {
        console.log("Alles super");
        return callback(null, forumThreads);
      }
    });
  }

  function getOneForumThread(forumThreadID, callback){
    findForumThreadBy(forumThreadID, function(err, forumThread) {
      if(err){
        console.log("Fehler bei Suche: " + err);
        return callback(err, null); 
      } else {
        console.log("Alles super");
        return callback(null, forumThread);
      }
    })
  }

  function createUser(body, callback) {
    console.log("bin in CREATE USER");
   
      var thread = new ForumThread({
        forumThreadID: body.forumThreadID,
        name: body.name,
        description: body.description
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

  function updateThread(forumThreadID, body, callback){
    console.log(req.body);
    ForumThread.updateOne({ forumThreadID: forumThreadID }, body, function (err, result){
      if(err){
        callback(err, null);
      } else {
        console.log(result);
        callback(null, result);
      }
    })
  }

  function deleteThread(forumThreadID, callback) {
    var query = findForumThreadBy(forumThreadID, function(err, result) {
      if(err){
      console.log("Gab ein Fehler beim Suchen des Threads" + err);
      callback(err, null);
      } else {
        if(result){
          ForumThread.deleteOne({ forumThreadID: req.params.forumThreadID }, function(err, result){
            if(err){
              callback(err, null);
            } else {
              if (result){
                console.log(`Thread mit forumThreadID: ${forumThreadID} deleted`);
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

  function findForumThreadBy(forumThreadID, callback) {
    console.log("ForumThreadService: find THread by ID: " + forumThreadID);
  
    if (!forumThreadID) {
      callback("ThreadID is missing");
      return;
    } else {
      var query = ForumThread.findOne({ forumThreadID: forumThreadID });
      query.exec(function (err, forumThread) {
        if (err) {
          console.log("Did not find THreadID: " + forumThreadID);
          return callback("Did not find forumThread for ThreadID: " + forumThreadID, null);
        } else {
          if (forumThread) {
            console.log(`Found ThreadID: ${forumThreadID}`);
            callback(null, forumThread);
          } else {
              console.log("Could not find forumThread for forumThread ID: " + forumThreadID);
              callback(null, forumThread);

          }
        }
      });
    }
  }

  module.exports = {
      getForumThreads,
      getOneForumThread,
      createUser,
      updateThread,
      deleteThread
  }