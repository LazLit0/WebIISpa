const req = require("../../node_modules/express/lib/request");
const User = require("./UserModel");

function getUsers(callback) {
  User.find(function (err, users) {
    if (err) {
      console.log("Fehler bei Suche: " + err);
      return callback(err, null);
    } else {
      console.log("Alles super");
      return callback(null, users);
    }
  });
}
function createUser(request, callback) {
  console.log("bin in CREATE USER");
 
    var user = new User({
      userID: request.body.userID,
      userName: request.body.userName,
      password: request.body.password,
      isAdministrator: request.body.isAdministrator
    });
    console.log("Das ist der user: " + user);
    user.save(function (err, result) {
      if (err) {
        console.log("Fehler beim erstellen: " + err);
        return callback(err, null);
      } else {
        console.log("Top, alles super");
        return callback(null, user);
      }
    });
}
function findUserBy(searchUserID, callback) {
  console.log("UserService: find User by ID: " + searchUserID);

  if (!searchUserID) {
    callback("UserID is missing");
    return;
  } else {
    var query = User.findOne({ userID: searchUserID });
    query.exec(function (err, user) {
      if (err) {
        console.log("Did not find userID: " + searchUserID);
        return callback("Did not find user for userID: " + searchUserID, null);
      } else {
        if (user) {
          console.log(`Found userID: ${searchUserID}`);
          callback(null, user);
        } else {
          if (`admin` == searchUserID) {
            console.log(
              "Do not have admin account yet. Create it with default password"
            );
            var adminUser = new User();
            adminUser.userID = "admin";
            adminUser.password = "123";
            adminUser.userName = "Default Administrator Account";
            adminUser.isAdministrator = true;

            adminUser.save(function (err) {
              if (err) {
                console.log("Could not create default admin account: " + err);
                callback("Could not login to admin account", null);
              } else {
                callback(null, adminUser);
              }
            });
          } else {
            console.log("Could not find user for user ID: " + searchUserID);
            callback(null, user);
          }
        }
      }
    });
  }
}
function updateUser(req, callback) {
  var query = User.findOne(req.params.userID, function(err) {
    console.log('Konnte User nicht finden ' + err);
  });
  console.log("DAS IST JETZT QUERY" + query);

  query.exec(function (err, user) {
    if (err) {
      console.log("Fehler beim updaten: " + err);
    } else {
      if (user) {
        Object.assign(user, { password: "Manfred" });
        user.save(function (err) {
          if (err) {
            console.log("Fehler: " + err);
            callback("could not update User", null);
          } else {
            console.log("Updated User");
            callback(null, user);
          }
        });
      }
    }
  });
}

function deleteUser(req, callback) {
  var query = findUserBy(req.params.userID, function(err, result) {
    if(err){
    console.log("Gab ein Fehler beim Suchen des Users" + err);
    callback(err, null);
    } else {
      if(result){
        User.deleteOne({ userID: req.params.userID }, function(err, result){
          if(err){
            callback(err, null);
          } else {
            if (result){
              console.log(`User mit UserID: ${req.params.userID} deleted`);
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

module.exports = {
  getUsers,
  findUserBy,
  createUser,
  updateUser,
  deleteUser
};
