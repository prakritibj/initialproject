const jwt = require("jsonwebtoken")
const authenticateUser = (req, res, next) => {
    const token = req.headers['x-access-token']
    if (!token) {
        return res.send({ status: "err", msg: "no token provided here" })
    }

    try {
        const tokenVerify = jwt.verify(token, process.env.TOKEN_SECRET)
        req._id = tokenVerify._id
        next()
    } catch (err) {
        return res.send({ status: "err", msg: "anouthorised access" })
    }
}
module.exports = authenticateUser