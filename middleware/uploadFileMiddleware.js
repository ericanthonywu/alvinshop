const multer = require('multer')
const path = require('path')
const fs = require('fs')

/**
 * Handle file upload
 *
 * @param {string} prefix
 */
module.exports = (prefix) => multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            req.dest = prefix;
            try {
                fs.mkdirSync(path.join(__dirname, `../uploads`), {recursive: true})
                fs.mkdirSync(path.join(__dirname, `../uploads/${req.dest}`), {recursive: true})
            } catch (e) {
                console.log(e)
            }
            cb(null, path.join(__dirname, `../uploads/${req.dest}`))
        },
        filename: (req, file, cb) =>
            cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname.trim())
    }),
});
