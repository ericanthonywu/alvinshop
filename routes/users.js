const express = require('express');
const {addCart, showCart, updateQuantity, deleteCart, order} = require("../controller/user/orderController");
const {
    bannerUser,
    ourPartner,
    searchProduct,
    recommendProduct,
    todayOffer,
    getListFilter,
    getSettings,
    getDevice
} = require("../controller/user/homeController");
const fileHandler = require("../middleware/uploadFileMiddleware")
const {detailProduct, addToFavourites, removeToFavourites, getProductByGenreAndCategory} = require("../controller/user/productController");
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

router.post("/recommendProduct", recommendProduct)
router.post("/todayOffer", todayOffer)

router.post('/addCart', authMiddleware, addCart)
router.get('/showCart', authMiddleware, showCart)
router.put('/updateQuantity', authMiddleware, updateQuantity)
router.post('/deleteCart', authMiddleware, deleteCart)

router.post('/addToFavourites', authMiddleware, addToFavourites)
router.post('/removeToFavourites', authMiddleware, removeToFavourites)

router.post("/order", fileHandler("order").single("image"), authMiddleware, order)
router.get("/getListFilter", getListFilter)

router.post('/getProductByGenreAndCategory', getProductByGenreAndCategory)

router.get("/getSettings", getSettings)

router.get("/getDevice", getDevice)

module.exports = router;
