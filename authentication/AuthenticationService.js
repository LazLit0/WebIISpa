var userService = require("../endpoints/user/UserService");
var jwt = require("jsonwebtoken");
var config = require("config");
const { resetDetectedVersion } = require("../node_modules/eslint-plugin-react/lib/util/version");


function createSessionToken(userID, password, callback) {
  console.log("AuthenticationService: create Token");

  if (!userID) {
    console.log("No UserID");
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
          if (isMatch) {
            var issuedAt = new Date().getTime();
            var expirationTime = config.get("session.timeout");
            var expiresAt = 300;
            var privateKey = config.get("session.tokenKey");
            let token = jwt.sign({ user: user.userID }, privateKey, {
              expiresIn: expiresAt,
              algorithm: "HS256"
            });

            console.log("Token created: " + token);

            callback(null, token, user);
          } else {
            console.log("Fehler bei isMatch");
            callback(null, null, null);
          }
        }
      });
    }
  });
}

function isAuthenticated(req, res, next) {
  console.log("ACHTUNG AUTH !!!");
  console.log(req.headers.authorization);
  if (!req.headers.authorization) {
    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
    return res.json({ message: 'Missing Authorization Header' });
  }

  if (typeof req.headers.authorization !== "undefined") {
    let token = req.headers.authorization.split(" ")[1];
    console.log("Das ist der token: " + token);
    var privateKey = config.get('session.tokenKey');
    console.log("Das ist der pricateKey: " + privateKey);
    jwt.verify(token, privateKey, (err, authData) => {
      if (err) {
        res.status(401).json({ error: "Not Authorized or token expired" });
        return;
      }
        res.status(200);
        req.token = token;
        authData;
        next();
      });
      
      // const nowUnixSeconds = Math.round(Number(new Date())/1000);
      // if(payload.exp - nowUnixSeconds > 30){
      //      res.status(400).end();
      //      return next();
      //   }
      //   const newToken = jwt.sign({username: payload.user},privateKey,{
      //         algorithm:'HS256',
      //         expiresIn: 300
      //     });
        }
      }

      function isAdmin(req,res,next) {
        var privateKey = config.get('session.tokenKey');
        var payload = jwt.verify(req.token, privateKey) 
        console.log("Das ist der PAYLOAD: " + JSON.stringify(payload));
        console.log("Das ist payloaduser: " + payload.user);
        userService.findUserBy(payload.user, (err, user) => {
          if(err){
            res.status(500).json({error: "No User with this ID"});
            return;
          } else {
              console.log("Das uist User admin attribut: " + user.isAdministrator);
              if(user.isAdministrator){
                res.status(200);
                next();
              } else {
                res.status(401).json({error: "You need to be admin"});
                return;
              }
          }
        });
      }
module.exports = {
  createSessionToken,
  isAuthenticated,
  isAdmin
};
