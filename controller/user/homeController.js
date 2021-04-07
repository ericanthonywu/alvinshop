const db = require('../../database');

exports.bannerUser = (req, res) => {
    db("banner")
        .select(
            'banner_name',
            'url',
            db.raw("CONCAT('uploads/banner/', image) as banner_image")
        )
        .orderBy('sequence', 'asc')
        .then(data => res.status(200).json({message: "banner", data}))
        .catch(err => res.status(500).json(err))
}

exports.searchProduct = (req, res) => {
    const {keyword} = req.query
    db("product")
        .where('title', 'like', `${keyword}%`)
        .select(
            "product.id as product_id",
            "title",
            "price",
            "stock",
            db.raw("CONCAT('uploads/produk/', pim.image_name) as product_image")
        )
        .leftJoin("product_image", "product_image.product_id", "product.id")
        .joinRaw("join (select id, image_name from product_image where product_id = product_image.product_id limit 1) pim on pim.id = `product_image`.id")
        .then(data => res.status(200).json({message: "banner", data: {data, prefix: "uploads/our_partner"}}))
        .catch(err => res.status(500).json(err))
}

exports.ourPartner = (req, res) => {
    db("our_partner")
        .select('*')
        .then(data => res.status(200).json({message: "our partner", data}))
        .catch(err => res.status(500).json(err))
}

exports.recommendProduct = (req, res) => {
    db("product")
        .select(
            "product.id as product_id",
            "title",
            db.raw("CONCAT('uploads/produk/', pim.image_name) as product_image")
        )
        // .distinct("order_detail.product_id")
        .leftJoin("product_image", "product_image.product_id", "product.id")
        .leftJoin("order_detail", "order_detail.product_id", "product.id")
        .joinRaw("join (select id, image_name from product_image where product_id = product_image.product_id limit 1) pim on pim.id = `product_image`.id")
        .where('stock', '>', 0)
        .orderBy("order_detail.product_id", "desc")
        .limit(5)
        .then(data => res.status(200).json({message: "recommend product", data}))
        .catch(err => res.status(500).json(err))
}

exports.todayOffer = (req, res) => {
    db("product")
        .select(
            "product.id as product_id",
            "title",
            db.raw("CONCAT('uploads/produk/', pim.image_name) as product_image")
        )
        .leftJoin("product_image", "product_image.product_id", "product.id")
        .joinRaw("join (select id, image_name from product_image where product_id = product_image.product_id limit 1) pim on pim.id = `product_image`.id")
        .orderBy("product.created_at", "desc")
        .limit(5)
        .then(data => res.status(200).json({message: "todays offer product", data}))
        .catch(err => res.status(500).json(err))
}

exports.getSettings = (req, res) => {
    db("settings")
        .where({id: 1})
        .first()
        .then(data => res.status(200).json({message: "Settings data", data: {data, prefix: "uploads/logo_icon"}}))
        .catch(err => res.status(500).json({message: "Error execute query", error: err}))
}

exports.getDevice = (req, res) => {
    db("master_device")
        .then(data => res.status(200).json({message: "list device", data}))
        .catch(err => res.status(500).json(err))

}
exports.getListFilter = async (req, res) => {
    try {
        const {device_id} = req.query

        const genre = await db("master_genre")
            .select("id", "name")
            .where({device_id})

        const category = await db("master_category")
            .select("id", "name")
            .where({device_id})

        res.status(200).json({message: "list filter", data: {genre, category}})

    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}
