const db = require("../../database")

/**
 * Handle Show Order
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.showOrder = (req, res) => {
    const {limit, offset} = req.query
    db("order")
        .select(
            "order.id as order_id",
            "order_code",
            "total_price",
            "user.username",
            "ordered_at",
            "file",
            "nama_rekening",
            "bank",
            "tgl_transfer"
        )
        .join("user", "order.user_id", "user.id")
        .limit(limit)
        .offset(offset)
        .then(data => res.status(200).json({message: "Order data", data: {data, prefix: "uploads/order"}}))
        .catch(err => res.status(500).json({message: "Error running query", error: err}))
}

/**
 * Handle Show Detail Order
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */
exports.showDetailOrder = (req, res) => {
    const {order_id} = req.body

    db("order_detail")
        .select(
            "title",
            "price",
            "description",
            "quantity"
        )
        .where({order_id})
        .join("product", "order_detail.product_id", "product.id")
        .then(data => res.status(data.length ? 200 : 404).json({message: "Detail order data", data}))
        .catch(err => res.status(500).json({message: "Error running query", error: err}))
}

/**
 * Handle Confirm Order
 *
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} req
 * @param {Response<P, ResBody, ReqQuery>} res
 */

exports.confirmOrder = (req, res) => {
    const {confirm, id} = req.body
    let order_confirmed;

    switch (parseInt(confirm)) {
        case 1:
            order_confirmed = true
            break;
        case 2:
            order_confirmed = false
            break;
        default:
            return res.status(400).json({message: "confirm status invalid"})
    }

    db("order")
        .where({id})
        .update({order_confirmed})
        .then(() => res.status(200).json({message: `Order ${!order_confirmed ? "un" : ""}confirmed`}))
        .catch(err => res.status(500).json({message: "Error running query", error: err}))
}
