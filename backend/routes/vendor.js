import express from "express";
import {
  getMyProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getVendorOrders,
  updateOrderStatus,
  getVendorDashboard,
} from "../controllers/vendorController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import upload from "../config/multer.js";

const router = express.Router();

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

export default router;
