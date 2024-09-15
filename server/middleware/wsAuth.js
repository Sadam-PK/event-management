const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET = process.env.SECRET;

const authenticateWebSocket = (ws, req, next) => {
  const token = req.url.split("token=")[1]; 

  if (token) {
    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        ws.close(4001, "Unauthorized");
        return;
      }
      ws.user = user;
      next();
    });
  } else {
    ws.close(4001, "Token missing");
  }
};

module.exports = authenticateWebSocket;
