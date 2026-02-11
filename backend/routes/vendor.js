const express = require("express");
const router = express.Router();

const {
  getMyProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getVendorOrders,
  updateOrderStatus,
  getVendorDashboard,
} = require("../controllers/vendorController");

const { authenticate, authorize } = require("../middleware/auth");
const upload = require("../config/multer");

// All vendor routes require authentication + vendor role
router.use(authenticate, authorize("vendor"));

// Dashboard
router.get("/dashboard", getVendorDashboard);

// Products
router.get("/products", getMyProducts);
router.get("/products/:id", getProductById);
router.post("/products", upload.single("image"), addProduct);
router.put("/products/:id", upload.single("image"), updateProduct);
router.delete("/products/:id", deleteProduct);

// Orders / Transactions
router.get("/orders", getVendorOrders);
router.put("/orders/:id/status", updateOrderStatus);

module.exports = router;
