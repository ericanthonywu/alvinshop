const multer = require('multer')
const path = require('path')

exports.uploadKTPToko = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            req.dest = "KTPtoko";
            cb(null, path.join(__dirname, `../uploads/${req.dest}`))
        },
        filename: (req, file, cb) =>
            cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname.trim())
    }),
});

exports.gambarJenis = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            req.dest = "jenis";
            cb(null, path.join(__dirname, `../uploads/${req.dest}`))
        },
        filename: (req, file, cb) =>
            cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname.trim())
    }),
});

exports.gambarKategori = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            req.dest = "kategori";
            cb(null, path.join(__dirname, `../uploads/${req.dest}`))
        },

        filename: (req, file, cb) =>
            cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname.trim())
    }),
});

exports.gambarBanner = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            req.dest = "banner";
            cb(null, path.join(__dirname, `../uploads/${req.dest}`))
        },
        filename: (req, file, cb) =>
            cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname.trim())
    }),
});

exports.gambarProduk = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            req.dest = "produk";
            cb(null, path.join(__dirname, `../uploads/${req.dest}`))
        },
        filename: (req, file, cb) =>
            cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname.trim())
    }),
});

exports.gambarProfilToko = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            req.dest = "toko";
            cb(null, path.join(__dirname, `../uploads/${req.dest}`))
        },
        filename: (req, file, cb) =>
            cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname.trim())
    }),
});


exports.gambarBannerToko = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            req.dest = "bannerToko";
            cb(null, path.join(__dirname, `../uploads/${req.dest}`))
        },
        filename: (req, file, cb) =>
            cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname.trim())
    }),
});

exports.gambarPoster = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            req.dest = "poster";
            cb(null, path.join(__dirname, `../uploads/${req.dest}`))
        },
        filename: (req, file, cb) =>
            cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname.trim())
    }),
});

exports.gambarMerekPopuler = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            req.dest = "merekPopuler";
            cb(null, path.join(__dirname, `../uploads/${req.dest}`))
        },
        filename: (req, file, cb) =>
            cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname.trim())
    }),
});