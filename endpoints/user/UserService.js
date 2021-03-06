const req = require("../../node_modules/express/lib/request");
const User = require("./UserModel");

function getUsers(callback) {

  User.find(function (err, users) {
        if (err) {
          console.log("Fehler bei Suche: " + err);
          return callback(err, null);
        } else {
          console.log("Alles super");
          for (let index = 0; index < users.length; index++) {
            const element = users[index];
            const { id, userID, userName, isAdministrator, ...partialObject } = element;
            const subset = { id, userID, userName, isAdministrator };
            users[index] = subset; 
          }
          return callback(null, users);
      }
})
}

function getOneUser(userID, callback){
  findUserBy(userID, function(err, user) {
    if(err){
      console.log("Fehler bei Suche: " + err);
      return callback(err, null); 
    } else {
      console.log("Alles super");
      const { id, userID, userName, isAdministrator, ...partialObject } = user;
      const subset = { id, userID, userName, isAdministrator };
      return callback(null, subset);
    }
  })
}

function createUser(body, callback) {
  console.log("bin in CREATE USER");
 
    var user = new User({
      userID: body.userID,
      userName: body.userName,
      password: body.password,
      isAdministrator: body.isAdministrator
    });

    console.log("Das ist der user: " + user);
    user.save(function (err, result) {
      if (err) {
        console.log("Fehler beim erstellen: " + err);
        return callback(err, null);
      } else {
        console.log("Top, alles super");
        const { id, userID, userName, isAdministrator, ...partialObject } = user;
        const subset = { id, userID, userName, isAdministrator };
        return callback(null, subset);
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
          return callback(null, user);
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

function updateUser(userID, body, callback){
  console.log(req.body);
  User.updateOne({ userID: userID }, body, function (err, result){
    if(err){
      callback(err, null);
    } else {
      console.log(result);
      callback(null, result);
    }
  })
}

function deleteUser(userID, callback) {
  var query = findUserBy(userID, function(err, result) {
    if(err){
    console.log("Gab ein Fehler beim Suchen des Users" + err);
    callback(err, null);
    } else {
      if(result){
        User.deleteOne({ userID: userID }, function(err, result){
          if(err){
            callback(err, null);
          } else {
            if (result){
              console.log(`User mit UserID: ${userID} deleted`);
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
  getOneUser,
  findUserBy,
  createUser,
  updateUser,
  deleteUser
};
