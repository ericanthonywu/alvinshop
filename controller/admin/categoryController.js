const db = require('../../database')

/**
 * Handle show Category
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.showCategory = (req, res) => {
    db("master_category")
        .then(data => res.status(200).json({message: "category data", data}))
        .catch(err => res.status(500).json({message: "Error when perform Query", error: err}))
}

/**
 * Handle add category
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.addCategory = (req, res) => {
    const {name, device_id} = req.body
    if (!name || !device_id) {
        return res.status(400).json({message: "Invalid parameters"})
    }

    db("master_category")
        .insert({name, device_id})
        .then(() => res.status(201).json({message: "category added"}))
        .catch(err => res.status(500).json({message: "Query failed to be runned", error: err}))
}

/**
 * Handle edit category
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.editCategory = (req, res) => {
    const {id, name, device_id} = req.body
    if (!name || !id || !device_id) {
        return res.status(400).json({message: "Invalid parameters"})
    }
    db("master_category")
        .update({name, device_id})
        .where({id})
        .then(() => res.status(202).json({message: "Category edited"}))
        .catch(err => res.status(500).json({message: "Query failed to be runned", error: err}))
}

/**
 * Handle delete category
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.deleteCategory = (req, res) => {
    const {id} = req.body
    db("master_category")
        .where({id})
        .del()
        .then(() => res.status(202).json({message: "Category Deleted"}))
        .catch(err => res.status(500).json(err))
}
