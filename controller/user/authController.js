const db = require('../../database')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
        db('user').insert({
            username,
            password: hashedPassword,
            email
        }).then(() => res.status(201).json({message: "user registered"}))
            .catch(err => res.status(500).json({message: "failed to run query", error: err}));
    })
}
