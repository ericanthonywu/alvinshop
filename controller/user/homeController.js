const db = require('../../database');

exports.bannerUser = (req,res) => {
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

exports.searchProduct = (req,res) => {
    const {keyword} = req.query
    db("product")
        .where('title', 'like', `${keyword}%`)
        .select(
            "product.id as product_id",
            "title",
            "price",
            "stock",
            db.raw("CONCAT('uploads/product/', product_image.image_name) as product_image")
        )
        .leftJoin("product_image","product_image.product_id","product.id")
        .then(data => res.status(200).json({message: "banner", data: {data, prefix: "uploads/our_partner"}}))
        .catch(err => res.status(500).json(err))
}

exports.ourPartner = (req,res) => {
    db("our_partner")
        .select('*')
        .then(data => res.status(200).json({message: "our partner", data}))
        .catch(err => res.status(500).json(err))
}

exports.recommendProduct = (req,res) => {
    db("product")
        .select(
            "product.id as product_id",
            "title",
            db.raw("CONCAT('uploads/product/', product_image.image_name) as product_image")
        )
        // .distinct("order_detail.product_id")
        .leftJoin("product_image","product_image.product_id","product.id")
        .leftJoin("order_detail","order_detail.product_id", "product.id")
        .where('stock', '>', 0)
        .orderBy("order_detail.product_id", "desc")
        .limit(5)
        .then(data => res.status(200).json({message: "recommend product", data}))
        .catch(err => res.status(500).json(err))
}

exports.todayOffer = (req,res) => {
    db("product")
        .select(
            "product.id as product_id",
            "title",
            db.raw("CONCAT('uploads/product/', product_image.image_name) as product_image")
        )
        .leftJoin("product_image","product_image.product_id","product.id")
        .orderBy("product.created_at","desc")
        .limit(10)
        .then(data => res.status(200).json({message: "todays offer product", data}))
        .catch(err => res.status(500).json(err))
}

exports.getCategory = (req,res) => {
    db("master_category")
        .select("name")
        .then(data => res.status(200).json({message: "data categories", data}))
        .catch(err => res.status(500).json(err))
}

exports.getGenre = (req,res) => {
    db("master_genre")
        .select("name")
        .then(data => res.status(200).json({message: "data genre", data}))
        .catch(err => res.status(500).json(err))
}

exports.getSettings = (req,res) => {
    db("settings")
        .select("*")
        .then(data => res.status(200).json({message: "data setting", data}))
        .catch(err => res.status(500).json(err))
}
