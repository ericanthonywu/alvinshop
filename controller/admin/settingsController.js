const db = require('../../database')
const moment = require('moment')
const fs = require('fs')
const path = require('path')

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
        .then(data => res.status(200).json({message: "Settings data", data: {data, prefix: "uploads/logo_icon"}}))
        .catch(err => res.status(500).json({message: "Error execute query", error: err}))
}

/**
 * Handle Update settings
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.updateSettings = (req, res) => {
    const {name, address, phone_numbers, whatsapp_url, bukalapak, shopee, tokopedia} = req.body
    if (!name || !address || !phone_numbers || !whatsapp_url || !bukalapak || !shopee || !tokopedia) {
        return res.status(400).json({message: "Invalid request"})
    }
    const updateData = {
        name,
        address,
        phone_numbers,
        whatsapp_url,
        bukalapak,
        shopee,
        tokopedia,
        updated_at: moment().format("YYYY-MM-DD").toString()
    }
    db.transaction(trx => {
        if (req.file) {
            updateData.icon_shop = req.file.filename
            trx("settings")
                .where({id: 1})
                .first("icon_shop")
                .then(({icon_shop}) => {
                    try {
                        fs.unlinkSync(path.join(__dirname, "../../uploads/logo_icon/" + icon_shop))
                    } catch (e) {
                        console.log(e)
                    }
                }).catch(trx.rollback)
        }
        trx("settings")
            .where({id: 1})
            .update(updateData)
            .then(trx.commit)
            .catch(trx.rollback)

    }).then(() => res.status(200).json({message: "Settings updated"}))
        .catch(err => res.status(500).json({message: "Error execute query", error: err}))
}

/**
 * Handle Migrate Settings
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.migrateSettings = (req, res) => {
    db.transaction(trx => {
        trx("settings")
            .count("* as totalData")
            .first()
            .then(({totalData}) => {
                if (totalData === 0) {
                    trx("settings").insert({})
                        .then(trx.commit)
                        .catch(trx.rollback)
                } else {
                    trx.commit()
                }
            }).catch(trx.rollback)
    }).then(() => res.status(200).json({message: "migrate successfully"}))
        .catch(err => res.status(500).json({message: "Error execute query", error: err}))
}
