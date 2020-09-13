const db = require("../../database")
const fs = require("fs")
const path = require("path")

/**
 * Show our partner
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.showOurPartner = (req, res) => {
    db("our_partner")
        .then(data => res.status(200).json({message: "Our partner data", data, prefix: "uploads/our_partner"}))
        .catch(err => res.status(500).json({message: "Error execute query", error: err}))
}

/**
 * handle add our partner
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.addOurPartner = (req, res) => {
    const {partner_code, partner_name, url} = req.body
    db("our_partner").insert({
        partner_code,
        partner_name,
        url,
        logo: req.file.filename
    }).then(() => res.status(201).json({message: "Success add partner data"}))
        .catch(err => res.status(500).json({message: "Error execute query", error: err}))
}

/**
 * handle edit our partner
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.editOurPartner = (req, res) => {
    const {id, partner_code, partner_name, url} = req.body
    const updatedData = {
        partner_code,
        partner_name,
        url,
    }
    db.transaction(trx => {
        trx("our_partner")
            .first("logo")
            .where({id})
            .then(data => {
                if (!data) {
                    return trx.rollback({message: "Data Not found"})
                }
                if (req.file) {
                    updatedData.logo = req.file.filename
                    fs.unlinkSync(path.join(__dirname, "../../uploads/our_partner/" + data.logo))
                }
                trx("our_partner").update(updatedData).where({id})
                    .then(trx.commit)
                    .catch(trx.rollback)
            }).catch(trx.rollback)
    }).then(() => res.status(201).json({message: "Success edit partner data"}))
        .catch(err => res.status(500).json({message: "Error execute query", error: err}))
}


/**
 * delete edit our partner
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.deleteOurPartner = (req, res) => {
    const {id} = req.body
    db.transaction(trx => {
        trx("our_partner")
            .first("logo")
            .where({id})
            .then(data => {
                if (!data) {
                    return trx.rollback({message: "Data Not found"})
                }
                if (req.file) {
                    fs.unlinkSync(path.join(__dirname, "../../uploads/our_partner/" + data.logo))
                }
                trx("our_partner").del().where({id})
                    .then(trx.commit)
                    .catch(trx.rollback)
            }).catch(trx.rollback)
    }).then(() => res.status(201).json({message: "Success edit partner data"}))
        .catch(err => res.status(500).json({message: "Error execute query", error: err}))
}
