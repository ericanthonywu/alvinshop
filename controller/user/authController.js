const db = require('../../database')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {sendEmail} = require('../../globalHelper')
const cryptoRandomString = require('crypto-random-string');

/**
 * Handle login for user
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.login = (req, res) => {
    const {username, password} = req.body
    if (typeof username == "undefined" || typeof password == "undefined") {
        return res.status(400).json({message: 'username and password are required'})
    }
    db("user")
        .first("password", "id")
        .where({username})
        .then(data => {
            if (!data) {
                return res.status(404).json({message: 'User not found'});
            }
            const {password: passwordHashed, id} = data
            if (!data.verify_email) {
                return res.status(403).json({message: "Email not verified"})
            }
            bcrypt.compare(password, passwordHashed).then(check => {
                if (check) {
                    jwt.sign({
                        id,
                        username,
                        role: "user"
                    }, process.env.JWTSECRETTOKEN, (err, token) => {
                        if (err && !token) {
                            return res.status(500).json({message: "jwt can't be signed", error: err})
                        }
                        res.status(200).json({message: "success login", data: {token, id, username, role: "user"}})
                    })
                }
            }).catch(err => res.status(500).json({message: "failed to compare password", error: err}));
        }).catch(err => res.status(500).json({message: "failed to run query", error: err}));
}

/**
 * Handle register for user
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.register = (req, res) => {
    const {username, password, email} = req.body;
    bcrypt.hash(password, 10).then(hashedPassword => {
        const token = Math.floor(Math.random() * 10000000000).toString() +
            cryptoRandomString({length: 200, type: 'url-safe'});
        sendEmail.sendMail({
            from: "alvinshop",
            to: email,
            subject: "Token Verification",
            html: `Hello ${username}! <br><br>
                    Thank you for registering, click link below to verify your email: 
                    <br><br><p style="font-size:24px;"><b><a href="http://156.67.220.185/verify/${token}"></a></b></p><br>
                        IMPORTANT! NEVER TELL YOUR TOKEN TO ANYONE!`
        }).then(() => {
            db('user').insert({
                username,
                password: hashedPassword,
                email
            }).then(() => res.status(201).json({message: "user registered"}))
                .catch(err => res.status(500).json({message: "failed to run query", error: err}));
        }).catch(err => res.status(500).json({message: "failed to send email", error: err}));
    })
}

/**
 * Handle verify token email for user
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.verifyEmail = (req, res, next) => {
    const {token} = req.body
    db("user")
        .count("token as count")
        .first()
        .where({token})
        .then(({count}) => {
            if (!count){
                return res.status(404).json({message: "token not found"})
            }
            db("user")
                .update({
                    verify_email: true,
                    token: null
                })
                .where({token})
                .then(() => res.status(200).json({message: "user verified"}))
                .catch(err => res.status(500).json({message: "failed to run query", error: err}));
        })
        .catch(err => res.status(500).json({message: "failed to run query", error: err}));
}
