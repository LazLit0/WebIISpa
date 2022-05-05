var userService = require("../endpoints/user/UserService");
var jwt = require("jsonwebtoken");
var config = require("config");


function createSessionToken(userID, password, callback) {
  console.log("AuthenticationService: create Token");

  if (!userID) {
    console.log("Error: have no json body");
    callback("JSON-Body missing", null, null);
    return;
  }

  userService.findUserBy(userID, function (error, user) {
    if (user) {
      console.log("Found user, check the password");

      user.comparePassword(password, function (err, isMatch) {
        if (err) {
          console.log("Password is invalid");
          callback(err, null);
        } else {
          console.log("Password is correct. Create token.");
          var issuedAt = new Date().getTime();
          var expirationTime = config.get("session.timeout");
          var expiresAt = issuedAt + expirationTime * 1000;
          var privateKey = config.get("session.tokenKey");
          let token = jwt.sign({ user: user.userID }, privateKey, {
            expiresIn: expiresAt,
            algorithm: "HS256",
          });

          console.log("Token created: " + token);

          callback(null, token, user);
        }
      });
    }
  });
}
module.exports = {
  createSessionToken,
};
