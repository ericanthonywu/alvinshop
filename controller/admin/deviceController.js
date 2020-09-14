const db = require("../../database")

/**
 * Handle show Device
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.showDevice = (req, res) => {
    db("master_device")
        .then(data => res.status(200).json({message: "Device data", data}))
        .catch(err => res.status(500).json({message: "Error Execute query", error: err}))
}

/**
 * Handle add Device
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.addDevice = (req, res) => {
    const {name} = req.body
    db("master_device")
        .insert({name})
        .then(() => res.status(201).json({message: "Device added"}))
        .catch(err => res.status(500).json({message: "Error Execute query", error: err}))
}

/**
 * Handle edit Device
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.editDevice = (req, res) => {
    const {name, id} = req.body
    db("master_device")
        .update({name})
        .where({id})
        .then(() => res.status(202).json({message: "Device updated"}))
        .catch(err => res.status(500).json({message: "Error Execute query", error: err}))
}

/**
 * Handle delete Device
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.deleteDevice = (req, res) => {
    const {id} = req.body
    db("master_device").where({id}).del()
        .then(() => res.status(202).json({message: "Device deleted"}))
        .catch(err => res.status(500).json({message: "Error Execute query", error: err}))
}
