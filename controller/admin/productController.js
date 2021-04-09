const db = require('../../database')
const path = require('path')
const fs = require('fs')
const moment = require("moment")

/**
 * Handle Show Product
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.showProduk = (req, res) => {
    const {limit, offset} = req.body

    const query = db('product')
        .select(
            "id",
            "title",
            "price",
            "stock",
            "youtube_link",
            "discount",
        )

    if (typeof offset == "number" && typeof limit == "number") {
        query.limit(limit).offset(offset)
    }

    query.then(data => res.status(200).json({message: "products data", data}))
        .catch(err => res.status(500).json({message: "Error when perform Query", error: err}))
}

/**
 * Handle Show Product by Id
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.showProdukById = (req, res) => {
    const {id} = req.body
    db('product')
        .first(
            "title",
            "description",
            "price",
            "stock",
            "youtube_link",
            "discount",
        ).where({id})
        .then(data => res.status(200).json({message: `Data of product with id ${id}`, data}))
        .catch(err => res.status(500).json({message: "Error when perform query", error: err}))

}

/**
 * Handle Show Detail Product by product id
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.showDetailProduct = (req, res) => {
    const {product_id} = req.body;
    if (!product_id) {
        return res.status(400).json({message: "Product id needed"})
    }
    db.transaction(trx => {
        const subQuery = db("product").first(db.raw(1)).where({id: product_id})
        trx("product")
            .first(db.raw("exists? as `check`", [subQuery]))
            .then(data => {
                if (data.check === 0) {
                    return trx.rollback({message: "Product Id not found"})
                }
                trx("product_image")
                    .select("id", "image_name")
                    .where({product_id})
                    .then(image => {
                        trx("category")
                            .where({product_id})
                            .join("master_category", "category.category_id", "master_category.id")
                            .select("master_category.id as id", "master_category.name as category")
                            .then(category => {
                                trx("genre")
                                    .join("master_genre", "genre.genre_id", "master_genre.id")
                                    .select("master_genre.id as id", "master_genre.name as genre")
                                    .where({product_id})
                                    .then(genre => {
                                        trx("device")
                                            .where({product_id})
                                            .join("master_device", "device.device_id", "master_device.id")
                                            .select("master_device.id as id", "master_device.name as device")
                                            .then(device =>
                                                trx.commit({
                                                    image: {data: image, prefix: "uploads/product"},
                                                    category,
                                                    device,
                                                    genre
                                                })
                                            ).catch(trx.rollback)
                                    }).catch(trx.rollback)
                            }).catch(trx.rollback)
                    }).catch(trx.rollback)
            }).catch(trx.rollback)
    }).then(data => res.status(200).json({
        message: "Products detail data",
        data,
    })).catch(err => res.status(500).json({message: "Error when perform Query", error: err}))
}

/**
 * Handle Show Product image by id
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.showImageProductById = (req, res) => {
    const {product_id} = req.body;
    if (!product_id) {
        return res.status(400).json({message: "Product id needed"})
    }
    db("product_image")
        .select("id", "image_name")
        .where({product_id})
        .then(data => res.status(data.length ? 200 : 404).json({
            message: "products image data",
            data,
            prefix: "uploads/product"
        }))
        .catch(err => res.status(500).json({message: "Error when perform Query", error: err}))
}

/**
 * Handle add product
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.addProduct = (req, res) => {
    const {title, description, price, stock, youtube_link, discount, genre, device, category, tahun_rilis, publisher} = req.body
    if (!title || !description || !price || !stock || !youtube_link || !discount || !genre || !device || !publisher || !category) {
        return res.status(400).json({message: "Invalid parameters"})
    }

    if (!req.files) {
        return res.status(400).json({message: "Files are required"})
    }

    db.transaction(async trx => {
        try {
            const [id] = await trx("product").insert({
                title,
                description,
                price,
                stock,
                youtube_link,
                discount,
                created_by: res.userData.id,
                tahun_rilis,
                publisher
            }, "id")

            await trx("product_image").insert(
                req.files.map(({filename}) => ({
                    image_name: filename,
                    product_id: id
                }))
            )
            await trx("genre")
                .insert(JSON.parse(genre).map(genre_id => ({genre_id, product_id: id})))
            await trx("device")
                .insert(JSON.parse(device).map(device_id => ({device_id, product_id: id})))
            await trx("category")
                .insert(JSON.parse(category).map(category_id => ({category_id, product_id: id})))
            return trx.commit()
        } catch (e) {
            return trx.rollback(e)
        }
    }).then(() => res.status(201).json({message: "product added"}))
        .catch(err => res.status(500).json({message: "Query failed to be runned", error: err}))
}

/**
 * Handle edit product
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.editProduct = (req, res) => {
    const {id, title, description, price, stock, youtube_link, discount, tahun_rilis, publisher} = req.body
    db("product").update({
        title,
        description,
        price,
        stock,
        youtube_link,
        discount,
        tahun_rilis,
        publisher,
        updated_at: moment().format("YYYY-MM-DD HH:mm:ss").toString()
    })
        .where({id})
        .then(() => res.status(202).json({message: "Product edited"}))
        .catch(err => res.status(500).json({message: "Query failed to be runned", error: err}))
}

/**
 * Handle delete product
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.deleteProduct = (req, res) => {
    const {id} = req.body
    db.transaction(trx => {
        trx("product_image")
            .where({product_id: id})
            .select("image_name")
            .then(data => {
                if (data.length) {
                    try {
                        data.forEach(({image_name}) => fs.unlinkSync(path.join(__dirname, "../../uploads/product/" + image_name)))
                    } catch (e) {
                        console.log(e)
                    }
                }
                trx("product")
                    .where({id})
                    .del()
                    .then(trx.commit)
                    .catch(err => trx.rollback({message: "Failed to run query", error: err}))
            }).catch(err => trx.rollback({message: "Failed to run query", error: err}))
    }).then(() => res.status(202).json({message: "Product Deleted"}))
        .catch(err => res.status(500).json(err))
}

/**
 * Handle add image product
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.addImageProduct = (req, res) => {
    const {product_id} = req.body
    if (!product_id || !req.file) {
        return res.status(400).json({message: "Product id and file needed"})
    }
    db("product_image").insert({
        product_id,
        image_name: req.file.filename
    }).then(() => res.status(200).json({
        message: "Product Image added",
        image: {
            filename: req.file.filename,
            prefix: "uploads/produk"
        }
    })).catch(err => res.status(500).json({message: "Failed to insert data to DB", error: err}))
}

/**
 * Handle edit image product
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.editImageProduct = (req, res) => {
    const {productId, productImageId} = req.body
    if (typeof req.file == "undefined") {
        return res.status(400).json({message: "Files Required"})
    }
    db.transaction(trx => {
        trx("product_image").where({
            id: productImageId,
            product_id: productId
        }).first("image_name").then(data => {
            if (!data) {
                return res.status(404).json({message: "Product Id or Image Product Id not found"})
            }
            trx("product_image").where({
                id: productImageId,
                product_id: productId
            }).update({
                image_name: req.file.filename
            }).then(() => trx.commit({filename: req.file.filename, prefix: "uploads/produk"}))
                .catch(trx.rollback)
            try {
                fs.unlinkSync(path.join(__dirname, "../../uploads/produk/" + data.image_name))
            } catch (e) {
                console.log(e)
                return trx.rollback(e)
            }
        }).catch(trx.rollback)
    }).then(image => res.status(200).json({message: "Image Product Edited", image}))
        .catch(err => res.status(500).json({message: "Query failed to be runned", error: err}))
}

/**
 * Handle delete product in database and delete image product
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.deleteImageProduct = (req, res) => {
    const {productId, productImageId} = req.body
    if (typeof productId == "undefined" || typeof productImageId == "undefined") {
        return res.status(400).json({message: "productImageId and productId Required"})
    }
    db.transaction(trx => {
        trx("product_image").where({
            id: productImageId,
            product_id: productId
        }).first("image_name").then(data => {
            if (!data) {
                return trx.rollback({message: "Product Id or Image Product Id not found"})
            }
            trx("product_image").where({
                id: productImageId,
                product_id: productId
            }).del()
                .then(trx.commit)
                .catch(trx.rollback)
            try {
                fs.unlinkSync(path.join(__dirname, "../../uploads/produk/" + data.image_name))
            } catch (e) {
                console.log(e)
                trx.rollback(e)
            }
        }).catch(trx.rollback)
    }).then(() => res.status(200).json({message: "Image Product Deleted"}))
        .catch(err => res.status(500).json({message: "Query failed to be runned", error: err}))
}

/**
 * Handle Add category product
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.addCategoryProduct = (req, res) => {
    const {product_id, category_id} = req.body
    if (typeof product_id == "undefined" || typeof category_id == "undefined") {
        return res.status(400).json({message: "Product id and category id needed"})
    }

    db("category")
        .insert({product_id, category_id})
        .then(() => res.status(201).json({message: "Category added"}))
        .catch(err => res.status(500).json({message: "Query failed to be runned", error: err}))
}

/**
 * Handle delete category product
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.deleteCategoryProduct = (req, res) => {
    const {product_id, category_id} = req.body
    if (typeof product_id == "undefined" || typeof category_id == "undefined") {
        return res.status(400).json({message: "Product id and category id needed"})
    }
    db("category")
        .where({product_id, category_id})
        .del()
        .then(() => res.status(202).json({message: "Category deleted"}))
        .catch(err => res.status(500).json({message: "Query failed to be runned", error: err}))
}

/**
 * Handle Add genre product
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.addGenreProduct = (req, res) => {
    const {product_id, genre_id} = req.body
    if (typeof product_id == "undefined" || typeof genre_id == "undefined") {
        return res.status(400).json({message: "Product id and genre id needed"})
    }
    db("genre")
        .insert({product_id, genre_id})
        .then(() => res.status(201).json({message: "Genre added"}))
        .catch(err => res.status(500).json({message: "Query failed to be runned", error: err}))
}

/**
 * Handle delete genre product
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.deleteGenreProduct = (req, res) => {
    const {product_id, genre_id} = req.body
    if (typeof product_id == "undefined" || typeof genre_id == "undefined") {
        return res.status(400).json({message: "Product id and genre id needed"})
    }
    db("genre")
        .where({product_id, genre_id})
        .del()
        .then(() => res.status(202).json({message: "Genre deleted"}))
        .catch(err => res.status(500).json({message: "Query failed to be runned", error: err}))
}

exports.toggleTodayOffer = (req, res) => {
    const {product_id, offer_status} = req.body
    if (typeof offer_status !== "boolean") {
        return res.status(400).json({message: "offer_status must be boolean"})
    }
    db("product")
        .where({id: product_id})
        .update({today_offer: offer_status})
        .then(() => res.status(201).json({message: "Todays offer updated"}))
        .catch(err => res.status(500).json({message: "Query failed to be runned", error: err}))
}

/**
 * Handle add device product
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.addDeviceProduct = (req, res) => {
    const {product_id, device_id} = req.body
    if (typeof product_id == "undefined" || typeof device_id == "undefined") {
        return res.status(400).json({message: "Product id and category id needed"})
    }
    db("device")
        .insert({product_id, device_id})
        .then(() => res.status(201).json({message: "Device added"}))
        .catch(err => res.status(500).json({message: "Query failed to be runned", error: err}))
}

/**
 * Handle delete device product
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.deleteDeviceProduct = (req, res) => {
    const {product_id, device_id} = req.body
    if (typeof product_id == "undefined" || typeof device_id == "undefined") {
        return res.status(400).json({message: "Product id and category id needed"})
    }
    db("device")
        .where({product_id, device_id})
        .del()
        .then(() => res.status(202).json({message: "Device deleted"}))
        .catch(err => res.status(500).json({message: "Query failed to be runned", error: err}))
}
