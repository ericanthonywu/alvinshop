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
                        db.raw(`CONCAT('uploads/product/', image_name) as product_image`)
                    )
                    .then(imageData => {
                        trx("genre")
                            .where({product_id: id})
                            .join("master_category", "master_category.id", "genre.category_id")
                            .select("master_category.name as category_name")
                            .then(category_data => trx.commit({...data, imageData, category_data}))
                            .catch(trx.rollback)
                    }).catch(trx.rollback)
            }).catch(trx.rollback)
    }).then(data => res.status(200).json({message: "product data", data}))
        .catch(err => err ? res.status(404).json({message: "no such product"}) : res.status(500).json(err))
}
