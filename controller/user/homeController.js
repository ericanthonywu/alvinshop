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
        .join("product_image","product_image.product_id","product.id")
        .then(data => res.status(200).json({message: "banner", data}))
        .catch(err => res.status(500).json(err))
}
exports.ourPartner = (req,res) => {
    db("our_partner")
        .select('*')
        .then(data => res.status(200).json({message: "our partner", data}))
        .catch(err => res.status(500).json(err))
}
