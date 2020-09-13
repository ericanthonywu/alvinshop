const express = require('express');
const router = express.Router();
const {login, register} = require("../controller/admin/authController");
const {authMiddleware} = require("../middleware/authMiddleware");
const {showCategory, addCategory, deleteCategory, editCategory} = require("../controller/admin/categoryController");
const {showProduk, addProduct, deleteProduct, editImageProduct, editProduct, showImageProductById} = require("../controller/admin/productController");
const {showOrder, confirmOrder, showDetailOrder} = require("../controller/admin/orderController");
const {showDevice, addDevice, deleteDevice, editDevice} = require("../controller/admin/deviceController");
const {showBanner, addBanner, deleteBanner, editBanner, updateOrderBanner} = require("../controller/admin/bannerController");
const fileHandler = require("../middleware/uploadFileMiddleware")
const {showOurPartner, addOurPartner, deleteOurPartner, editOurPartner} = require("../controller/admin/ourPartnerController");
const {updateSettings, getSettings, migrateSettings} = require("../controller/admin/settingsController");

router.post('/login', login);
router.post('/register', register);

router.get("/showCategory", authMiddleware, showCategory)
router.post("/addCategory", authMiddleware, addCategory)
router.put("/editCategory", authMiddleware, editCategory)
router.post("/deleteCategory", authMiddleware, deleteCategory)

router.get("/showProduk", authMiddleware, showProduk)
router.get("/showImageProductById", authMiddleware, showImageProductById)
router.post("/addProduct", fileHandler("produk").array("image"), authMiddleware, addProduct)
router.put("/editProduct", authMiddleware, editProduct)
router.put("/editImageProduct", fileHandler("produk").single("image"), authMiddleware, editImageProduct)
router.post("/deleteProduct", authMiddleware, deleteProduct)

router.get("/showOrder", authMiddleware, showOrder)
router.post("/showDetailOrder", authMiddleware, showDetailOrder)
router.post("/confirmOrder", authMiddleware, confirmOrder)

router.get("/showDevice", authMiddleware, showDevice)
router.post("/addDevice", authMiddleware, addDevice)
router.put("/editDevice", authMiddleware, editDevice)
router.post("/deleteDevice", authMiddleware, deleteDevice)

router.get("/showBanner", authMiddleware, showBanner)
router.post("/addBanner", fileHandler("banner").single("image"), authMiddleware, addBanner)
router.put("/editBanner", fileHandler("banner").single("image"), authMiddleware, editBanner)
router.put("/updateOrderBanner", authMiddleware, updateOrderBanner)
router.post("/deleteBanner", authMiddleware, deleteBanner)

router.put("/updateSettings", updateSettings)
router.get("/getSettings", getSettings)
router.get("/migrateSettings", migrateSettings)

router.get("/showOurPartner", authMiddleware, showOurPartner)
router.post("/addOurPartner", fileHandler("our_partner").single("image"), authMiddleware, addOurPartner)
router.put("/editOurPartner", fileHandler("our_partner").single("image"), authMiddleware, editOurPartner)
router.post("/deleteOurPartner", authMiddleware, deleteOurPartner)

module.exports = router;
