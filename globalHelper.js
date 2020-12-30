const nodeMailer = require('nodemailer');

/**
 * Send email function
 *
 * @type {Mail}
 */
exports.sendEmail = nodeMailer.createTransport({
    service: "Gmail",
    host: 'smtp.gmail.com',
    port: 587,
    ignoreTLS: false,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAILPASSWORD
    }
})
