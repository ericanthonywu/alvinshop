const db = require('../../database')

/**
 * Handle Get Settings
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.getSettings = (req, res) => {
    db("settings")
        .where({id: 1})
        .first()
        .then(data => res.status(200).json({message: "Settings data", data}))
        .catch(err => res.status(500).json({message: "Error execute query", error: err}))
}

/**
 * Handle Update settings
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.updateSettings = (req,res) => {
    const {name, address, phone_numbers, whatsapp_url} = req.body
    db("settings")
        .where({id: 1})
        .update({
            name,
            address,
            phone_numbers,
            icon_shop: req.file.filename,
            whatsapp_url
        })
        .then(() => res.status(200).json({message: "Settings updated"}))
        .catch(err => res.status(500).json({message: "Error execute query", error: err}))
}

/**
 * Handle Migrate Settings
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.migrateSettings = (req,res) => {
    db("settings").insert({})
        .then(() => res.status(200).json({message: "migrate successfully"}))
        .catch(err => res.status(500).json({message: "Error execute query", error: err}))
}
