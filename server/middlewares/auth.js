const auth = require("../helpers/auth");

module.exports = (request, response, next) => {
  if (auth.isAuthenticated(request.get("authorization"))) {
    next();
  } else {
    return response.status(401).json({
      error: "Unauthorized"
    });
  }
};
