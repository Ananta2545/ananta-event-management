const express = require("express");
const router = express.Router();

const {
  getVendors,
  getVendorProducts,
  placeOrder,
  getMyOrders,
  getOrderById,
  getGuestList,
  addGuest,
  updateGuest,
  deleteGuest,
} = require("../controllers/userController");

const { authenticate, authorize } = require("../middleware/auth");

// All user routes require authentication + user role
router.use(authenticate, authorize("user"));

// Browse vendors
router.get("/vendors", getVendors);
router.get("/vendors/:id/products", getVendorProducts);

// Orders
router.post("/orders", placeOrder);
router.get("/orders", getMyOrders);
router.get("/orders/:id", getOrderById);

// Guest list (support both /guests and /guest-list)
router.get("/guests", getGuestList);
router.get("/guest-list", getGuestList);
router.post("/guests", addGuest);
router.post("/guest-list", addGuest);
router.put("/guests/:guestId", updateGuest);
router.put("/guest-list/:guestId", updateGuest);
router.delete("/guests/:guestId", deleteGuest);
router.delete("/guest-list/:guestId", deleteGuest);

module.exports = router;
