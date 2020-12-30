const express = require('express');
const {login, register, verifyEmail} = require("../controller/user/authController");
const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post("/verifyEmail", verifyEmail);

module.exports = router;
