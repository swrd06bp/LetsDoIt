
const jwt = require('jsonwebtoken')
const jwtConfig = require('./jwtConfig')

module.exports = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token']
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, jwtConfig.secret, function(err, decoded) {
        if (err) {
            return res.status(401).json({"error": true, "message": 'Unauthorized access.' }).end();
        }
      req.decoded = decoded.userId;
      next();
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).json({
        "error": true,
        "message": 'No token provided.'
    }).end()
  }
}
