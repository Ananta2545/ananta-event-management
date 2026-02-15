import express from "express";
import {
  getVendors,
  getVendorProducts,
  placeOrder,
  getMyOrders,
  getOrderById,
  getGuestList,
  addGuest,
  updateGuest,
  deleteGuest,
} from "../controllers/userController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate, authorize("user"));

router.get("/vendors", getVendors);
router.get("/vendors/:id/products", getVendorProducts);

router.post("/orders", placeOrder);
router.get("/orders", getMyOrders);
router.get("/orders/:id", getOrderById);

router.get("/guests", getGuestList);
router.get("/guest-list", getGuestList);
router.post("/guests", addGuest);
router.post("/guest-list", addGuest);
router.put("/guests/:guestId", updateGuest);
router.put("/guest-list/:guestId", updateGuest);
router.delete("/guests/:guestId", deleteGuest);
router.delete("/guest-list/:guestId", deleteGuest);

export default router;
