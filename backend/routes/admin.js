import express from "express";
import User from "../models/User.js";
import {
  getAllVendors,
  addVendor,
  updateVendor,
  updateMembership,
  deleteVendor,
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
  getDashboardStats,
  getAllTransactions,
} from "../controllers/adminController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate, authorize("admin"));

router.get("/dashboard", getDashboardStats);
router.get("/transactions", getAllTransactions);

router.get("/vendors", getAllVendors);
router.post("/vendors", addVendor);
router.get("/vendors/:id", async (req, res, next) => {
  try {
    const vendor = await User.findOne({ _id: req.params.id, role: "vendor" });
    if (!vendor) return res.status(404).json({ message: "Vendor not found." });
    res.json(vendor);
  } catch (err) {
    next(err);
  }
});
router.put("/vendors/:id", updateVendor);
router.put("/vendors/:id/extend", (req, res, next) => {
  req.body.action = "extend";
  updateMembership(req, res, next);
});
router.put("/vendors/:id/cancel", (req, res, next) => {
  req.body.action = "cancel";
  updateMembership(req, res, next);
});
router.put("/vendors/:id/membership", updateMembership);
router.delete("/vendors/:id", deleteVendor);

router.get("/users", getAllUsers);
router.post("/users", addUser);
router.get("/users/:id", async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id, role: "user" });
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (err) {
    next(err);
  }
});
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;
