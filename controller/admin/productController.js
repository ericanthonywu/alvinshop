const db = require('../../database')
const path = require('path')

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
            "product.id as product_id",
            "title",
            "description",
            "price",
            "stock",
            "youtube_link",
            "master_category.name as kategori"
        )
        .join("genre", "genre.product_id", "product.id")
        .join("master_category", "master_category.name", "genre.category_id")

    if (typeof offset == "number" && typeof limit == "number") {
        query.where("product.id", ">", offset + limit)
        query.where("product.id", ">", offset)
    }

    query.then(data => res.status(200).json({message: "products data", data}))
        .catch(err => res.status(500).json({message: "Error when perform Query", error: err}))
}

/**
 * Handle Show Product image by id
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.showImageProductById = (req, res) => {
    const {product_id} = req.body;
    db("product_image")
        .select("image_url")
        .where({product_id})
        .then(data => res.status(200).json({message: "products image data", data, prefix: "uploads/product"}))
        .catch(err => res.status(500).json({message: "Error when perform Query", error: err}))
}

/**
 * Handle add product
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.addProduct = (req, res) => {
    const {title, description, price, stock, youtube_link, discount, genre, device} = req.body
    if (!title || !description || !price || !stock || !youtube_link || !discount || !genre || !device) {
        return res.status(400).json({message: "Invalid parameters"})
    }

    if (!req.files) {
        return res.status(400).json({message: "Files are required"})
    }

    db.transaction(trx => {
        trx("product").insert({
            title,
            description,
            price,
            stock,
            youtube_link,
            discount,
            created_by: res.userData.id,
        }, "id").then(data => {
            const id = data[0]
            trx("product_image").insert(
                req.files.map(value => ({
                    image_name: value,
                    product_id: id
                }))
            ).then(() => {
                trx("master_genre")
                    .insert(genre.map(category_id => ({category_id, product_id: id})))
                    .then(() => {
                        trx("device_category")
                            .insert(device.map(device_id => ({device_id, product_id: id})))
                            .then(trx.commit)
                            .catch(trx.rollback)
                    })
                    .catch(trx.rollback)
            }).catch(trx.rollback)
        }).catch(trx.rollback)
    }).then(() => res.status(201).json({message: "product added"}))
        .catch(err => res.status(500).json({message: "Query failed to be runned", error: err}))
}

/**
 * Handle delete product in database and delete image product
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.editProduct = (req, res) => {
    const {id, title, description, price, stock, youtube_link, discount} = req.body
    db("product").update({
        title,
        description,
        price,
        stock,
        youtube_link,
        discount,
    })
        .where({id})
        .then(() => res.status(202).json({message: "Product edited"}))
        .catch(err => res.status(500).json({message: "Query failed to be runned", error: err}))
}

/**
 * Handle edit image product
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.editImageProduct = (req, res) => {
    const {file, productId, productImageId} = req
    if (typeof file == "undefined") {
        return res.status(400).json({message: "Files Required"})
    }
    db("product_image").where({
        id: productImageId,
        product_id: productId
    }).first("image_name").then(data => {
        if (!data) {
            return res.status(404).json({message: "Product Id or Image Product Id not found"})
        }
        res.status(200).json({message: "Image Product Edited"})
        fs.unlinkSync(path.join(__dirname, "../../uploads/" + data.image_name))
    }).catch(err => res.status(500).json({message: "Query failed to be runned", error: err}))
}

/**
 * Handle edit image product
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.deleteProduct = (req, res) => {
    const {productId: id} = req.body
    db.transaction(trx => {
        trx("product_image")
            .where({product_id: id})
            .select("image_name")
            .then(data => {
                if (!data.length) {
                    trx.rollback({message: "Data not found"})
                }
                trx("product")
                    .where({id})
                    .del()
                    .then(() => {
                        trx("product_image")
                            .where({product_id: id})
                            .del()
                            .then(trx.commit)
                            .catch(err => trx.rollback({message: "Failed to run query", error: err}))
                    }).catch(err => trx.rollback({message: "Failed to run query", error: err}))
                data.forEach(({image_name}) => fs.unlinkSync(path.join(__dirname, "../../uploads/product/" + image_name)))
            }).catch(err => trx.rollback({message: "Failed to run query", error: err}))
    }).then(() => res.status(202).json({message: "Product Deleted"}))
        .catch(err => res.status(500).json(err))
}
