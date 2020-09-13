const express = require('express');
const router = express.Router();
const {login, register} = require("../controller/admin/authController");
const {authMiddleware} = require("../middleware/authMiddleware");
const {showCategory, addCategory, deleteCategory, editCategory} = require("../controller/admin/categoryController");
const {showProduk, addProduct, deleteProduct, editImageProduct, editProduct, showImageProductById} = require("../controller/admin/productController");
const {showOrder, confirmOrder, showDetailOrder} = require("../controller/admin/orderController");
const {showDevice, addDevice, deleteDevice, editDevice} = require("../controller/admin/deviceController");


router.post('/login', login);
router.post('/register', register);

router.get("/showCategory", authMiddleware, showCategory)
router.post("/addCategory", authMiddleware, addCategory)
router.put("/editCategory", authMiddleware, editCategory)
router.post("/deleteCategory", authMiddleware, deleteCategory)

router.get("/showProduk", authMiddleware, showProduk)
router.get("/showImageProductById", authMiddleware, showImageProductById)
router.post("/addProduct", authMiddleware, addProduct)
router.put("/editProduct", authMiddleware, editProduct)
router.put("/editImageProduct", authMiddleware, editImageProduct)
router.post("/deleteProduct", authMiddleware, deleteProduct)

router.get("/showOrder", authMiddleware, showOrder)
router.post("/showDetailOrder", authMiddleware, showDetailOrder)
router.post("/confirmOrder", authMiddleware, confirmOrder)

router.get("/showDevice", authMiddleware, showDevice)
router.post("/addDevice", authMiddleware, addDevice)
router.put("/editDevice", authMiddleware, editDevice)
router.post("/deleteDevice", authMiddleware, deleteDevice)

module.exports = router;
