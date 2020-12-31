const express = require('express');
const {addCart, showCart, updateQuantity, deleteCart, order} = require("../controller/user/orderController");
const {bannerUser, ourPartner, searchProduct, recommendProduct, todayOffer} = require("../controller/user/homeController");

const {detailProduct, addToFavourites, removeToFavourites} = require("../controller/user/productController");
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

router.get("/recommendProduct", recommendProduct)
router.get("/todayOffer", todayOffer)

router.post('/addCart', authMiddleware, addCart)
router.get('/showCart', authMiddleware, showCart)
router.put('/updateQuantity', authMiddleware, updateQuantity)
router.delete('/deleteCart', authMiddleware, deleteCart)

router.post('/addToFavourites', authMiddleware, addToFavourites)
router.post('/removeToFavourites', authMiddleware, removeToFavourites)

router.post("/order", authMiddleware, order)

module.exports = router;
