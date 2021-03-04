const db = require('../../database')

exports.addCart = (req, res) => {
    const {product_id, quantity} = req.body

    db("cart")
        .insert({user_id: res.userData.id, product_id, quantity})
        .then(() => res.status(200).json({message: "cart added"}))
        .catch(err => res.status(500).json(err))
}

exports.showCart = (req, res) => {
    db("cart")
        .where({user_id: res.userData.id})
        .join('product', 'product.id', 'cart.product_id')
        .select(
            'quantity',
            'product.price as product_price',
            "product.stock as product_stock",
            "product.discount as product_discount",
            "product.title as product_title",
            db.raw("CONCAT('uploads/produk/', product_image.image_name) as product_image")
        )
        .leftJoin("product_image", "product_image.product_id", "product.id")
        .then(data => res.status(200).json({message: "cart data", data}))
        .catch(err => res.status(500).json(err))
}

exports.updateQuantity = (req, res) => {
    const {product_id, quantity} = req.body

    db("cart")
        .update({quantity})
        .where({user_id: res.userData.id, product_id})
        .then(() => res.status(200).json({message: "cart updated"}))
        .catch(err => res.status(500).json(err))
}

exports.deleteCart = (req, res) => {
    const {product_id} = req.body

    db("cart")
        .del()
        .where({user_id: res.userData.id, product_id})
        .then(() => res.status(200).json({message: "cart deleted"}))
        .catch(err => res.status(500).json(err))
}

exports.order = (req, res) => {
    if (!req.file) {
        return res.status(400).json({message: "file is required"})
    }
    db.transaction(trx => {
        trx("cart")
            .select('product_id', 'quantity')
            .where({user_id: res.userData.id})
            .then(cartData => {
                trx("cart")
                    .where({user_id: res.userData.id})
                    .del()
                    .then(() => {
                        trx("order")
                            .insert({
                                user_id: res.userData.id,
                                file: req.file.filename
                            }, 'id')
                            .then(([order_id]) => {
                                trx("order_detail")
                                    .insert(cartData.map(data => ({...data, order_id})))
                                    .then(() => {
                                        trx("order")
                                            .where({id: order_id})
                                            .update({
                                                order_code: `order-${Date.now()}-${res.userData.id}-${Math.round(Math.random() * 1000000)}`,
                                                total_price: db("order_detail")
                                                    .where({order_id})
                                                    .sum("product.price")
                                                    .first()
                                                    .join("product", "product.id", "order_detail.product_id")
                                            })
                                            .then(trx.commit)
                                            .catch(trx.rollback)
                                    }).catch(trx.rollback)
                            }).catch(trx.rollback)
                    }).catch(trx.rollback)
            }).catch(trx.rollback)
    }).then(() => res.status(200).json({message: "ordered successfully"}))
        .catch(err => res.status(500).json(err))
}
