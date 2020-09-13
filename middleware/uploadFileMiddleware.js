const multer = require('multer')
const path = require('path')

/**
 * @param {string} prefix
 */
module.exports = (prefix) => multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            req.dest = prefix;
            cb(null, path.join(__dirname, `../uploads/${req.dest}`))
        },
        filename: (req, file, cb) =>
            cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname.trim())
    }),
});
