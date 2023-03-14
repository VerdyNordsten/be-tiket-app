const jwt = require("jsonwebtoken")

const verifyToken = async (req, res, next) => {
  try {
    let token
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1]
      let decoded = await jwt.verify(token, process.env.SECRET_KEY_JWT)
      // console.log("decoded payload:", decoded)
      req.payload = decoded
      next()
    } else {
      return commonHelper.response(res, null, 401, "Unauthorized, Please provide valid token")
    }
  } catch (error) {
    if (error && error.name === "JsonWebTokenError") {
      return commonHelper.response(res, null, 401, "Token invalid")
    } else if (error && error.name === "TokenExpiredError") {
      return commonHelper.response(res, null, 401, "Token expired")
    } else {
      return commonHelper.response(res, null, 401, "Token not active")
    }
  }
}


module.exports = { verifyToken }
