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
module.exports = {
  getUsers,
  findUserBy,
};
