const nodeMailer = require('nodemailer');

/**
 * Send email function
 *
 * @type {Mail}
 */
exports.sendEmail = nodeMailer.createTransport({
    // host: "smtp.gmail.com",
    // port: process.env.EMAILPORT,
    // secure: true,
    service: "Gmail",
    // requireTLS: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAILPASSWORD
    }
})
