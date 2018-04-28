const jwt = require("jsonwebtoken");

module.exports = {
  isAuthenticated(token) {
    token = this._extractToken(token);
    
    try {
      let decoded = jwt.verify(token, process.env.JWT_SECRET);
      return {
        data: decoded.data
      };
    } catch (error) {
      return false;
    }
  },
  _extractToken(token) {
    if (typeof token == "undefined") {
      return false;
    } else if (token.indexOf("Bearer") != -1) {
      return token.split("Bearer")[1].trim();
    } else {
      return token;
    }
  }
};
