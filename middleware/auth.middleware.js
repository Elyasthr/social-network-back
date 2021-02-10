const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');

module.exports.checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.TOKEN_PASS, async (err, data) => {
            if (err) {
                res.locals.user = null;
                next();
            }
            else {
                let user = await UserModel.findById(data._id);
                res.locals.user = user;
                next()
            }
        })
    }
    else {
        res.locals.user = null;
        next();
    }
}

module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.TOKEN_PASS, async (err, data) => {
            if (err) { 
                console.log(err);
            }
            else{
                console.log(data._id);
                next();
            }
        })
    }
    else{
        console.log('pas de token');
    }
}
