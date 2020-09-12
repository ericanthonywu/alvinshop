const express = require('express');
const {login, register} = require("../controller/user/authController");
const router = express.Router();
const { body } = require('express-validator');

router.post('/login', login);
router.post('/register', register);

module.exports = router;
