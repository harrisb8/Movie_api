/**
 * Defining a sceret key that must be used in order to identify users
 */

const jwtSecret ='your_jwt_secret';

const jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./passport');

/**
 * This is a function to generateJWTToken
 * @param {} user 
 * @returns  username, and jwtsecret
 * which will expire in seven days using an algorithm
 */

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username,
        expiresIn: '7d',
        algorithm: 'HS256'
    });
}

/**
 * This is a function that request user authentication
 * @param {*} router 
 * If there is something wrong with the information provided for login
 * @returns message "Something is not right"
 * If login in information is successful. The api will generate a JWTToken
 * @returns user and token
 */
module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', {session: false }, 
        (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Something is not right',
                    user: user
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({ user, token });
            });
        })(req, res);
    });
}