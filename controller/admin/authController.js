const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const db = require('../../database')

/**
 * Handle login for admin
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.login = (req, res) => {
    const {username, password} = req.body
    db("admin")
        .first("password", "id")
        .where({username})
        .then(data => {
            if (!data){
                return res.status(404).json({message: 'User not found'});
            }
            const {password: passwordHashed, id} = data
            bcrypt.compare(password, passwordHashed).then(check => {
                if (check) {
                    jwt.sign({
                        id,
                        username,
                        role: "admin"
                    }, process.env.JWTSECRETTOKEN, (err, token) => {
                        if (err && !token) {
                            return res.status(500).json({message: "jwt can't be signed", error: err})
                        }
                        res.status(200).json({message: "success login", data: {token, id, username, role: "admin"}})
                    })
                }
            }).catch(err => res.status(500).json({message: "failed to compare password", error: err}));
        }).catch(err => res.status(500).json({message: "failed to run query", error: err}));
}

/**
 * Handle register for admin
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.register = (req, res) => {
    const {username, password} = req.body;
    bcrypt.hash(password, 10).then(hashedPassword => {
        db('admin').insert({
            username,
            password: hashedPassword,
        }).then(() => res.status(201).json({message: "admin registered"}))
            .catch(err => res.status(500).json({message: "failed to run query", error: err}));
    }).catch(err => res.status(500).json({message: "failed to run encrypt password", error: err}))
}
