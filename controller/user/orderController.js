const db = require('../../database')

exports.addCart = async (req, res) => {
    try {
        const {product_id, quantity} = req.body

        const {total} = await db("cart")
            .where({
                user_id: res.userData.id, product_id
            })
            .count("id as total")
            .first()
        if (total > 0) {
            return res.status(400).json({message: 'product is already added'})
        }

        const data = await db("product").where({id: product_id}).first("stock")
        if (!data) {
            return res.status(400).json({message: "product id not found"})
        }

        if (data.stock < quantity) {
            return res.status(400).json({message: "quantity more than stock"})
        }

        await db("cart")
            .insert({user_id: res.userData.id, product_id, quantity})

        res.status(200).json({message: "cart added"})

    } catch (err) {
        res.status(500).json(err)
    }
}

exports.showCart = (req, res) => {
    db("cart")
        .where({user_id: res.userData.id})
        .join('product', 'product.id', 'cart.product_id')
        .select(
            'quantity',
            'product.price as product_price',
            'product.id as product_id',
            "product.stock as product_stock",
            "product.discount as product_discount",
            "product.title as product_title",
            db.raw("CONCAT('uploads/produk/', pim.image_name) as product_image")
        )
        .leftJoin("product_image", "product_image.product_id", "product.id")
        .joinRaw("join (select id, image_name from product_image where product_id = product_image.product_id limit 1) pim on pim.id = `product_image`.id")
        .then(data => res.status(200).json({message: "cart data", data}))
        .catch(err => res.status(500).json(err))
}

exports.updateQuantity = async (req, res) => {
    try {
        const {product_id, quantity} = req.body

        const data = await db("product").where({id: product_id}).first("stock")
        if (!data) {
            return res.status(400).json({message: "product id not found"})
        }

        if (data.stock < quantity) {
            return res.status(400).json({message: "quantity more than stock"})
        }

        await db("cart")
            .update({quantity})
            .where({user_id: res.userData.id, product_id})

        res.status(200).json({message: "cart updated"})

    } catch (err) {
        res.status(500).json(err)
    }
}

exports.deleteCart = (req, res) => {
    const {product_id} = req.body

    db("cart")
        .del()
        .where({user_id: res.userData.id, product_id})
        .then(() => res.status(200).json({message: "cart deleted"}))
        .catch(err => res.status(500).json(err))
}

exports.order = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({message: "file is required"})
    }
    try {
        const cartData = await db("cart")
            .select('product_id', 'quantity')
            .where({user_id: res.userData.id})

        if (!cartData.length) {
            return res.status(400).json({message: "cart empty"})
        }
        for (let i = 0; i < cartData.length; i++) {
            const {product_id, quantity} = cartData[i]
            await db("product")
                .where({id: product_id})
                .update({
                    stock: db.raw(`\`stock\` - ${quantity}`)
                })
        }
        await db("cart")
            .where({user_id: res.userData.id})
            .del()

        const [order_id] = await db("order")
            .insert({
                user_id: res.userData.id,
                file: req.file.filename
            }, 'id')

        await db("order_detail")
            .insert(cartData.map(data => ({...data, order_id})))

        await db("order")
            .where({id: order_id})
            .update({
                order_code: `order-${Date.now()}-${res.userData.id}-${Math.round(Math.random() * 1000000)}`,
                total_price: db("order_detail")
                    .where({order_id})
                    .sum("product.price")
                    .first()
                    .join("product", "product.id", "order_detail.product_id")
            })
        res.status(200).json({message: "ordered successfully"})
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}
