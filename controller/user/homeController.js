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

exports.ourPartner = (req,res) => {
    db("banner")
        .select('*')
        .then(data => res.status(200).json({message: "our partner", data}))
        .catch(err => res.status(500).json(err))
}
