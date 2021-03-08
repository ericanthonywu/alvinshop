const db = require('../../database')

/**
 * Handle show genre
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.showGenre = (req, res) => {
    db("master_genre")
        .then(data => res.status(200).json({message: "genre data", data}))
        .catch(err => res.status(500).json({message: "Error when perform Query", error: err}))
}

/**
 * Handle add genre
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.addGenre = (req, res) => {
    const {name, device_id} = req.body
    if (!name || !device_id) {
        return res.status(400).json({message: "Invalid parameters"})
    }

    db("master_genre")
        .insert({name, device_id})
        .then(() => res.status(201).json({message: "genre added"}))
        .catch(err => res.status(500).json({message: "Query failed to be runned", error: err}))
}

/**
 * Handle edit genre
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.editGenre = (req, res) => {
    const {id, name, device_id} = req.body
    if (!name || !id || !device_id) {
        return res.status(400).json({message: "Invalid parameters"})
    }
    db("master_genre")
        .update({name, device_id})
        .where({id})
        .then(() => res.status(202).json({message: "Genre edited"}))
        .catch(err => res.status(500).json({message: "Query failed to be runned", error: err}))
}

/**
 * Handle delete genre
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.deleteGenre = (req, res) => {
    const {id} = req.body
    db("master_genre")
        .where({id})
        .del()
        .then(() => res.status(202).json({message: "Genre Deleted"}))
        .catch(err => res.status(500).json(err))
}
