const express = require('express');
const {bannerUser, ourPartner, searchProduct} = require("../controller/user/homeController");

const {detailProduct} = require("../controller/user/productController");
const {authMiddleware} = require("../middleware/authMiddleware");
const {login, register, verifyEmail} = require("../controller/user/authController");
const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post("/verifyEmail", verifyEmail);

router.post("/detailProduct", detailProduct)

router.get("/banner", bannerUser)
router.get("/ourPartner", ourPartner)

router.get("/searchProduct", searchProduct)

module.exports = router;
