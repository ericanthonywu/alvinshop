const db = require('../../database')

exports.detailProduct = (req, res) => {
    const {id} = req.body

    db.transaction(trx => {
        trx("product")
            .where({id})
            .first('*')
            .then(data => {
                if (!data){
                    return trx.rollback()
                }
                trx("product_image")
                    .where({product_id: id})
                    .select(
                        db.raw(`CONCAT('uploads/produk/', image_name) as product_image`)
                    )
                    .then(imageData => {
                        trx("category")
                            .where({product_id: id})
                            .join("master_category", "category.category_id", "master_category.id")
                            .select("master_category.id as id", "master_category.name as category")
                            .then(category => {
                                trx("genre")
                                    .join("master_genre", "genre.genre_id", "master_genre.id")
                                    .select("master_genre.id as id", "master_genre.name as genre")
                                    .where({product_id: id})
                                    .then(genre => {
                                        trx("device")
                                            .where({product_id: id})
                                            .join("master_device", "device.device_id", "master_device.id")
                                            .select("master_device.id as id", "master_device.name as device")
                                            .then(device =>
                                                trx.commit({
                                                    ...data,
                                                    image: imageData,
                                                    category,
                                                    device,
                                                    genre
                                                })
                                            ).catch(trx.rollback)
                                    }).catch(trx.rollback)
                            }).catch(trx.rollback)
                    }).catch(trx.rollback)
            }).catch(trx.rollback)
    }).then(data => res.status(200).json({message: "product data", data}))
        .catch(err => err ? res.status(404).json({message: "no such product"}) : res.status(500).json(err))
}

exports.getProductByGenreAndCategory = (req, res) => {
    const {genre_id, category_id} = req.body

    db("product")
        .leftJoin('genre','genre.product_id','product.id')
        .leftJoin('category','category.product_id','product.id')
        .leftJoin("product_image", "product_image.product_id", "product.id")
        .where({"category.category_id": category_id, "genre.genre_id": genre_id})
        .where('stock', '>', 0)
        .select(
            "product.id as product_id",
            "title",
            db.raw("CONCAT('uploads/produk/', product_image.image_name) as image")
        )
        .leftJoin("product_image", "product_image.id",
            db.raw(`(${db("product_image")
                .select('id')
                .where({product_id: db.raw("product.id")})
                .limit(1)
                .toQuery()})`)
        )
        .then(data => res.status(200).json({message: "filtered product", data}))
        .catch(err => res.status(500).json(err))
}

exports.addToFavourites = (req,res) => {
    const {product_id} = req.body
    db("user_favourites")
        .insert({user_id: res.userData.id, product_id})
        .then(() => res.status(200).json({message: "favourites added"}))
        .catch(err => res.status(500).json(err))
}

exports.removeToFavourites = (req,res) => {
    const {product_id} = req.body
    db("user_favourites")
        .where({user_id: res.userData.id, product_id})
        .del()
        .then(() => res.status(200).json({message: "favourites removed"}))
        .catch(err => res.status(500).json(err))
}
