const db = require('../../database')
const path = require('path')

/**
 * Handle Show Banner
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.showBanner = (req, res) => {
    db("banner")
        .select(
            "id",
            "banner_name",
            "url",
            "image"
        )
        .orderBy("sequence")
        .then(data => res.status(200).json({data, prefix: "uploads/banner"}))
        .catch(err => res.status(500).json({message: "Failed to Execute Query", error: err}))
}

/**
 * Handle add banner
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.addBanner = (req, res) => {
    const {banner_name, url} = req.body
    if (!banner_name || !url) {
        return res.status(400).json({message: "Field needed"})
    }

    if (!req.file) {
        return res.status(400).json({message: "File needed"})
    }
    db.transaction(async trx => {
        try {
            await trx("banner").insert({
                banner_name,
                url,
                image: req.file.filename,
                sequence: await trx("banner")
                    .first("sequence")
                    .orderBy("id", "desc")
                    .limit(1)
            })

            return trx.commit()
        } catch (e) {
            return trx.rollback(e)
        }
    }).then(() => res.status(200).json({message: "Banner added"}))
        .catch(err => res.status(500).json({message: "Error execute query", error: err}))
}

/**
 * Handle edit banner
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.editBanner = (req, res) => {
    const {id, banner_name, url} = req.body

    if (!id || !banner_name || !url) {
        return res.status(400).json({message: "field needed"})
    }

    db.transaction(trx => {
        db("banner")
            .first("image")
            .where({id})
            .then(data => {
                if (!data) {
                    return trx.rollback({message: "Data not found"})
                }
                const updateData = {
                    banner_name,
                    url,
                }
                if (req.file){
                    updateData.image = req.file.filename
                    fs.unlinkSync(path.join(__dirname, "../../uploads/banner/" + data.image))
                }
                db("banner")
                    .where({id})
                    .update(updateData).then(trx.commit)
                    .catch(trx.rollback)
            }).catch(trx.rollback)
    }).then(() => res.status(200).json({message: "Banner edited"}))
        .catch(err => res.status(500).json({message: "Error execute query", error: err}))
}

/**
 * Handle edit order banner
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.updateOrderBanner = (req, res) => {
    const {id, sequence} = req.body
    db("banner").update({sequence}).where({id})
        .then(() => res.status(200).json({message: "Banner order edited"}))
        .catch(err => res.status(500).json({message: "Error execute query", error: err}))
}

/**
 * Handle delete banner
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.deleteBanner = (req, res) => {
    const {id} = req.body

    if (!id) {
        return res.status(400).json({message: "Id needed"})
    }

    db.transaction(trx => {
        trx("banner")
            .first("image")
            .where({id})
            .then(data => {
                if (!data) {
                    return trx.rollback({message: "Data not found"})
                }
                fs.unlinkSync(path.join(__dirname, "../../uploads/banner/" + data.image))
                trx("banner")
                    .where({id})
                    .del()
                    .then(trx.commit)
                    .catch(trx.rollback)
            }).catch(trx.rollback)
    }).then(() => res.status(202).json({message: "Banner deleted"}))
        .catch(err => res.status(500).json({message: "Error execute query", error: err}))
}
