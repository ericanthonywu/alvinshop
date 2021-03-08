const express = require('express');
const {getSettings} = require("../controller/admin/settingsController");
const {addCart, showCart, updateQuantity, deleteCart, order} = require("../controller/user/orderController");
const {
    bannerUser,
    ourPartner,
    searchProduct,
    recommendProduct,
    todayOffer,
    getListFilter,
} = require("../controller/user/homeController");
const fileHandler = require("../middleware/uploadFileMiddleware")
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
router.post('/deleteCart', authMiddleware, deleteCart)

router.post('/addToFavourites', authMiddleware, addToFavourites)
router.post('/removeToFavourites', authMiddleware, removeToFavourites)

router.post("/order", fileHandler("order").single("image"), authMiddleware, order)
router.get("/getListFilter", getListFilter)

router.get("/getSettings", getSettings)

module.exports = router;
