const db = require('../../db');

exports.showBanner = (req,res) => {
    db("banner")
        .select(
            'banner_name',
            'url',
            db.raw("CONCAT('uploads/banner', image) as banner_image")
        )
        .orderBy('sequence', 'asc')
        .then(data => res.status(200).json({message: "banner", data}))
        .catch(err => res.status(500).json(err))
}
